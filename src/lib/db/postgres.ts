import "server-only";
import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";
import { getDatabaseConfig } from "./config";
import { DatabaseStore, runTransaction, storageError } from "./queries";

const state = globalThis as typeof globalThis & { temacorePool?: Pool };

function getPool() {
  if (!state.temacorePool) {
    const { connectionString } = getDatabaseConfig();
    if (!connectionString) throw new Error("PostgreSQL is not configured.");
    const pool = new Pool({
      connectionString,
      max: 5,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      statement_timeout: 15000,
      application_name: "temacore-website"
    });
    pool.on("error", error => console.error("Database pool error", { code: storageError(error).code }));
    attachDatabasePool(pool);
    state.temacorePool = pool;
  }
  return state.temacorePool;
}

export function getDatabase() {
  return new DatabaseStore((sql, values) => getPool().query(sql, values));
}

export async function checkDatabaseReadiness() {
  // Validate runtime connectivity and critical schema access without reading records.
  await getPool().query(`
    SELECT leads.id, client_intakes.lead_id, client_intakes.workflow_summary
    FROM public.leads CROSS JOIN public.client_intakes
    LIMIT 0
  `);
}

export async function withDatabaseTransaction<T>(work: (store: DatabaseStore) => Promise<T>) {
  const client = await getPool().connect();
  try {
    return await runTransaction((sql, values) => client.query(sql, values), work);
  } finally {
    client.release();
  }
}
