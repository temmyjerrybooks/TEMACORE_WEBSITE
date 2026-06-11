import type { ContentRecommendation, KeywordOpportunity, SeoIssue, WebsiteAlert } from "./types";

// Placeholder data for the protected future SEO Agent dashboard.
// Replace with Supabase-backed audit results when authentication and scheduled audits are implemented.
export const mockSeoAgentSummary = {
  overallScore: "Pending",
  pagesChecked: "Configured",
  issuesFound: "Pending",
  latestAuditDate: "Pending live audit",
  aiSearchReadiness: "Foundation implemented"
};

export const mockSeoIssues: SeoIssue[] = [
  {
    id: "issue-1",
    audit_id: "mock-audit",
    page_url: "/services",
    issue_type: "Metadata",
    issue_message: "Review service page descriptions after final content approval.",
    severity: "Medium",
    status: "New",
    created_at: new Date().toISOString()
  },
  {
    id: "issue-2",
    audit_id: "mock-audit",
    page_url: "/admin",
    issue_type: "Access control",
    issue_message: "Connect authentication before exposing operational records.",
    severity: "High",
    status: "In Review",
    created_at: new Date().toISOString()
  }
];

export const mockKeywordOpportunities: KeywordOpportunity[] = [
  {
    id: "keyword-1",
    keyword: "remote operations teams",
    target_page: "/services/remote-teams",
    search_intent: "Service research",
    priority: "High",
    recommendation: "Maintain clear service definitions and FAQs without unsupported claims.",
    status: "New",
    created_at: new Date().toISOString()
  },
  {
    id: "keyword-2",
    keyword: "client portal development",
    target_page: "/services/client-portal-development",
    search_intent: "Project scoping",
    priority: "Medium",
    recommendation: "Add project examples only when real client-approved examples exist.",
    status: "New",
    created_at: new Date().toISOString()
  }
];

export const mockContentRecommendations: ContentRecommendation[] = [
  {
    id: "content-1",
    page_url: "/industries",
    recommendation_type: "Internal linking",
    title: "Link industry sections to service pages",
    description: "Connect service-heavy industry descriptions to relevant Temacore service pages.",
    status: "New",
    created_at: new Date().toISOString()
  }
];

export const mockWebsiteAlerts: WebsiteAlert[] = [
  {
    id: "alert-1",
    alert_type: "Environment",
    message: "Confirm production email and Supabase environment variables after deployment.",
    severity: "Medium",
    status: "In Review",
    created_at: new Date().toISOString()
  }
];
