import { services } from "@/lib/data";
import { getSiteUrl } from "@/lib/seo";
import type { SeoIssueSeverity } from "@/lib/seo-agent/types";

export type AuditIssueInput = {
  pageUrl: string;
  issueType: string;
  issueMessage: string;
  severity: SeoIssueSeverity;
};

export type AuditRecommendationInput = {
  pageUrl: string;
  recommendationType: string;
  title: string;
  description: string;
};

export type AuditKeywordOpportunityInput = {
  keyword: string;
  targetPage: string;
  searchIntent: string;
  priority: SeoIssueSeverity;
  recommendation: string;
};

export type AuditIndexedUrlInput = {
  url: string;
  source: string;
  status: "New" | "Fixed";
  lastCheckedAt: string;
};

export type SeoAuditResult = {
  siteUrl: string;
  auditDate: string;
  completedAt: string;
  overallScore: number;
  pagesChecked: number;
  issues: AuditIssueInput[];
  recommendations: AuditRecommendationInput[];
  keywordOpportunities: AuditKeywordOpportunityInput[];
  indexedUrls: AuditIndexedUrlInput[];
  statusSummary: Record<string, "Healthy" | "Needs Review" | "Not Audited Yet">;
  setupWarnings: string[];
};

type FetchedResource = {
  url: string;
  finalUrl: string;
  status: number;
  ok: boolean;
  body: string;
  responseTimeMs: number;
  sizeBytes: number;
  error?: string;
};

const crawlerUserAgent = "TEMACORE SEO Agent/1.0";
const slowResponseThresholdMs = Number(process.env.SEO_AUDIT_SLOW_RESPONSE_MS ?? 3000);
const majorStructuredDataPaths = ["/", "/contact"];

function makeIssue(
  pageUrl: string,
  issueType: string,
  issueMessage: string,
  severity: SeoIssueSeverity
): AuditIssueInput {
  return {
    pageUrl,
    issueType,
    issueMessage,
    severity
  };
}

function normalizeBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    siteUrl: getSiteUrl(),
    setupWarnings: configuredUrl ? [] : ["NEXT_PUBLIC_SITE_URL is not configured; using the site fallback URL."]
  };
}

function sameOrigin(url: URL, baseUrl: string) {
  return url.origin === new URL(baseUrl).origin;
}

function toAbsoluteUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, baseUrl).toString().replace(/#.*$/, "");
  } catch {
    return null;
  }
}

function pathFromUrl(value: string) {
  try {
    const url = new URL(value);

    return url.pathname.replace(/\/$/, "") || "/";
  } catch {
    return value;
  }
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#039;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function stripTags(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
}

async function fetchResource(url: string): Promise<FetchedResource> {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": crawlerUserAgent
      },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store"
    });
    const body = await response.text();

    return {
      url,
      finalUrl: response.url,
      status: response.status,
      ok: response.ok,
      body,
      responseTimeMs: Date.now() - startedAt,
      sizeBytes: new TextEncoder().encode(body).length
    };
  } catch (error) {
    return {
      url,
      finalUrl: url,
      status: 0,
      ok: false,
      body: "",
      responseTimeMs: Date.now() - startedAt,
      sizeBytes: 0,
      error: error instanceof Error ? error.message : "Request failed."
    };
  } finally {
    clearTimeout(timeout);
  }
}

function parseSitemapUrls(xml: string) {
  const urls = new Set<string>();
  const invalidUrls: string[] = [];
  const locPattern = /<loc>\s*([^<]+)\s*<\/loc>/gi;
  let match: RegExpExecArray | null;

  while ((match = locPattern.exec(xml))) {
    const rawUrl = decodeHtml(match[1]);

    try {
      urls.add(new URL(rawUrl).toString());
    } catch {
      invalidUrls.push(rawUrl);
    }
  }

  return {
    urls: Array.from(urls),
    invalidUrls
  };
}

function extractMetaContent(html: string, selector: "description" | "og:title" | "og:description") {
  const namePattern =
    selector === "description"
      ? /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
      : new RegExp(`<meta[^>]+property=["']${selector.replace(":", "\\:")}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i");
  const reversedPattern =
    selector === "description"
      ? /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i
      : new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*property=["']${selector.replace(":", "\\:")}["'][^>]*>`, "i");

  return decodeHtml(namePattern.exec(html)?.[1] ?? reversedPattern.exec(html)?.[1] ?? "");
}

