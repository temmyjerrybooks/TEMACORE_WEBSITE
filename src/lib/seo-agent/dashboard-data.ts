import { getDatabaseConfig } from "@/lib/db/config";
import { getDatabase } from "@/lib/db/postgres";
import type {
  ContentRecommendation,
  KeywordOpportunity,
  SeoAudit,
  SeoIssue,
  WebsiteAlert
} from "@/lib/db/types";

export type SeoAgentDashboardData = {
  isConfigured: boolean;
  setupMessage?: string;
  latestAudit: SeoAudit | null;
  latestIssues: SeoIssue[];
  recommendations: ContentRecommendation[];
  keywordOpportunities: KeywordOpportunity[];
  alerts: WebsiteAlert[];
  counts: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  statusCards: {
    label: string;
    value: string;
  }[];
  runAuditEnabled: boolean;
};

function emptyDashboard(setupMessage?: string): SeoAgentDashboardData {
  return {
    isConfigured: false,
    setupMessage,
    latestAudit: null,
    latestIssues: [],
    recommendations: [],
    keywordOpportunities: [],
    alerts: [],
    counts: {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    },
    statusCards: [
      { label: "Sitemap", value: "Not Audited Yet" },
      { label: "Robots.txt", value: "Not Audited Yet" },
      { label: "llms.txt", value: "Not Audited Yet" },
      { label: "Metadata", value: "Not Audited Yet" },
      { label: "Structured Data", value: "Not Audited Yet" },
      { label: "Broken Links", value: "Broken Link Audit Not Run Yet" },
      { label: "Basic Response Performance", value: "Page Speed Audit Not Connected Yet" }
    ],
    runAuditEnabled: false
  };
}

function statusForIssueType(label: string, issues: SeoIssue[]) {
  const hasIssue = issues.some((issue) => issue.issue_type === label);

  return hasIssue ? "Needs Review" : "No Issues Found Yet";
}

function buildStatusCards(latestAudit: SeoAudit | null, issues: SeoIssue[]) {
  if (!latestAudit) {
    return emptyDashboard().statusCards;
  }

  return [
    { label: "Sitemap", value: statusForIssueType("Sitemap", issues) },
    { label: "Robots.txt", value: statusForIssueType("Robots.txt", issues) },
    { label: "llms.txt", value: statusForIssueType("llms.txt", issues) },
    { label: "Metadata", value: statusForIssueType("Metadata", issues) },
    { label: "Structured Data", value: statusForIssueType("Structured data", issues) },
    { label: "Broken Links", value: statusForIssueType("Broken links", issues) },
    { label: "Basic Response Performance", value: statusForIssueType("Basic response performance", issues) }
  ];
}

function countSeverities(issues: SeoIssue[]) {
  return {
    total: issues.length,
    critical: issues.filter((issue) => issue.severity === "Critical").length,
    high: issues.filter((issue) => issue.severity === "High").length,
    medium: issues.filter((issue) => issue.severity === "Medium").length,
    low: issues.filter((issue) => issue.severity === "Low").length
  };
}

export async function getSeoAgentDashboardData(): Promise<SeoAgentDashboardData> {
  const config = getDatabaseConfig();

  if (!config.isConfigured) {
    return emptyDashboard(
      "PostgreSQL is not connected yet. Configure DATABASE_URL and run npm run db:migrate to enable database storage."
    );
  }

  const database = getDatabase();
  const { data: latestAudit, error: auditError } = await database.selectOne("seo_audits", { orderBy: "audit_date", ascending: false, limit: 1 });

  if (auditError) {
    return emptyDashboard(auditError.message);
  }

  if (!latestAudit) {
    return {
      ...emptyDashboard(),
      isConfigured: true,
      runAuditEnabled: true
    };
  }

  const results = await Promise.all([
      database.select("seo_issues", { equals: { audit_id: latestAudit.id }, orderBy: "created_at", ascending: false, limit: 25 }),
      database.select("content_recommendations", { orderBy: "created_at", ascending: false, limit: 8 }),
      database.select("keyword_opportunities", { orderBy: "created_at", ascending: false, limit: 8 }),
      database.select("website_alerts", { orderBy: "created_at", ascending: false, limit: 8 })
    ]);

  const failed = results.find(result => result.error);
  if (failed?.error) return emptyDashboard(failed.error.message);
  const [{ data: issues }, { data: recommendations }, { data: keywordOpportunities }, { data: alerts }] = results;

  const latestIssues = issues ?? [];

  return {
    isConfigured: true,
    latestAudit,
    latestIssues,
    recommendations: recommendations ?? [],
    keywordOpportunities: keywordOpportunities ?? [],
    alerts: alerts ?? [],
    counts: countSeverities(latestIssues),
    statusCards: buildStatusCards(latestAudit, latestIssues),
    runAuditEnabled: true
  };
}
