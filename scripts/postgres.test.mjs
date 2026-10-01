import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import ts from 'typescript';
import { applyMigrations } from './db-common.mjs';

const loadedModule = { exports: {} };
const code = ts.transpileModule(readFileSync('src/lib/db/queries.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, console: { error() {} }, Date });
const { DatabaseStore, runTransaction } = loadedModule.exports;

test('PostgreSQL schema, storage queries, and atomic intake rollback', async () => {
  const db = new PGlite();
  // PGlite uses exec for the simple-query protocol (multi-statement migrations).
  const client = { query: async (sql, values) => values ? db.query(sql, values) : (await db.exec(sql)).at(-1) };
  try {
    assert.equal(await applyMigrations(client), 1);
    assert.equal(await applyMigrations(client), 0, 'migrations must be repeatable');
    const tables = await db.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> 'temacore_migrations'");
    assert.equal(tables.rows.length, 13);
    const sqlLog = [];
    const execute = async (sql, values) => { sqlLog.push(sql); return db.query(sql, values); };
    const store = new DatabaseStore(execute);
    const company = "O'Brien'); DROP TABLE leads; --";
    const lead = { company_name: company, contact_name: 'Test', email: 'test@example.invalid', source: 'client_intake' };

    const id = await runTransaction(execute, async transaction => {
      const result = await transaction.insertOne('leads', lead);
      await transaction.insertOne('client_intakes', { lead_id: result.data.id, company_name: company, region: 'Test', workflow_summary: 'Synthetic', services_needed: ['CRM', 'Automation'] });
      return result.data.id;
    });
    assert.ok(!sqlLog.some(sql => sql.includes(company)), 'submitted values must never enter SQL text');
    const saved = await store.selectOne('client_intakes', { equals: { lead_id: id } });
    assert.equal(saved.data.company_name, company);
    assert.equal(saved.data.services_needed.length, 2);
    assert.equal(typeof saved.data.created_at, 'string');

    await assert.rejects(runTransaction(execute, async transaction => {
      const result = await transaction.insertOne('leads', { ...lead, company_name: 'Rollback test' });
      await transaction.insertOne('client_intakes', { lead_id: result.data.id, company_name: 'Rollback test', region: null, workflow_summary: 'Invalid required field' });
    }));
    assert.equal((await store.select('leads', { head: true, equals: { company_name: 'Rollback test' } })).count, 0);
    assert.equal((await store.select('leads', { head: true })).count, 1);

    const missing = await store.selectOne('leads', { equals: { id: randomUUID() } });
    assert.equal(missing.data, null);
    assert.equal(missing.error, null);
    const event = { session_id: randomUUID(), event_name: 'investor_deck_slide_viewed', slide_number: 15 };
    assert.equal((await store.insert('investor_deck_events', [event, { ...event, slide_number: 1 }])).error, null);
    const events = await store.select('investor_deck_events', { notNull: 'slide_number', equals: { event_name: event.event_name }, orderBy: 'slide_number', ascending: false, limit: 1 });
    assert.equal(events.data[0].slide_number, 15);
    assert.equal(events.data.length, 1);
    const invalid = await store.insert('investor_deck_events', { ...event, slide_number: 16 });
    assert.equal(invalid.error.code, '23514');
    assert.ok(!invalid.error.message.includes(event.session_id));
    assert.equal((await store.select('leads', { orderBy: 'id; DROP TABLE leads' })).data, null);
    assert.equal((await store.select('leads', { limit: -1 })).data, null);

    await db.query("UPDATE public.temacore_migrations SET checksum = 'changed'");
    await assert.rejects(applyMigrations(client), /migration has changed/);
    assert.equal((await store.select('leads', { head: true })).count, 1);
  } finally {
    await db.close();
  }
});
