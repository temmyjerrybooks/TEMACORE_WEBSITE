export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost"
  | "archived";

export type IntakeStatus =
  | "submitted"
  | "reviewing"
  | "needs_information"
  | "approved_for_scoping"
  | "closed";

export type ProjectRequestStatus =
  | "submitted"
  | "reviewing"
  | "scoping"
  | "proposal_sent"
  | "approved"
  | "declined"
  | "closed";

export type TalentApplicationStatus =
  | "submitted"
  | "screening"
  | "interview"
  | "bench"
  | "hired"
  | "declined"
  | "archived";

export type AdminRole = "owner" | "admin" | "manager" | "viewer";
export type SeoWorkflowStatus = "New" | "In Review" | "In Progress" | "Fixed" | "Ignored";
export type SeoSeverity = "Low" | "Medium" | "High" | "Critical";

export type TimestampedRecord = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type Lead = TimestampedRecord & {
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  region?: string | null;
  service_interest?: string | null;
  source: "contact" | "client_intake" | "project_request" | "referral";
  status: LeadStatus;
  notes?: string | null;
};

export type ClientIntake = TimestampedRecord & {
  lead_id?: string | null;
  company_name: string;
  website?: string | null;
  region: string;
  services_needed: string[];
  monthly_volume?: string | null;
  current_tools?: string | null;
  workflow_summary: string;
  desired_start_date?: string | null;
  status: IntakeStatus;
};

export type ProjectRequest = TimestampedRecord & {
  lead_id?: string | null;
  project_type: "client_portal" | "crm" | "dashboard" | "automation" | "custom_app" | "other";
  company_name: string;
  contact_email: string;
  budget_range?: string | null;
  timeline?: string | null;
  current_tools?: string | null;
  requirements_summary: string;
  status: ProjectRequestStatus;
};

export type TalentApplication = TimestampedRecord & {
  full_name: string;
  email: string;
  country?: string | null;
  role_interest: string;
  experience_level?: string | null;
  portfolio_url?: string | null;
  availability?: string | null;
  experience_summary?: string | null;
  status: TalentApplicationStatus;
};

export type AdminUser = TimestampedRecord & {
  auth_user_id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
};

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
  audit_id?: string | null;
  page_url: string;
  issue_type: string;
  issue_message: string;
  severity: SeoSeverity;
  status: SeoWorkflowStatus;
  created_at: string;
};

export type KeywordOpportunity = {
  id: string;
  keyword: string;
  target_page: string;
  search_intent: string;
  priority: SeoSeverity;
  recommendation: string;
  status: SeoWorkflowStatus;
  created_at: string;
};

export type ContentRecommendation = {
  id: string;
  page_url: string;
  recommendation_type: string;
  title: string;
  description: string;
  status: SeoWorkflowStatus;
  created_at: string;
};

export type IndexedUrl = {
  id: string;
  url: string;
  source: string;
  status: SeoWorkflowStatus;
  last_checked_at?: string | null;
  created_at: string;
};

export type WebsiteAlert = {
  id: string;
  alert_type: string;
  message: string;
  severity: SeoSeverity;
  status: SeoWorkflowStatus;
  created_at: string;
};

export type InvestorDeckEventName =
  | "investor_deck_page_view"
  | "investor_deck_started"
  | "investor_deck_slide_viewed"
  | "investor_deck_halfway_reached"
  | "investor_deck_completed"
  | "investor_deck_pdf_downloaded"
  | "investor_deck_contact_clicked"
  | "investor_deck_fullscreen_opened"
  | "investor_deck_autoplay_started";

export type InvestorDeckEvent = {
  id: string;
  session_id: string;
  event_name: InvestorDeckEventName;
  slide_number?: number | null;
  referrer?: string | null;
  user_agent_category?: "desktop" | "mobile" | "tablet" | null;
  created_at: string;
};

export type WhitepaperEventName =
  | "whitepaper_page_view"
  | "whitepaper_started"
  | "whitepaper_page_viewed"
  | "whitepaper_halfway_reached"
  | "whitepaper_completed"
  | "whitepaper_pdf_downloaded"
  | "whitepaper_contact_clicked"
  | "whitepaper_fullscreen_opened"
  | "whitepaper_view_mode_changed";