function extractCanonical(html: string) {
  return decodeHtml(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i.exec(html)?.[1] ??
      /<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["'][^>]*>/i.exec(html)?.[1] ??
      ""
  );
}

function extractTitle(html: string) {
  return stripTags(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "");
}

function extractH1s(html: string) {
  const h1s: string[] = [];
  const pattern = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    h1s.push(stripTags(match[1]));
  }

  return h1s.filter(Boolean);
}

function extractJsonLd(html: string) {
  const scripts: string[] = [];
  const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    scripts.push(match[1].trim());
  }

  return scripts;
}

function extractInternalLinks(html: string, pageUrl: string, siteUrl: string) {
  const links = new Set<string>();
  const pattern = /<a[^>]+href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    const href = match[1].trim();

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }

    const absoluteUrl = toAbsoluteUrl(href, pageUrl);

    if (!absoluteUrl) {
      continue;
    }

    const parsedUrl = new URL(absoluteUrl);

    if (sameOrigin(parsedUrl, siteUrl)) {
      links.add(parsedUrl.toString().replace(/#.*$/, ""));
    }
  }

  return Array.from(links);
}

function extractExternalLinks(html: string, pageUrl: string, siteUrl: string) {
  const links: string[] = [];
  const pattern = /<a[^>]+href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    const href = match[1].trim();
    const absoluteUrl = toAbsoluteUrl(href, pageUrl);

    if (!absoluteUrl) {
      continue;
    }

    const parsedUrl = new URL(absoluteUrl);

    if (!sameOrigin(parsedUrl, siteUrl) && parsedUrl.protocol.startsWith("http")) {
      links.push(absoluteUrl);
    }
  }

  return links;
}

function extractImages(html: string) {
  const images: { tag: string; src: string; alt: string | null; isDecorative: boolean }[] = [];
  const pattern = /<img\b([^>]*)>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html))) {
    const attributes = match[1];
    const src = /src=["']([^"']*)["']/i.exec(attributes)?.[1] ?? "inline image";
    const altMatch = /alt=["']([^"']*)["']/i.exec(attributes);
    const role = /role=["']([^"']*)["']/i.exec(attributes)?.[1] ?? "";
    const ariaHidden = /aria-hidden=["']true["']/i.test(attributes);
    const isDecorative = ariaHidden || role === "presentation" || role === "none";

    images.push({
      tag: match[0],
      src,
      alt: altMatch ? altMatch[1] : null,
      isDecorative
    });
  }

  return images;
}

function extractTextLength(html: string) {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");

  return stripTags(withoutScripts).length;
}

function scoreFromIssues(issues: AuditIssueInput[]) {
  const deductions = {
    Critical: 10,
    High: 5,
    Medium: 2,
    Low: 1
  };
  const totalDeduction = issues.reduce((sum, issue) => sum + deductions[issue.severity], 0);

  return Math.max(0, Math.min(100, 100 - totalDeduction));
}

function summarizeStatuses(issues: AuditIssueInput[]) {
  const categories = [
    "Sitemap",
    "Robots.txt",
    "llms.txt",
    "Metadata",
    "Structured data",
    "Broken links",
    "Basic response performance"
  ];

  return Object.fromEntries(
    categories.map((category) => [
      category,
      issues.some((issue) => issue.issueType === category) ? "Needs Review" : "Healthy"
    ])
  ) as SeoAuditResult["statusSummary"];
}

function hasExpectedStructuredData(path: string) {
  return majorStructuredDataPaths.includes(path) || path.startsWith("/services/");
}

function checkRobots(
  robots: FetchedResource,
  siteUrl: string,
  issues: AuditIssueInput[]
) {
  if (!robots.ok) {
    issues.push(
      makeIssue(
        `${siteUrl}/robots.txt`,
        "Robots.txt",
        `robots.txt is unreachable. Status: ${robots.status || robots.error}`,
        "Critical"
      )
    );
    return;
  }

  const body = robots.body;

  if (!/sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i.test(body)) {
    issues.push(makeIssue(robots.url, "Robots.txt", "robots.txt does not reference sitemap.xml.", "High"));
  }

  if (/user-agent:\s*\*\s*[\s\S]*?disallow:\s*\/\s*(?:\n|$)/i.test(body)) {
    issues.push(makeIssue(robots.url, "Robots.txt", "robots.txt appears to block all public crawling.", "Critical"));
  }

  if (!/disallow:\s*\/admin/i.test(body)) {
    issues.push(makeIssue(robots.url, "Robots.txt", "robots.txt should disallow /admin.", "High"));
  }

  ["Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot", "Claude-User", "Claude-SearchBot"].forEach(
    (crawler) => {
      const crawlerBlock = new RegExp(`user-agent:\\s*${crawler}[\\s\\S]*?allow:\\s*\\/`, "i");

      if (!crawlerBlock.test(body)) {
        issues.push(
          makeIssue(robots.url, "Robots.txt", `${crawler} is not explicitly allowed in robots.txt.`, "Low")
        );
      }
    }
  );
}

