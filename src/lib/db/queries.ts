import type { Database } from "./types";

type Tables = Database["public"]["Tables"];
type Table = keyof Tables;
type Row<T extends Table> = Tables[T]["Row"];
type Insert<T extends Table> = Tables[T]["Insert"];
type Column<T extends Table> = Extract<keyof Row<T>, string>;
export type SqlExecutor = (sql: string, values: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
type Result<T> = { data: T | null; error: { message: string; code: string } | null; count: number | null };
type SelectOptions<T extends Table> = {
  equals?: Partial<Row<T>>;
  notNull?: Column<T>;
  orderBy?: Column<T>;
  ascending?: boolean;
  limit?: number;
  head?: boolean;
};

const tables = new Set<string>([
  "leads", "client_intakes", "project_requests", "talent_applications", "admin_users",
  "seo_audits", "seo_issues", "keyword_opportunities", "content_recommendations",
  "indexed_urls", "website_alerts", "investor_deck_events", "whitepaper_events"
]);

function identifier(value: string) {
  if (!/^[a-z_][a-z0-9_]*$/.test(value)) throw new Error("Invalid database identifier.");
  return `"${value}"`;
}

function tableName(table: Table) {
  if (!tables.has(table)) throw new Error("Unknown database table.");
  return `public.${identifier(table)}`;
}

// Return diagnostics without SQL, credentials, or submitted personal information.
export function storageError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "DATABASE_ERROR";
  return {
    message: "Database request failed. Check server configuration and database availability.",
    code: /^[A-Z0-9_]{1,40}$/.test(code) ? code : "DATABASE_ERROR"
  };
}

export class DatabaseStore {
  constructor(private readonly execute: SqlExecutor, private readonly throwOnError = false) {}

  private async result<T>(work: () => Promise<{ data: T; count?: number }>): Promise<Result<T>> {
    try {
      const result = await work();
      return { data: result.data, error: null, count: result.count ?? null };
    } catch (error) {
      if (this.throwOnError) throw error;
      const safe = storageError(error);
      console.error("Database request failed", { code: safe.code });
      return { data: null, error: safe, count: null };
    }
  }

  select<T extends Table>(table: T, options: SelectOptions<T> = {}): Promise<Result<Row<T>[]>> {
    return this.result(async () => {
      const values: unknown[] = [];
      const filters = Object.entries(options.equals ?? {}).map(([column, value]) => {
        if (value === null) return `${identifier(column)} IS NULL`;
        values.push(value);
        return `${identifier(column)} = $${values.length}`;
      });
      if (options.notNull) filters.push(`${identifier(options.notNull)} IS NOT NULL`);
      const where = filters.length ? ` WHERE ${filters.join(" AND ")}` : "";
      if (options.head) {
        const { rows } = await this.execute(`SELECT count(*)::integer AS count FROM ${tableName(table)}${where}`, values);
        return { data: [] as Row<T>[], count: Number(rows[0].count) };
      }
      const limit = options.limit ?? 1000;
      if (!Number.isInteger(limit) || limit < 1 || limit > 10000) throw new Error("Invalid database limit.");
      const order = options.orderBy ? ` ORDER BY ${identifier(options.orderBy)} ${options.ascending === false ? "DESC" : "ASC"}` : "";
      values.push(limit);
      const { rows } = await this.execute(`SELECT * FROM ${tableName(table)}${where}${order} LIMIT $${values.length}`, values);
      // pg returns timestamps as Date; retain the application's existing ISO string contract.
      const data = rows.map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value]))) as Row<T>[];
      return { data };
    });
  }

  insert<T extends Table>(table: T, input: Insert<T> | Insert<T>[]): Promise<Result<Row<T>[]>> {
    return this.result(async () => {
      const rows = Array.isArray(input) ? input : [input];
      if (!rows.length) return { data: [] as Row<T>[] };
      const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
      if (!columns.length) throw new Error("Empty database insert.");
      const values: unknown[] = [];
      const tuples = rows.map(row => `(${columns.map(column => {
        const value = (row as Record<string, unknown>)[column];
        if (value === undefined) return "DEFAULT";
        values.push(value);
        return `$${values.length}`;
      }).join(", ")})`);
      const result = await this.execute(`INSERT INTO ${tableName(table)} (${columns.map(identifier).join(", ")}) VALUES ${tuples.join(", ")} RETURNING *`, values);
      return { data: result.rows as Row<T>[] };
    });
  }

  async selectOne<T extends Table>(table: T, options: SelectOptions<T> = {}): Promise<Result<Row<T>>> {
    const result = await this.select(table, { ...options, limit: 1 });
    return { ...result, data: result.data?.[0] ?? null };
  }

  async insertOne<T extends Table>(table: T, input: Insert<T>): Promise<Result<Row<T>>> {
    const result = await this.insert(table, input);
    return { ...result, data: result.data?.[0] ?? null };
  }
}

export async function runTransaction<T>(execute: SqlExecutor, work: (store: DatabaseStore) => Promise<T>): Promise<T> {
  await execute("BEGIN", []);
  try {
    const value = await work(new DatabaseStore(execute, true));
    await execute("COMMIT", []);
    return value;
  } catch (error) {
    await execute("ROLLBACK", []).catch(() => undefined);
    throw error;
  }
}
