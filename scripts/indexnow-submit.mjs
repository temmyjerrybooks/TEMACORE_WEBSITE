import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { inspectHtml } from './site-audit.mjs';
const source = await readFile(new URL('../src/lib/indexnow-policy.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { indexNowOrigin, indexNowKeyPath, indexNowPayload } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const args = process.argv.slice(2);
const submit = args.includes('--submit');
const urls = args.filter(a => !a.startsWith('--'));
if (args.some(a => a.startsWith('--') && a !== '--submit')) throw new Error('Only --submit is supported. Omit it for a dry run.');
if (!urls.length) throw new Error('Usage: node scripts/indexnow-submit.mjs [--submit] https://www.temacore.com/ai ...');
const get = url => fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) });
const sitemapResponse = await get(`${indexNowOrigin}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error('Production sitemap unavailable.');
const sitemap = await sitemapResponse.text();
const allowed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const key = process.env.INDEXNOW_KEY;
if (submit && !key) throw new Error('Configure INDEXNOW_KEY locally and in Vercel production before submitting.');
// The placeholder is used for URL policy validation only, never sent to any endpoint.
const payload = indexNowPayload(urls, key ?? 'dry-run-only', allowed);
for (const url of payload.urlList) {
  const response = await get(url);
  if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error(`Expected public HTML: ${url}`);
  const page = inspectHtml(await response.text());
  if (page.canonicals.length !== 1 || new URL(page.canonicals[0]).href !== url ||
      page.robots.some(r => /noindex/i.test(r)) || /noindex/i.test(response.headers.get('x-robots-tag') ?? '')) throw new Error(`Canonical/indexability check failed: ${url}`);
}
console.log(JSON.stringify({ mode: submit ? 'submit' : 'dry-run', urls: payload.urlList, keyLocation: `${indexNowOrigin}${indexNowKeyPath}` }, null, 2));
if (submit) {
  const proof = await get(payload.keyLocation);
  if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('Production proof file does not match INDEXNOW_KEY.');
  const response = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000), headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(payload) });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow returned ${response.status}; check configuration before retrying.`);
  console.log(response.status === 202 ? 'Received; key validation pending. Indexing is not guaranteed.' : 'Received. Indexing is not guaranteed.');
} else console.log('Dry run passed. No IndexNow submission was sent.');
