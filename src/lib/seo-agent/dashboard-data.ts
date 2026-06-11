import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
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
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    return emptyDashboard(
      "Supabase is not connected yet. Add the required environment variables and run the SEO schema to enable live audit storage."
    );
  }

  const supabase = getSupabaseAdminClient();
  const { data: latestAudit, error: auditError } = await supabase
    .from("seo_audits")
    .select("*")
    .order("audit_date", { ascending: false })
    .limit(1)
    .maybeSingle();

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

  const [{ data: issues }, { data: recommendations }, { data: keywordOpportunities }, { data: alerts }] =
    await Promise.all([
      supabase
        .from("seo_issues")
        .select("*")
        .eq("audit_id", latestAudit.id)
        .order("created_at", { ascending: false })
        .limit(25),
      supabase
        .from("content_recommendations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("keyword_opportunities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("website_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)
    ]);

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
