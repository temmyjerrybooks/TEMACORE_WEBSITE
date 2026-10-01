import { randomUUID } from 'node:crypto';
import { databasePool, migrations, safeFailure } from './db-common.mjs';

let pool;
try {
  pool = databasePool();
  const client = await pool.connect();
  try {
    const applied = await client.query('SELECT name, checksum FROM public.temacore_migrations');
    for (const migration of await migrations()) {
      if (!applied.rows.some(row => row.name === migration.name && row.checksum === migration.checksum)) throw new Error('Migration missing or changed.');
    }
    // Exercise real constraints and persistence within one connection, then roll back.
    // This never calls a website route, analytics endpoint, or email service.
    const id = randomUUID();
    await client.query('BEGIN');
    try {
      await client.query("INSERT INTO public.leads (id,company_name,contact_name,email,source) VALUES ($1,'Database verification','Synthetic check','test@example.invalid','client_intake')", [id]);
      await client.query("INSERT INTO public.client_intakes (lead_id,company_name,region,workflow_summary) VALUES ($1,'Database verification','Test','Synthetic check; rolled back')", [id]);
      const result = await client.query('SELECT count(*)::integer AS count FROM public.client_intakes WHERE lead_id = $1', [id]);
      if (result.rows[0].count !== 1) throw new Error('Read-back failed.');
    } finally {
      await client.query('ROLLBACK');
    }
    const result = await client.query('SELECT count(*)::integer AS count FROM public.leads WHERE id = $1', [id]);
    if (result.rows[0].count !== 0) throw new Error('Rollback verification failed.');
    console.log('Database checks passed: migrations match; intake write/read/rollback succeeded. No test records or emails retained.');
  } finally {
    client.release();
  }
} catch (error) {
  safeFailure(error);
} finally {
  await pool?.end();
}
