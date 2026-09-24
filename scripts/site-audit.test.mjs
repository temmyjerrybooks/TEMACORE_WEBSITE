import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectHtml, pageIssues, contentIssues } from './site-audit.mjs';

const html = `<html><head><title>AI &amp; Software</title><meta content='Company description' name='description'><link href="https://www.temacore.com/ai" rel="canonical"><script type="application/ld+json">{"@type":"Organization","name":"Temacore"}</script></head><body><main><h1>Enterprise <span>AI</span></h1><a href="/insurtech#life-insurance">Life insurance</a></main><footer>AI-first company</footer><script>"future Supabase RLS"</script></body></html>`;

test('inspects actual HTML, decodes entities, and excludes hydration scripts from visible copy', () => {
  const page = inspectHtml(html);
  assert.equal(page.title, 'AI & Software');
  assert.equal(page.description, 'Company description');
  assert.deepEqual(page.h1, ['Enterprise AI']);
  assert.deepEqual(page.canonicals, ['https://www.temacore.com/ai']);
  assert.equal(page.schemas[0]['@type'], 'Organization');
  assert.ok(!page.text.includes('Supabase'));
  assert.deepEqual(pageIssues({ ...page, status: 200 }, '/ai', 'https://www.temacore.com'), []);
});

test('detects duplicate canonicals, accidental noindex, stale footer copy, and invalid JSON-LD', () => {
  const page = inspectHtml(html.replace('</head>', '<link rel="canonical" href="https://www.temacore.com/"><meta name="robots" content="noindex"><script type="application/ld+json">invalid</script></head>').replace('AI-first company', 'Portland, Oregon, OR 97217'));
  const issues = pageIssues({ ...page, status: 200 }, '/ai', 'https://www.temacore.com');
  assert.ok(issues.some(i => i.includes('found 2')));
  assert.ok(issues.includes('Public page has noindex'));
  assert.ok(issues.includes('Invalid JSON-LD'));
  assert.ok(issues.some(i => i.includes('Portland')));
});

test('requires intentional investor noindex and validates canonical destination', () => {
  const page = inspectHtml(html);
  const issues = pageIssues({ ...page, status: 200 }, '/investors', 'https://www.temacore.com');
  assert.ok(issues.includes('Investor page missing noindex'));
  assert.ok(issues.some(i => i.startsWith('Unexpected canonical')));
});

test('accepts equivalent root canonical URLs while rejecting a different origin', () => {
 const page = { ...inspectHtml(html), status: 200, canonicals: ['https://www.temacore.com'] };
 assert.deepEqual(pageIssues(page, '/', 'https://www.temacore.com'), []);
 page.canonicals = ['https://example.com/'];
 assert.ok(pageIssues(page, '/', 'https://www.temacore.com').some(i => i.startsWith('Unexpected canonical')));
});

test('does not let shared footer copy satisfy page-specific positioning checks', () => {
 const page = { text: 'Traditional outsourcing', footer: 'AI-first technology company InsurTech FinTech BPO' };
 assert.ok(contentIssues(page, '/').includes('Missing content: AI-first technology company'));
});