async function checkLlms(
  llms: FetchedResource,
  siteUrl: string,
  fetchCache: Map<string, Promise<FetchedResource>>,
  issues: AuditIssueInput[]
) {
  if (!llms.ok) {
    issues.push(
      makeIssue(
        `${siteUrl}/llms.txt`,
        "llms.txt",
        `llms.txt is unreachable. Status: ${llms.status || llms.error}`,
        "Critical"
      )
    );
    return;
  }

  if (
    !llms.body.includes(
      "Temacore is an AI-first technology company"
    )
  ) {
    issues.push(makeIssue(llms.url, "llms.txt", "llms.txt is missing the approved Temacore company summary.", "High"));
  }

  ["/services", "/industries", "/how-it-works", "/contact"].forEach((path) => {
    if (!llms.body.includes(path)) {
      issues.push(makeIssue(llms.url, "llms.txt", `llms.txt is missing the ${path} link.`, "Medium"));
    }
  });

  services.forEach((service) => {
    const path = `/services/${service.slug}`;

    if (!llms.body.includes(path)) {
      issues.push(makeIssue(llms.url, "llms.txt", `llms.txt is missing ${path}.`, "Medium"));
    }
  });

  const links = Array.from(new Set(llms.body.match(/https?:\/\/[^\s)]+/g) ?? []));

  for (const link of links) {
    const absoluteUrl = toAbsoluteUrl(link, siteUrl);

    if (!absoluteUrl) {
      issues.push(makeIssue(llms.url, "llms.txt", `Invalid URL in llms.txt: ${link}`, "Medium"));
      continue;
    }

    const parsedUrl = new URL(absoluteUrl);

    if (!sameOrigin(parsedUrl, siteUrl)) {
      continue;
    }

    const linkedPage = await cachedFetch(fetchCache, absoluteUrl);

    if (!linkedPage.ok) {
      issues.push(
        makeIssue(
          llms.url,
          "llms.txt",
          `llms.txt references an unavailable internal URL: ${absoluteUrl}`,
          "High"
        )
      );
    }
  }
}

function cachedFetch(cache: Map<string, Promise<FetchedResource>>, url: string) {
  if (!cache.has(url)) {
    cache.set(url, fetchResource(url));
  }

  return cache.get(url) as Promise<FetchedResource>;
}

function checkMetadata(page: FetchedResource, issues: AuditIssueInput[], recommendations: AuditRecommendationInput[]) {
  if (!page.ok) {
    issues.push(
      makeIssue(
        page.url,
        "Metadata",
        `Page returned an invalid HTTP status: ${page.status || page.error}`,
        "High"
      )
    );
    return;
  }

  const title = extractTitle(page.body);
  const description = extractMetaContent(page.body, "description");
  const canonical = extractCanonical(page.body);
  const ogTitle = extractMetaContent(page.body, "og:title");
  const ogDescription = extractMetaContent(page.body, "og:description");
  const h1s = extractH1s(page.body);

  if (!title) {
    issues.push(makeIssue(page.url, "Metadata", "Missing <title> tag.", "High"));
    recommendations.push({
      pageUrl: page.url,
      recommendationType: "Metadata",
      title: "Add a page title",
      description: "Site-based recommendation: add a clear SEO title to this page."
    });
  }

  if (!description) {
    issues.push(makeIssue(page.url, "Metadata", "Missing meta description.", "Medium"));
    recommendations.push({
      pageUrl: page.url,
      recommendationType: "Metadata",
      title: "Add a meta description",
      description: "Site-based recommendation: add a concise description aligned with the page purpose."
    });
  }

  if (!canonical) {
    issues.push(makeIssue(page.url, "Metadata", "Missing canonical URL.", "High"));
  }

  if (!ogTitle) {
    issues.push(makeIssue(page.url, "Metadata", "Missing Open Graph title.", "Low"));
  }

  if (!ogDescription) {
    issues.push(makeIssue(page.url, "Metadata", "Missing Open Graph description.", "Low"));
  }

  if (h1s.length === 0) {
    issues.push(makeIssue(page.url, "Metadata", "Missing H1 heading.", "High"));
  }

  if (h1s.length > 1) {
    issues.push(makeIssue(page.url, "Metadata", "Duplicate H1 headings found.", "Low"));
  }

  if (description && description.length < 90) {
    recommendations.push({
      pageUrl: page.url,
      recommendationType: "Metadata",
      title: "Review short metadata",
      description: "Site-based recommendation: review whether the meta description is descriptive enough."
    });
  }
}

