import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { databaseConnectionString, databaseFailureMessage } from './db-common.mjs';

test('the configured TEMACORE variable works for migrations, checks, and application runtime', () => {
  const environment = { TEMACORE_DATABASE_URL: 'postgresql://user:secret@temacore.invalid/app' };
  assert.equal(databaseConnectionString(environment), environment.TEMACORE_DATABASE_URL);
  assert.equal(databaseConnectionString(environment, { migration: true }), environment.TEMACORE_DATABASE_URL);
  const loadedModule = { exports: {} };
  const code = ts.transpileModule(readFileSync('src/lib/db/config.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText;
  runInNewContext(code, { module: loadedModule, exports: loadedModule.exports, process: { env: environment } });
  assert.equal(loadedModule.exports.getDatabaseConfig().connectionString, environment.TEMACORE_DATABASE_URL);
  assert.equal(loadedModule.exports.getDatabaseConfig().isConfigured, true);
});

test('missing or malformed database configuration produces actionable, safe errors', () => {
  for (const environment of [{}, { CUSTOM_DATABASE_URL: 'postgresql://private:secret@db.invalid/app' }]) {
    assert.throws(() => databaseConnectionString(environment), { code: 'DATABASE_URL_MISSING' });
  }
  for (const value of ['https://dashboard.invalid/private', 'private-secret', 'postgresql:///app']) {
    assert.throws(() => databaseConnectionString({ DATABASE_URL: value }), { code: 'DATABASE_URL_INVALID' });
  }
  assert.match(databaseFailureMessage({ code: 'DATABASE_URL_MISSING' }), /Production environment/);
});

test('migration overrides do not change the runtime database selection', () => {
  const environment = {
    DATABASE_URL: 'postgresql://user:secret@runtime.invalid/app',
    POSTGRES_URL: 'postgres://user:secret@fallback.invalid/app',
    DATABASE_URL_UNPOOLED: 'postgresql://user:secret@direct.invalid/app',
    DATABASE_MIGRATION_URL: 'postgresql://user:secret@migration.invalid/app'
  };
  assert.equal(databaseConnectionString(environment), environment.DATABASE_URL);
  assert.equal(databaseConnectionString(environment, { migration: true }), environment.DATABASE_MIGRATION_URL);
  delete environment.DATABASE_MIGRATION_URL;
  assert.equal(databaseConnectionString(environment, { migration: true }), environment.DATABASE_URL_UNPOOLED);
  assert.equal(databaseConnectionString({ POSTGRES_URL: environment.POSTGRES_URL }), environment.POSTGRES_URL);
});

test('diagnostics never include driver messages, connection strings, or row data', () => {
  for (const code of ['28P01', 'ENOTFOUND', 'private-password', undefined]) {
    const output = databaseFailureMessage({ code, message: 'private-password postgres://user:secret@private.invalid/app', detail: 'private row data' });
    assert.doesNotMatch(output, /private-password|user:secret|private\.invalid|private row data/);
  }
});
