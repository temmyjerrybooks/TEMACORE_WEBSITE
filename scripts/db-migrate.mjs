import { databasePool, applyMigrations, safeFailure } from './db-common.mjs';

let pool;
try {
  pool = databasePool({ migration: true });
  const client = await pool.connect();
  try {
    const count = await applyMigrations(client);
    console.log(`Database migrations complete: ${count} applied.`);
  } finally {
    client.release();
  }
} catch (error) {
  safeFailure(error);
} finally {
  await pool?.end();
}