function checkStructuredData(page: FetchedResource, issues: AuditIssueInput[]) {
  if (!page.ok) {
    return;
  }

  const scripts = extractJsonLd(page.body);
  const path = pathFromUrl(page.url);

  if (scripts.length === 0 && hasExpectedStructuredData(path)) {
    issues.push(makeIssue(page.url, "Structured data", "Expected JSON-LD structured data is missing.", "Medium"));
    return;
  }

  scripts.forEach((script, index) => {
    try {
      JSON.parse(script);
    } catch {
      issues.push(
        makeIssue(page.url, "Structured data", `JSON-LD script ${index + 1} is not parseable JSON.`, "High")
      );
    }
  });
}

async function checkInternalLinks(
  page: FetchedResource,
  siteUrl: string,
  fetchCache: Map<string, Promise<FetchedResource>>,
  issues: AuditIssueInput[],
  recommendations: AuditRecommendationInput[]
) {
  if (!page.ok) {
    return;
  }

  const internalLinks = extractInternalLinks(page.body, page.url, siteUrl);
  const externalLinks = extractExternalLinks(page.body, page.url, siteUrl);

  externalLinks.forEach((link) => {
    try {
      new URL(link);
    } catch {
      issues.push(makeIssue(page.url, "Broken links", `Invalid external URL format: ${link}`, "Low"));
    }
  });

  for (const link of internalLinks) {
    const linkedPage = await cachedFetch(fetchCache, link);

    if (!linkedPage.ok) {
      issues.push(
        makeIssue(
          page.url,
          "Broken links",
          `Internal link is unavailable: ${link}. Status: ${linkedPage.status || linkedPage.error}`,
          "High"
        )
      );
      recommendations.push({
        pageUrl: page.url,
        recommendationType: "Internal links",
        title: "Fix broken internal link",
        description: `Site-based recommendation: update or remove the broken internal link to ${link}.`
      });
    }
  }
}

function checkImages(page: FetchedResource, issues: AuditIssueInput[]) {
  if (!page.ok) {
    return;
  }

  extractImages(page.body).forEach((image) => {
    if (image.alt === null) {
      issues.push(makeIssue(page.url, "Image alt text", `Image is missing alt text: ${image.src}`, "Low"));
    } else if (image.alt.trim() === "" && !image.isDecorative) {
      issues.push(
        makeIssue(
          page.url,
          "Image alt text",
          `Image has empty alt text but is not marked decorative: ${image.src}`,
          "Low"
        )
      );
    }
  });
}

function checkPerformance(page: FetchedResource, issues: AuditIssueInput[]) {
  if (!page.ok) {
    return;
  }

  if (page.responseTimeMs > slowResponseThresholdMs) {
    issues.push(
      makeIssue(
        page.url,
        "Basic response performance",
        `Basic response time was ${page.responseTimeMs}ms, above the ${slowResponseThresholdMs}ms threshold.`,
        "Medium"
      )
    );
  }

  if (page.sizeBytes > 800_000) {
    issues.push(
      makeIssue(
        page.url,
        "Basic response performance",
        `HTML response size was ${Math.round(page.sizeBytes / 1024)}KB. Review page weight.`,
        "Low"
      )
    );
  }
}

