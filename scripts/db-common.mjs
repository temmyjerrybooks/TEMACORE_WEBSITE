import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { Pool } from 'pg';

export function loadDatabaseEnvironment() {
  // Local only; Vercel supplies environment variables directly. Never print values.
  if (existsSync('.env.local')) process.loadEnvFile('.env.local');
}

export function databasePool({ migration = false } = {}) {
  loadDatabaseEnvironment();
  const runtimeUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const connectionString = migration
    ? process.env.DATABASE_MIGRATION_URL || process.env.DATABASE_URL_UNPOOLED || runtimeUrl
    : runtimeUrl;
  if (!connectionString) throw new Error('Set DATABASE_URL privately in .env.local or the deployment environment.');
  return new Pool({ connectionString, max: 1, connectionTimeoutMillis: 10000, statement_timeout: 60000 });
}

export function safeFailure(error) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,40}$/.test(error.code) ? error.code : 'DATABASE_ERROR';
  console.error(`Database operation failed (${code}). Check connection settings and schema; credentials and row data are omitted.`);
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
