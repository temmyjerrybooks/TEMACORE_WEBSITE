import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

export function decode(value) {
  return value.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
    .replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

export function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m => [m[1].toLowerCase(), decode(m[2] ?? m[3])]));
}

export function inspectHtml(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(m => attributes(m[0]));
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(m => attributes(m[0])).filter(a => a.rel === 'canonical').map(a => a.href);
  const schemas = [];
  const schemaErrors = [];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attributes(match[1]).type !== 'application/ld+json') continue;
    try { schemas.push(...[JSON.parse(match[2])].flat()); } catch (error) { schemaErrors.push(error.message); }
  }
  const visible = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const plain = value => decode(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
  const main = visible.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? visible;
  return {
    title: plain(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    description: metas.find(m => m.name === 'description')?.content ?? '',
    robots: metas.filter(m => ['robots', 'googlebot'].includes(m.name)).map(m => m.content),
    canonicals,
    h1: [...visible.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => plain(m[1])),
    schemas, schemaErrors,
    text: plain(main),
    footer: plain(visible.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] ?? ''),
    links: [...visible.matchAll(/<a\b[^>]*>/gi)].map(m => attributes(m[0]).href).filter(Boolean),
    ids: [...visible.matchAll(/\bid=(?:"([^"]*)"|'([^']*)')/g)].map(m => decode(m[1] ?? m[2]))
  };
}

export function pageIssues(page, path, canonicalOrigin) {
  const issues = [];
  if (page.status !== 200) issues.push(`HTTP ${page.status}`);
  if (!page.title) issues.push('Missing title');
  if (!page.description) issues.push('Missing description');
  if (page.h1.length !== 1) issues.push(`Expected one H1; found ${page.h1.length}`);
  if (page.canonicals.length !== 1) issues.push(`Expected one canonical; found ${page.canonicals.length}`);
  else if (new URL(page.canonicals[0], canonicalOrigin).href !== new URL(path, canonicalOrigin).href) issues.push(`Unexpected canonical: ${page.canonicals[0]}`);
  if (path !== '/investors' && page.robots.some(r => /\bnoindex\b/i.test(r))) issues.push('Public page has noindex');
  if (path === '/investors' && !page.robots.some(r => /\bnoindex\b/i.test(r))) issues.push('Investor page missing noindex');
  if (page.schemaErrors.length) issues.push('Invalid JSON-LD');
  for (const phrase of ['Supabase', 'Portland, Oregon, OR', 'US-registered global operations partner', 'Operations first, technology enabled', 'Temacore helps companies run cleaner operations with remote teams']) {
    if ((page.text + page.footer).includes(phrase)) issues.push(`Stale copy: ${phrase}`);
  }
  return issues;
}

async function fetchResponse(url) {
  try {
    const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(45000) });
    return { status: response.status, url: response.url, contentType: response.headers.get('content-type'), xRobotsTag: response.headers.get('x-robots-tag'), html: await response.text() };
  } catch (error) { return { status: 0, url: String(url), error: error.message, html: '' }; }
}

async function mapLimit(values, fn) {
  const result = [];
  let index = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (index < values.length) { const i = index++; result[i] = await fn(values[i]); }
  }));
  return result;
}

export function contentIssues(page, path) {
  const rules = {
    '/': ['AI-first technology company', 'InsurTech', 'FinTech', 'BPO', 'shared intelligence layer in development', 'developed platforms: Life + General Insurance'],
    '/about': ['AI-first technology company', 'enterprise software', 'FinTech', 'managed operations'],
    '/platforms': ['TEMACORE AI', 'shared intelligence layer', 'system layer', 'FinTech', 'human controls'],
    '/ai': ['AI for FinTech', 'AI for Insurance', 'AI for BPO', 'AI for Customer Support', 'AI for Back-Office', 'AI for Business Applications', 'AI in development', 'Human-in-the-loop'],
    '/insurtech': ['Life Insurance Platform', 'General Insurance Platform', 'AI in development', 'Future roadmap', 'human review'],
    '/services': ['people, process, software, and developing AI', 'Business Process Outsourcing', 'Custom Application Development'],
    '/services/business-process-outsourcing': ['workflow understanding', 'process structuring', 'software support', 'human review', 'quality-assurance support', 'escalation detection', 'developing AI architecture'],
    '/services/customer-support': ['classification', 'summarization', 'knowledge assistance', 'suggested responses', 'routing', 'escalation detection', 'Human agents remain accountable'],
    '/services/back-office-operations': ['Managed execution', 'structure the workflow', 'AI-assisted processing', 'approve sensitive changes', 'developing AI architecture'],
    '/technology': ['enterprise applications', 'AI scope is agreed and validated'],
    '/industries': ['Insurance / InsurTech', 'Financial Services / FinTech', 'BPO / Managed Operations'],
    '/founder': ['software engineering', 'insurance technology', 'business operations', 'AI-first product strategy'],
    '/venture': ['AI-first technology company', 'FinTech', 'managed operations'],
    '/investors': ['AI-first technology company']
  };
  return (rules[path] ?? []).filter(term => !page.text.toLowerCase().includes(term.toLowerCase())).map(term => 'Missing content: ' + term);
}