function checkThinContent(page: FetchedResource, recommendations: AuditRecommendationInput[]) {
  if (!page.ok) {
    return;
  }

  const path = pathFromUrl(page.url);
  const textLength = extractTextLength(page.body);

  if (textLength < 700 && path !== "/admin/login") {
    recommendations.push({
      pageUrl: page.url,
      recommendationType: "Content",
      title: "Review thin content",
      description: "Site-based recommendation: review whether this page has enough useful, crawlable content."
    });
  }

  if (path.startsWith("/services/") && !/FAQ/i.test(page.body)) {
    recommendations.push({
      pageUrl: page.url,
      recommendationType: "FAQ",
      title: "Add service FAQ section",
      description: "Site-based recommendation: add helpful FAQs to clarify service scope and process."
    });
  }
}

export async function runSeoAudit(): Promise<SeoAuditResult> {
  const { siteUrl, setupWarnings } = normalizeBaseUrl();
  const auditDate = new Date().toISOString();
  const issues: AuditIssueInput[] = setupWarnings.map((warning) =>
    makeIssue(siteUrl, "Configuration", warning, "Low")
  );
  const recommendations: AuditRecommendationInput[] = [];
  const keywordOpportunities: AuditKeywordOpportunityInput[] = [];
  const indexedUrls: AuditIndexedUrlInput[] = [];
  const fetchCache = new Map<string, Promise<FetchedResource>>();
  const sitemapUrl = `${siteUrl}/sitemap.xml`;
  const robotsUrl = `${siteUrl}/robots.txt`;
  const llmsUrl = `${siteUrl}/llms.txt`;

  const [sitemap, robots, llms] = await Promise.all([
    cachedFetch(fetchCache, sitemapUrl),
    cachedFetch(fetchCache, robotsUrl),
    cachedFetch(fetchCache, llmsUrl)
  ]);

  let sitemapUrls: string[] = [];

  if (!sitemap.ok) {
    issues.push(
      makeIssue(
        sitemapUrl,
        "Sitemap",
        `sitemap.xml is unreachable. Status: ${sitemap.status || sitemap.error}`,
        "Critical"
      )
    );
  } else {
    const parsedSitemap = parseSitemapUrls(sitemap.body);
    sitemapUrls = parsedSitemap.urls;

    parsedSitemap.invalidUrls.forEach((invalidUrl) => {
      issues.push(makeIssue(sitemapUrl, "Sitemap", `Invalid sitemap URL: ${invalidUrl}`, "High"));
    });

    if (sitemapUrls.length === 0) {
      issues.push(makeIssue(sitemapUrl, "Sitemap", "sitemap.xml does not contain any URLs.", "Critical"));
    }
  }

  checkRobots(robots, siteUrl, issues);
  await checkLlms(llms, siteUrl, fetchCache, issues);

  for (const url of sitemapUrls) {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      issues.push(makeIssue(sitemapUrl, "Sitemap", `Sitemap URL is not absolute: ${url}`, "High"));
      continue;
    }

    if (!sameOrigin(parsedUrl, siteUrl)) {
      issues.push(makeIssue(sitemapUrl, "Sitemap", `Sitemap URL is outside the configured site: ${url}`, "Medium"));
    }

    const page = await cachedFetch(fetchCache, url);

    indexedUrls.push({
      url,
      source: "sitemap",
      status: page.ok ? "Fixed" : "New",
      lastCheckedAt: auditDate
    });

    if (!page.ok) {
      issues.push(
        makeIssue(
          url,
          "Sitemap",
          `Sitemap URL is unavailable. Status: ${page.status || page.error}`,
          page.status >= 500 || page.status === 0 ? "Critical" : "High"
        )
      );
      continue;
    }

    checkMetadata(page, issues, recommendations);
    checkStructuredData(page, issues);
    await checkInternalLinks(page, siteUrl, fetchCache, issues, recommendations);
    checkImages(page, issues);
    checkPerformance(page, issues);
    checkThinContent(page, recommendations);
  }

  recommendations.forEach((recommendation) => {
    if (recommendation.recommendationType === "Internal links") {
      keywordOpportunities.push({
        keyword: "internal link optimization",
        targetPage: recommendation.pageUrl,
        searchIntent: "Site structure improvement",
        priority: "Low",
        recommendation: recommendation.description
      });
    }
  });

  const overallScore = scoreFromIssues(issues);
  const completedAt = new Date().toISOString();

  return {
    siteUrl,
    auditDate,
    completedAt,
    overallScore,
    pagesChecked: sitemapUrls.length,
    issues,
    recommendations,
    keywordOpportunities,
    indexedUrls,
    statusSummary: summarizeStatuses(issues),
    setupWarnings
  };
}
