import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { Pool } from 'pg';

export function loadDatabaseEnvironment() {
  // Local only; Vercel supplies environment variables directly. Never print values.
  if (existsSync('.env.local')) process.loadEnvFile('.env.local');
}

export function databaseConnectionString(environment, { migration = false } = {}) {
  const runtimeUrl = environment.DATABASE_URL || environment.POSTGRES_URL || environment.TEMACORE_DATABASE_URL;
  const connectionString = migration
    ? environment.DATABASE_MIGRATION_URL || environment.DATABASE_URL_UNPOOLED || runtimeUrl
    : runtimeUrl;
  if (!connectionString) throw Object.assign(new Error('Database connection is not configured.'), { code: 'DATABASE_URL_MISSING' });
  try {
    const url = new URL(connectionString);
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname) throw new Error();
  } catch {
    throw Object.assign(new Error('Database connection URL is invalid.'), { code: 'DATABASE_URL_INVALID' });
  }
  return connectionString;
}

export function databasePool({ migration = false } = {}) {
  loadDatabaseEnvironment();
  const connectionString = databaseConnectionString(process.env, { migration });
  return new Pool({ connectionString, max: 1, connectionTimeoutMillis: 10000, statement_timeout: 60000 });
}

export function databaseFailureMessage(error) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,40}$/.test(error.code) ? error.code : 'DATABASE_ERROR';
  const hints = {
    DATABASE_URL_MISSING: 'Set DATABASE_URL, POSTGRES_URL, or TEMACORE_DATABASE_URL for this Vercel project in the Production environment, then redeploy. Other custom-prefixed variable names are not used automatically.',
    DATABASE_URL_INVALID: 'The configured value must be a PostgreSQL connection URL, not a dashboard URL or API key. Check it privately in Vercel.',
    ENOTFOUND: 'The database hostname could not be resolved. Check the connection setting privately in Vercel.',
    ETIMEDOUT: 'The database connection timed out. Check provider availability and network access.',
    '28P01': 'PostgreSQL rejected the credentials. Refresh the project connection through the database integration.',
    '42501': 'The database role lacks required permissions. Check schema ownership and permissions.',
    '42P07': 'An application table already exists. Inspect the migration state before retrying; do not delete existing data.'
  };
  return `Database operation failed (${code}). ${hints[code] ?? 'Check connection settings and schema.'} Credentials and row data are omitted.`;
}

export function safeFailure(error) {
  console.error(databaseFailureMessage(error));
  process.exitCode = 1;
}

export async function migrations() {
  const directory = new URL('../src/lib/db/migrations/', import.meta.url);
  const names = (await readdir(directory)).filter(name => /^\d+_[a-z0-9_]+\.sql$/.test(name)).sort();
  return Promise.all(names.map(async name => {
    const sql = (await readFile(new URL(name, directory), 'utf8')).replaceAll('\r\n', '\n');
    return { name, sql, checksum: createHash('sha256').update(sql).digest('hex') };
  }));
}

export async function applyMigrations(client) {
  await client.query('BEGIN');
  try {
    await client.query("SELECT pg_advisory_xact_lock(724103, 1)");
    await client.query('CREATE TABLE IF NOT EXISTS public.temacore_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())');
    await client.query('REVOKE ALL ON public.temacore_migrations FROM PUBLIC');
    const applied = await client.query('SELECT name, checksum FROM public.temacore_migrations');
    let count = 0;
    for (const migration of await migrations()) {
      const existing = applied.rows.find(row => row.name === migration.name);
      if (existing) {
        if (existing.checksum !== migration.checksum) throw new Error('An applied migration has changed. Restore its original contents.');
        continue;
      }
      await client.query(migration.sql);
      await client.query('INSERT INTO public.temacore_migrations (name, checksum) VALUES ($1, $2)', [migration.name, migration.checksum]);
      count++;
    }
    await client.query('COMMIT');
    return count;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  }
}
