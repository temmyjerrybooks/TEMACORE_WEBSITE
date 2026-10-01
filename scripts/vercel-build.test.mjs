import test from 'node:test';
import assert from 'node:assert/strict';
import { runVercelBuild } from './vercel-build.mjs';

test('production builds migrate and verify runtime storage before compiling', () => {
  const calls = [];
  const status = runVercelBuild({ VERCEL: '1', VERCEL_ENV: 'production' }, args => { calls.push(args); return 0; });
  assert.equal(status, 0);
  assert.deepEqual(calls.map(args => args[0]), ['scripts/db-migrate.mjs', 'scripts/db-check.mjs', 'node_modules/next/dist/bin/next']);
});

test('database setup failures prevent production compilation', () => {
  for (const failingStep of [0, 1]) {
    let calls = 0;
    const status = runVercelBuild({ VERCEL_ENV: 'production' }, () => calls++ === failingStep ? 1 : 0);
    assert.equal(status, 1);
    assert.equal(calls, failingStep + 1);
  }
});

test('preview and development builds never run database mutations; unknown targets fail closed', () => {
  for (const environment of [{ VERCEL_ENV: 'preview' }, { VERCEL_ENV: 'development' }]) {
    const calls = [];
    assert.equal(runVercelBuild(environment, args => { calls.push(args); return 0; }), 0);
    assert.deepEqual(calls, [['node_modules/next/dist/bin/next', 'build', '--webpack']]);
  }
  assert.throws(() => runVercelBuild({ VERCEL: '1' }, () => assert.fail('Must not build without an environment')));
  assert.throws(() => runVercelBuild({}, () => assert.fail('Use npm run build for local builds')));
});
