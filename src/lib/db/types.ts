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

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "updated_at" | "status"> & {
          status?: LeadStatus;
        };
        Update: Partial<Omit<Lead, "id" | "created_at">>;
      };
      client_intakes: {
        Row: ClientIntake;
        Insert: Omit<ClientIntake, "id" | "created_at" | "updated_at" | "status"> & {
          status?: IntakeStatus;
        };
        Update: Partial<Omit<ClientIntake, "id" | "created_at">>;
      };
      project_requests: {
        Row: ProjectRequest;
        Insert: Omit<ProjectRequest, "id" | "created_at" | "updated_at" | "status"> & {
          status?: ProjectRequestStatus;
        };
        Update: Partial<Omit<ProjectRequest, "id" | "created_at">>;
      };
      talent_applications: {
        Row: TalentApplication;
        Insert: Omit<TalentApplication, "id" | "created_at" | "updated_at" | "status"> & {
          status?: TalentApplicationStatus;
        };
        Update: Partial<Omit<TalentApplication, "id" | "created_at">>;
      };
      admin_users: {
        Row: AdminUser;
        Insert: Omit<AdminUser, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<AdminUser, "id" | "created_at">>;
      };
    };
  };
};
