import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function health(checkDatabaseReadiness) {
  const loaded = { exports: {} };
  const code = ts.transpileModule(readFileSync('src/app/api/health/route.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  runInNewContext(code, {
    module: loaded, exports: loaded.exports,
    require: name => name === '@/lib/db/postgres' ? { checkDatabaseReadiness }
      : name === '@/lib/db/queries' ? { storageError: () => ({ code: 'DATABASE_ERROR' }) } : require(name),
    process: { env: { VERCEL_GIT_COMMIT_SHA: 'test-commit' } }, console: { error() {} }
  });
  return loaded.exports.GET;
}

test('readiness confirms runtime database access and identifies the deployment', async () => {
  let checked = false;
  const response = await health(async () => { checked = true; })();
  assert.equal(checked, true);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, deployment: 'test-commit' });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
});

test('readiness fails closed without exposing database connection details', async () => {
  const response = await health(async () => { throw new Error('postgresql://private-credential@example.invalid'); })();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false });
});
