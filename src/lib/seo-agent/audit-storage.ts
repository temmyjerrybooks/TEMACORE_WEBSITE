import { sendWebsiteAlert } from "@/lib/alerts/website-alerts";
import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";
import type { SeoIssueSeverity } from "@/lib/seo-agent/types";
import { runSeoAudit, type SeoAuditResult } from "@/lib/seo-agent/audit-engine";

export type StoredSeoAuditSummary = {
  audit_id: string;
  overall_score: number;
  pages_checked: number;
  issues_found: number;
  critical_issues: number;
  high_issues: number;
  medium_issues: number;
  low_issues: number;
  completed_at: string;
};

function severityCounts(issues: { severity: SeoIssueSeverity }[]) {
  return {
    critical_issues: issues.filter((issue) => issue.severity === "Critical").length,
    high_issues: issues.filter((issue) => issue.severity === "High").length,
    medium_issues: issues.filter((issue) => issue.severity === "Medium").length,
    low_issues: issues.filter((issue) => issue.severity === "Low").length
  };
}

export function summarizeStoredAudit(auditId: string, result: SeoAuditResult): StoredSeoAuditSummary {
  return {
    audit_id: auditId,
    overall_score: result.overallScore,
    pages_checked: result.pagesChecked,
    issues_found: result.issues.length,
    ...severityCounts(result.issues),
    completed_at: result.completedAt
  };
}

export async function recordWebsiteAlert(input: {
  alertType: string;
  message: string;
  severity: SeoIssueSeverity;
}) {
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    return;
  }

  const supabase = getSupabaseAdminClient();

  await supabase.from("website_alerts").insert({
    alert_type: input.alertType,
    message: input.message,
    severity: input.severity,
    status: "New"
  });
}

export async function runAndStoreSeoAudit() {
  const config = getSupabaseAdminConfig();

  if (!config.isConfigured) {
    throw new Error(
      "Supabase is not connected yet. Add the required server-side Supabase settings, then run src/lib/db/seo-schema.sql."
    );
  }

  const result = await runSeoAudit();
  const supabase = getSupabaseAdminClient();
  const { data: audit, error: auditError } = await supabase
    .from("seo_audits")
    .insert({
      audit_date: result.auditDate,
      overall_score: result.overallScore,
      pages_checked: result.pagesChecked,
      issues_found: result.issues.length
    })
    .select("id")
    .single();

  if (auditError || !audit) {
    throw new Error(auditError?.message ?? "Unable to store SEO audit.");
  }

  if (result.issues.length > 0) {
    const { error } = await supabase.from("seo_issues").insert(
      result.issues.map((issue) => ({
        audit_id: audit.id,
        page_url: issue.pageUrl,
        issue_type: issue.issueType,
        issue_message: issue.issueMessage,
        severity: issue.severity,
        status: "New" as const
      }))
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  if (result.indexedUrls.length > 0) {
    await supabase.from("indexed_urls").insert(
      result.indexedUrls.map((url) => ({
        url: url.url,
        source: url.source,
        status: url.status,
        last_checked_at: url.lastCheckedAt
      }))
    );
  }

  if (result.recommendations.length > 0) {
    await supabase.from("content_recommendations").insert(
      result.recommendations.map((recommendation) => ({
        page_url: recommendation.pageUrl,
        recommendation_type: recommendation.recommendationType,
        title: recommendation.title,
        description: recommendation.description,
        status: "New" as const
      }))
    );
  }

  if (result.keywordOpportunities.length > 0) {
    await supabase.from("keyword_opportunities").insert(
      result.keywordOpportunities.map((opportunity) => ({
        keyword: opportunity.keyword,
        target_page: opportunity.targetPage,
        search_intent: opportunity.searchIntent,
        priority: opportunity.priority,
        recommendation: opportunity.recommendation,
        status: "New" as const
      }))
    );
  }

  const alertableIssues = result.issues.filter(
    (issue) => issue.severity === "Critical" || issue.severity === "High"
  );

  if (alertableIssues.length > 0) {
    await supabase.from("website_alerts").insert(
      alertableIssues.slice(0, 10).map((issue) => ({
        alert_type: "SEO audit",
        message: `${issue.issueType}: ${issue.issueMessage}`,
        severity: issue.severity,
        status: "New" as const
      }))
    );

    const highestSeverity = alertableIssues.some((issue) => issue.severity === "Critical")
      ? "Critical"
      : "High";

    await sendWebsiteAlert({
      alertType: "SEO audit failure",
      message: `SEO audit found ${alertableIssues.length} high-priority issue(s).`,
      severity: highestSeverity,
      context: [
        { label: "Audit ID", value: audit.id },
        { label: "Site", value: result.siteUrl }
      ]
    });
  }

  return {
    result,
    summary: summarizeStoredAudit(audit.id, result)
  };
}
