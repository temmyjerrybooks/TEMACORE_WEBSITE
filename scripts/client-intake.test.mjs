import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(path, dependencies = {}, logs = []) {
  const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports,
    require: name => name in dependencies ? dependencies[name] : require(name),
    console: { error: (...args) => logs.push(args) },
    process: { env: {} }, Error, Response, Request, FormData, fetch
  }, { filename: path });
  return loadedModule.exports;
}

const submission = load('src/lib/forms/intake-submission.ts');
const security = load('src/lib/api/security.ts');
const formData = load('src/lib/api/form-data.ts', { '@/lib/api/security': security });
function payload() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ company_name: 'Test company', contact_name: 'Test contact', email: 'test@example.com', region: 'Other', workflow_summary: 'Test workflow' })) data.set(key, value);
  return data;
}
function backend({ leadError = null, intakeError = null, configurationError = null, notification = true } = {}) {
  const writes = [], logs = [], alerts = [], notifications = [];
  const { POST } = load('src/app/api/client-intake/route.ts', {
    '@/lib/api/form-data': formData,
    '@/lib/api/security': security,
    '@/lib/forms/intake-submission': submission,
    '@/lib/alerts/website-alerts': { sendWebsiteAlert: async value => { alerts.push(value); return true; } },
    '@/lib/email/notifications': { sendSubmissionNotification: async value => { notifications.push(value); return notification; } },
    '@/lib/db/intakes': load('src/lib/db/intakes.ts', {
      './postgres': { withDatabaseTransaction: async work => {
        if (configurationError) throw configurationError;
        return work({ insertOne: async (table, value) => {
          writes.push({ table, value });
          const error = table === 'leads' ? leadError : intakeError;
          if (error) throw error;
          return { data: { id: 'test-lead' }, error: null };
        } });
      } }
    })
  }, logs);
  return { submit: data => POST(new Request('https://example.com/api/client-intake', { method: 'POST', body: data ?? payload() })), writes, logs, alerts, notifications };
}

test('intake requires a confirmed successful API payload before clearing the form', async () => {
  const result = await submission.submitClientIntake(payload(), async () => Response.json({ ok: true }));
  assert.equal(result.ok, true);
  for (const response of [Response.json({ ok: false }), Response.json({}), new Response('<html>gateway error</html>')]) {
    const failed = await submission.submitClientIntake(payload(), async () => response);
    assert.equal(failed.ok, false);
    assert.equal(failed.error, submission.intakeUnavailableMessage);
  }
});

test('intake hides raw database and gateway errors from visitors', async () => {
  for (const status of [500, 502, 503, 504]) {
    const result = await submission.submitClientIntake(payload(), async () => Response.json({ error: 'TypeError: fetch failed; private internals' }, { status }));
    assert.equal(result.ok, false);
    assert.equal(result.error, submission.intakeUnavailableMessage);
  }
});

test('intake network failure preserves submitted data and does not retry a POST', async () => {
  const data = payload();
  let calls = 0;
  const result = await submission.submitClientIntake(data, async (url, init) => {
    calls++;
    assert.equal(url, '/api/client-intake');
    assert.equal(init.body, data);
    throw new TypeError('Failed to fetch');
  });
  assert.equal(calls, 1);
  assert.equal(result.ok, false);
  assert.equal(data.get('workflow_summary'), 'Test workflow');
});

test('intake preserves actionable validation and rate-limit feedback', async () => {
  for (const status of [400, 429]) {
    const result = await submission.submitClientIntake(payload(), async () => Response.json({ error: 'Please check your details.' }, { status }));
    assert.equal(result.ok, false);
    assert.equal(result.error, 'Please check your details.');
  }
});

test('intake database connection failure returns 503 and logs only diagnostic codes', async () => {
  const app = backend({ leadError: { message: 'TypeError: fetch failed', details: 'ENOTFOUND private-diagnostic-marker', code: '' } });
  const response = await app.submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, submission.intakeUnavailableMessage);
  assert.equal(app.writes.length, 1);
  assert.equal(app.notifications.length, 0);
  assert.equal(app.logs[0][1].networkCode, 'ENOTFOUND');
  assert.ok(!JSON.stringify(app.logs).includes('private-diagnostic-marker'));
});

test('intake is not reported successful when its second database write fails', async () => {
  const app = backend({ intakeError: { message: 'private database details', code: '42501' } });
  const response = await app.submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(app.writes.length, 2);
  assert.equal(app.notifications.length, 0);
});

test('intake configuration errors never expose server variable names to visitors', async () => {
  const app = backend({ configurationError: new Error('Missing DATABASE_URL') });
  const response = await app.submit();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, submission.intakeUnavailableMessage);
  assert.equal(app.writes.length, 0);
});

test('intake success requires both writes and survives unavailable notification delivery', async () => {
  const app = backend({ notification: false });
  const response = await app.submit();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(app.writes.length, 2);
  assert.equal(app.writes[1].value.lead_id, 'test-lead');
  assert.equal(app.notifications.length, 1);
  assert.equal(app.alerts.at(-1).alertType, 'Email sending failure');
});

test('intake validates required fields before contacting storage or sending notifications', async () => {
  const app = backend();
  const response = await app.submit(new FormData());
  assert.equal(response.status, 400);
  assert.equal(app.writes.length, 0);
  assert.equal(app.notifications.length, 0);
  assert.equal(app.alerts.length, 0);
});
