import { databasePool, applyMigrations, safeFailure } from './db-common.mjs';

let pool;
try {
  console.log('Database migration: validating connection configuration.');
  pool = databasePool({ migration: true });
  console.log('Database migration: connecting to PostgreSQL.');
  const client = await pool.connect();
  try {
    console.log('Database migration: applying versioned schema.');
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