export type WhitepaperEvent = {
  id: string;
  session_id: string;
  event_name: WhitepaperEventName;
  page_number?: number | null;
  referrer?: string | null;
  user_agent_category?: "desktop" | "mobile" | "tablet" | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "updated_at" | "status"> & {
          status?: LeadStatus;
        };
        Update: Partial<Omit<Lead, "id" | "created_at">>;
        Relationships: [];
      };
      client_intakes: {
        Row: ClientIntake;
        Insert: Omit<ClientIntake, "id" | "created_at" | "updated_at" | "status"> & {
          status?: IntakeStatus;
        };
        Update: Partial<Omit<ClientIntake, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "client_intakes_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          }
        ];
      };
      project_requests: {
        Row: ProjectRequest;
        Insert: Omit<ProjectRequest, "id" | "created_at" | "updated_at" | "status"> & {
          status?: ProjectRequestStatus;
        };
        Update: Partial<Omit<ProjectRequest, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "project_requests_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          }
        ];
      };
      talent_applications: {
        Row: TalentApplication;
        Insert: Omit<TalentApplication, "id" | "created_at" | "updated_at" | "status"> & {
          status?: TalentApplicationStatus;
        };
        Update: Partial<Omit<TalentApplication, "id" | "created_at">>;
        Relationships: [];
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<AdminUser, "id" | "created_at">>;
        Relationships: [];
      };
      seo_audits: {
        Row: SeoAudit;
        Insert: Omit<SeoAudit, "id" | "created_at" | "audit_date"> & {
          audit_date?: string;
        };
        Update: Partial<Omit<SeoAudit, "id" | "created_at">>;
        Relationships: [];
      };
      seo_issues: {
        Row: SeoIssue;
        Insert: Omit<SeoIssue, "id" | "created_at" | "severity" | "status"> & {
          severity?: SeoSeverity;
          status?: SeoWorkflowStatus;
        };
        Update: Partial<Omit<SeoIssue, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "seo_issues_audit_id_fkey";
            columns: ["audit_id"];
            isOneToOne: false;
            referencedRelation: "seo_audits";
            referencedColumns: ["id"];
          }
        ];
      };
      keyword_opportunities: {
        Row: KeywordOpportunity;
        Insert: Omit<KeywordOpportunity, "id" | "created_at" | "priority" | "status"> & {
          priority?: SeoSeverity;
          status?: SeoWorkflowStatus;
        };
        Update: Partial<Omit<KeywordOpportunity, "id" | "created_at">>;
        Relationships: [];
      };
      content_recommendations: {
        Row: ContentRecommendation;
        Insert: Omit<ContentRecommendation, "id" | "created_at" | "status"> & {
          status?: SeoWorkflowStatus;
        };
        Update: Partial<Omit<ContentRecommendation, "id" | "created_at">>;
        Relationships: [];
      };
      indexed_urls: {
        Row: IndexedUrl;
        Insert: Omit<IndexedUrl, "id" | "created_at" | "status"> & {
          status?: SeoWorkflowStatus;
        };
        Update: Partial<Omit<IndexedUrl, "id" | "created_at">>;
        Relationships: [];
      };
      website_alerts: {
        Row: WebsiteAlert;
        Insert: Omit<WebsiteAlert, "id" | "created_at" | "severity" | "status"> & {
          severity?: SeoSeverity;
          status?: SeoWorkflowStatus;
        };
        Update: Partial<Omit<WebsiteAlert, "id" | "created_at">>;
        Relationships: [];
      };
      investor_deck_events: {
        Row: InvestorDeckEvent;
        Insert: Omit<InvestorDeckEvent, "id" | "created_at">;
        Update: Partial<Omit<InvestorDeckEvent, "id" | "created_at">>;
        Relationships: [];
      };
      whitepaper_events: {
        Row: WhitepaperEvent;
        Insert: Omit<WhitepaperEvent, "id" | "created_at">;
        Update: Partial<Omit<WhitepaperEvent, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: LeadStatus;
      intake_status: IntakeStatus;
      project_request_status: ProjectRequestStatus;
      talent_application_status: TalentApplicationStatus;
      admin_role: AdminRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
