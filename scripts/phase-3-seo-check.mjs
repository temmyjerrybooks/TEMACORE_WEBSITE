import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { audit } from './site-audit.mjs';
const base = process.argv[2] ?? 'http://localhost:3101';
const output = process.argv[3] ?? 'reports/phase-3-local-after.json';
const report = await audit(base, output);
const issues = [];
const check = (pass, message) => { if (!pass) issues.push(message); };
check(report.summary.pageIssues === 0, 'Route metadata/status/H1/JSON-LD checks');
check(report.summary.contentIssues === 0, 'Approved positioning coverage');
check(report.summary.brokenInternalLinks.length === 0 && report.brokenAnchors.length === 0, 'Internal links/anchors');
check(report.sitemap.privateEntries.length === 0 && report.sitemap.nonCanonicalEntries.length === 0, 'Canonical public sitemap');
check(report.sitemap.urls.includes('https://www.temacore.com/ai'), 'AI sitemap discovery');
check(report.llms.aiFirst && !report.llms.privateLinks, 'AI-first llms description without private links');
const sitemapText = await (await fetch(base + '/sitemap.xml')).text();
check(!sitemapText.includes('<lastmod>'), 'No fabricated sitemap modification dates');
for (const field of ['title', 'description']) {
  const values = report.pages.map(p => p[field]);
  check(new Set(values).size === values.length, `Unique route ${field}`);
}
for (const page of report.pages) {
  for (const key of ['og:title','og:description','og:image','og:url','twitter:title','twitter:description','twitter:image']) check(Boolean(page.social[key]), `${page.path} missing ${key}`);
  check(page.social['og:description'] === page.description, `${page.path} social description matches`);
  check(new URL(page.social['og:url']).href === new URL(page.path, report.canonicalOrigin).href, `${page.path} social canonical`);
  check(page.footer.includes('AI-first technology company') && page.footer.includes('intelligent workflow infrastructure'), `${page.path} parent identity in footer`);
  for (const schema of page.schemas) {
    const inspect = value => {
      if (!value || typeof value !== 'object') return;
      if (value['@type'] === 'Organization') check(value['@id'] === 'https://www.temacore.com/#organization', `${page.path} consistent organization identity`);
      if (value['@type'] === 'WebSite') check(value['@id'] === 'https://www.temacore.com/#website', `${page.path} consistent website identity`);
      for (const nested of Object.values(value)) if (nested && typeof nested === 'object') { if (Array.isArray(nested)) nested.forEach(inspect); else inspect(nested); }
    };
    inspect(schema);
  }
}
const home = report.pages.find(p => p.path === '/');
const about = report.pages.find(p => p.path === '/about');
const ai = report.pages.find(p => p.path === '/ai');
check(home.title === 'Temacore | Vertical AI for Insurance, FinTech & Enterprise Operations', 'Homepage title without duplicate branding');
for (const href of ['/ai','/about','/investors','/industries#financial-operations','/insurtech#life-insurance']) check(home.links.includes(href), `Homepage semantic link ${href}`);
for (const href of ['/ai','/insurtech','/industries#financial-operations']) check(about.links.includes(href), `About contextual link ${href}`);
for (const phrase of ['strongest current product base is insurance','document intelligence','knowledge retrieval','workflow orchestration','decision support','permissions','traceability','APIs','in development']) check(ai.text.toLowerCase().includes(phrase.toLowerCase()), `AI explanation: ${phrase}`);
const org = home.schemas.find(s => s['@type'] === 'Organization');
check(org?.legalName === 'TEMACORE LLC' && org?.founder?.name === 'Temitope Abodunde', 'Public organization legal/founder identity');
check(!org?.sameAs, 'No unverified company social profiles');
check(org?.description === home.description, 'Visible parent definition and schema agree');
const proof = JSON.parse(await readFile(new URL('../reports/investor-deck-2026-assets.json', import.meta.url), 'utf8'));
const assetChecks = [];
for (const a of [...proof.assets, { file: 'TEMACORE_Investor_Deck_2026.pdf', sha256: proof.pdfSha256 }]) {
  const name = a.file.split(/[\\/]/).at(-1);
  const response = await fetch(`${base}/investor-deck/${proof.revision}/${name}`);
  const hash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
  check(response.status === 200 && hash === a.sha256, `Approved investor asset ${name}`);
  assetChecks.push({ file: name, approvedHashMatches: hash === a.sha256 });
}
const keyResponse = await fetch(base + '/indexnow-key.txt');
check([200,404].includes(keyResponse.status) && /noindex/.test(keyResponse.headers.get('x-robots-tag') ?? ''), 'IndexNow proof route safely configured or disabled');
report.phase3 = { issues, investorAssets: assetChecks, keyRouteStatus: keyResponse.status, note: 'Local JSON-LD structural and entity consistency checks; not external Rich Results certification.' };
await writeFile(output, JSON.stringify(report, null, 2) + '\n');
assert.deepEqual(issues, []);
console.log('PASS Phase 3: routes, links, metadata, schema, indexability and all approved investor assets');
