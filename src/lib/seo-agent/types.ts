export type SeoIssueStatus = "New" | "In Review" | "In Progress" | "Fixed" | "Ignored";
export type SeoIssueSeverity = "Low" | "Medium" | "High" | "Critical";

export type SeoAudit = {
  id: string;
  audit_date: string;
  overall_score: number;
  pages_checked: number;
  issues_found: number;
  created_at: string;
};

export type SeoIssue = {
  id: string;
  audit_id: string;
  page_url: string;
  issue_type: string;
  issue_message: string;
  severity: SeoIssueSeverity;
  status: SeoIssueStatus;
  created_at: string;
};

export type KeywordOpportunity = {
  id: string;
  keyword: string;
  target_page: string;
  search_intent: string;
  priority: SeoIssueSeverity;
  recommendation: string;
  status: SeoIssueStatus;
  created_at: string;
};

export type ContentRecommendation = {
  id: string;
  page_url: string;
  recommendation_type: string;
  title: string;
  description: string;
  status: SeoIssueStatus;
  created_at: string;
};

export type IndexedUrl = {
  id: string;
  url: string;
  source: string;
  status: SeoIssueStatus;
  last_checked_at: string;
  created_at: string;
};

export type WebsiteAlert = {
  id: string;
  alert_type: string;
  message: string;
  severity: SeoIssueSeverity;
  status: SeoIssueStatus;
  created_at: string;
};