export async function audit(base, output, canonicalOrigin = 'https://www.temacore.com') {
  const capturedAt = new Date().toISOString();
  const requestUrl = path => {
    const url = new URL(path, base);
    url.searchParams.set('verification', capturedAt);
    return url;
  };
  const [sitemap, robots, llms] = await Promise.all(['/sitemap.xml', '/robots.txt', '/llms.txt'].map(p => fetchResponse(requestUrl(p))));
  const sitemapUrls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
  if (!sitemapUrls.length) throw new Error(`Could not read sitemap from ${base}: HTTP ${sitemap.status}`);
  const paths = [...new Set([...sitemapUrls.map(url => new URL(url).pathname), '/investors'])];
  const pages = await mapLimit(paths, async path => {
    const response = await fetchResponse(requestUrl(path));
    const page = { path, status: response.status, finalUrl: response.url, xRobotsTag: response.xRobotsTag, ...inspectHtml(response.html) };
    page.issues = pageIssues(page, path, canonicalOrigin);
    page.contentIssues = contentIssues(page, path);
    if (path !== '/investors' && /noindex/i.test(page.xRobotsTag ?? '')) page.issues.push('Public HTTP header has noindex');
    console.log(`${page.status} ${path} | ${page.title} | ${page.issues.length} issue(s)`);
    return page;
  });
  const internal = new Map();
  const external = new Set();
  const brokenAnchors = [];
  for (const page of pages) {
    for (const href of page.links) {
      if (/^(mailto:|tel:)/i.test(href)) continue;
      const url = new URL(href, `${canonicalOrigin}${page.path}`);
      if (url.origin !== canonicalOrigin) { external.add(url.href); continue; }
      const target = pages.find(p => p.path === url.pathname);
      if (target && url.hash && !target.ids.includes(decodeURIComponent(url.hash.slice(1)))) brokenAnchors.push({ source: page.path, href });
      if (!target) internal.set(url.pathname + url.search, href);
    }
  }
  const extraLinks = await mapLimit([...internal.keys()], async path => {
    const result = await fetchResponse(requestUrl(path));
    return { path, status: result.status, finalUrl: result.url, error: result.error };
  });
  const admin = await fetchResponse(requestUrl('/admin'));
  const adminPage = inspectHtml(admin.html);
  const report = {
    capturedAt, base, canonicalOrigin,
    sitemap: { status: sitemap.status, urls: sitemapUrls, privateEntries: sitemapUrls.filter(u => /\/(admin|api|investors)(\/|$)/.test(new URL(u).pathname)), nonCanonicalEntries: sitemapUrls.filter(u => new URL(u).origin !== canonicalOrigin) },
    robots: { status: robots.status, body: robots.html },
    llms: { status: llms.status, aiFirst: llms.html.includes('AI-first technology company'), privateLinks: /https?:\/\/[^\s]+\/(admin|api|investors)(?:\s|$|\/)/.test(llms.html) },
    admin: { status: admin.status, finalUrl: admin.url, robots: adminPage.robots, xRobotsTag: admin.xRobotsTag },
    pages, extraLinks, brokenAnchors, externalLinksNotChecked: [...external],
    summary: { pages: pages.length, pageIssues: pages.reduce((n, p) => n + p.issues.length, 0), contentIssues: pages.reduce((n, p) => n + p.contentIssues.length, 0), brokenInternalLinks: extraLinks.filter(l => l.status < 200 || l.status >= 400), brokenAnchors: brokenAnchors.length }
  };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report.summary, null, 2));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await audit(process.argv[2] ?? 'https://www.temacore.com', process.argv[3] ?? 'reports/site-audit.json');
}
