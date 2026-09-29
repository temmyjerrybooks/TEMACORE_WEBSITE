import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/indexnow-policy.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { indexNowPayload, validIndexNowKey } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const base = 'https://www.temacore.com';
const key = 'test-key-1234';
test('IndexNow deduplicates approved canonical URLs and uses root ownership proof', () => {
  const p = indexNowPayload([base + '/ai', base + '/ai', base + '/'], key, [base + '/ai', base + '/']);
  assert.deepEqual(p.urlList, [base + '/ai', base + '/']);
  assert.equal(p.host, 'www.temacore.com');
  assert.equal(p.keyLocation, base + '/indexnow-key.txt');
});
test('IndexNow rejects private routes even when included in a supplied allowlist', () => {
  for (const path of ['/investors', '/investor-deck/2026-c195ba3c/slide-01.webp', '/admin', '/api/investors/events', '/client-intake', '/project-request']) {
    assert.throws(() => indexNowPayload([base + path], key, [base + path]), /Not an approved/);
  }
});
test('IndexNow rejects other origins, tracking variants, credentials and unknown routes', () => {
  for (const url of ['https://example.com/ai', 'http://www.temacore.com/ai', 'https://temacore.com/ai', base + '/ai?q=1', base + '/ai#section', 'https://user@www.temacore.com/ai', base + '/unlisted']) {
    assert.throws(() => indexNowPayload([url], key, [base + '/ai']));
  }
});
test('IndexNow validates keys and protocol batch bounds before sending', () => {
  for (const invalid of ['', 'short', '../injected-file', 'a'.repeat(129), 'spaces are bad']) assert.equal(validIndexNowKey(invalid), false);
  assert.equal(validIndexNowKey(key), true);
  assert.throws(() => indexNowPayload([], key, []));
  assert.throws(() => indexNowPayload(Array(10001).fill(base + '/ai'), key, [base + '/ai']));
  assert.throws(() => indexNowPayload([base + '/ai'], 'short', [base + '/ai']));
});
