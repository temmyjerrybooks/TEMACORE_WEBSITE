import { getSupabaseAdminConfig } from "@/lib/admin/config";
import { getSupabaseAdminClient } from "@/lib/db/supabase";

export type AdminDashboardItem = {
  title: string;
  meta: string;
  status?: string;
};

export type AdminDashboardSection = {
  title: string;
  description: string;
  href?: string;
  countLabel: string;
  items: AdminDashboardItem[];
  error?: string;
};

export type AdminDashboardData = {
  isConfigured: boolean;
  setupMessage?: string;
  sections: AdminDashboardSection[];
  settings: {
    label: string;
    isConfigured: boolean;
  }[];
};

function formatDate(value?: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

function sectionError(title: string, description: string, error: string, href?: string): AdminDashboardSection {
  return {
    title,
    description,
    href,
    countLabel: "Unavailable",
    items: [],
    error
  };
}

function emptySection(title: string, description: string, href?: string): AdminDashboardSection {
  return {
    title,
    description,
    href,
    countLabel: "0 records",
    items: []
  };
}

function countLabel(count: number | null) {
  return `${count ?? 0} ${count === 1 ? "record" : "records"}`;
}

async function getLeadsSection(): Promise<AdminDashboardSection> {
  const supabase = getSupabaseAdminClient();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("company_name, contact_name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  if (countError || error) {
    return sectionError("Leads", "Latest captured sales and contact leads.", countError?.message ?? error?.message ?? "Unable to load leads.");
  }

  return {
    title: "Leads",
    description: "Latest captured sales and contact leads.",
    countLabel: countLabel(count),
    items: (data ?? []).map((lead) => ({
      title: lead.company_name,
      meta: `${lead.contact_name} - ${lead.email} - ${formatDate(lead.created_at)}`,
      status: lead.status
    }))
  };
}

async function getClientIntakesSection(): Promise<AdminDashboardSection> {
  const supabase = getSupabaseAdminClient();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from("client_intakes").select("id", { count: "exact", head: true }),
    supabase
      .from("client_intakes")
      .select("company_name, region, services_needed, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  if (countError || error) {
    return sectionError("Client intakes", "Structured BPO and operations intake submissions.", countError?.message ?? error?.message ?? "Unable to load client intakes.");
  }

  return {
    title: "Client intakes",
    description: "Structured BPO and operations intake submissions.",
    countLabel: countLabel(count),
    items: (data ?? []).map((intake) => ({
      title: intake.company_name,
      meta: `${intake.region} - ${intake.services_needed.length} services - ${formatDate(intake.created_at)}`,
      status: intake.status
    }))
  };
}

async function getProjectRequestsSection(): Promise<AdminDashboardSection> {
  const supabase = getSupabaseAdminClient();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from("project_requests").select("id", { count: "exact", head: true }),
    supabase
      .from("project_requests")
      .select("company_name, contact_email, project_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  if (countError || error) {
    return sectionError("Project requests", "Custom application, CRM, portal, and automation requests.", countError?.message ?? error?.message ?? "Unable to load project requests.");
  }

  return {
    title: "Project requests",
    description: "Custom application, CRM, portal, and automation requests.",
    countLabel: countLabel(count),
    items: (data ?? []).map((request) => ({
      title: request.company_name,
      meta: `${request.project_type} - ${request.contact_email} - ${formatDate(request.created_at)}`,
      status: request.status
    }))
  };
}

async function getTalentApplicationsSection(): Promise<AdminDashboardSection> {
  const supabase = getSupabaseAdminClient();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from("talent_applications").select("id", { count: "exact", head: true }),
    supabase
      .from("talent_applications")
      .select("full_name, email, role_interest, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  if (countError || error) {
    return sectionError("Talent applications", "Talent pool applications and screening queue.", countError?.message ?? error?.message ?? "Unable to load talent applications.");
  }

  return {
    title: "Talent applications",
    description: "Talent pool applications and screening queue.",
    countLabel: countLabel(count),
    items: (data ?? []).map((application) => ({
      title: application.full_name,
      meta: `${application.role_interest} - ${application.email} - ${formatDate(application.created_at)}`,
      status: application.status
    }))
  };
}

async function getSeoAgentSection(): Promise<AdminDashboardSection> {
  const supabase = getSupabaseAdminClient();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from("seo_issues").select("id", { count: "exact", head: true }),
    supabase
      .from("seo_issues")
      .select("page_url, issue_type, severity, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  if (countError || error) {
    return sectionError("SEO Agent", "SEO audit issues and recommendations.", countError?.message ?? error?.message ?? "Unable to load SEO Agent data.", "/admin/seo");
  }

  return {
    title: "SEO Agent",
    description: "SEO audit issues and recommendations.",
    href: "/admin/seo",
    countLabel: countLabel(count),
    items: (data ?? []).map((issue) => ({
      title: issue.issue_type,
      meta: `${issue.page_url} - ${issue.severity} - ${formatDate(issue.created_at)}`,
      status: issue.status
    }))
  };
}

async function getWebsiteAlertsSection(): Promise<AdminDashboardSection> {
  const supabase = getSupabaseAdminClient();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    supabase.from("website_alerts").select("id", { count: "exact", head: true }),
    supabase
      .from("website_alerts")
      .select("alert_type, message, severity, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  if (countError || error) {
    return sectionError("Website alerts", "Technical, email, API, and security alert queue.", countError?.message ?? error?.message ?? "Unable to load website alerts.");
  }

  return {
    title: "Website alerts",
    description: "Technical, email, API, and security alert queue.",
    countLabel: countLabel(count),
    items: (data ?? []).map((alert) => ({
      title: alert.alert_type,
      meta: `${alert.severity} - ${alert.message} - ${formatDate(alert.created_at)}`,
      status: alert.status
    }))
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const adminConfig = getSupabaseAdminConfig();
  const settings = [
    { label: "NEXT_PUBLIC_SUPABASE_URL", isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { label: "NEXT_PUBLIC_SUPABASE_ANON_KEY", isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
    { label: "SUPABASE_SERVICE_ROLE_KEY", isConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
    { label: "ADMIN_EMAIL", isConfigured: Boolean(process.env.ADMIN_EMAIL) }
  ];

  if (!adminConfig.isConfigured) {
    return {
      isConfigured: false,
      setupMessage:
        "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to load admin dashboard records.",
      settings,
      sections: [
        emptySection("Leads", "Latest captured sales and contact leads."),
        emptySection("Client intakes", "Structured BPO and operations intake submissions."),
        emptySection("Project requests", "Custom application, CRM, portal, and automation requests."),
        emptySection("Talent applications", "Talent pool applications and screening queue."),
        emptySection("SEO Agent", "SEO audit issues and recommendations.", "/admin/seo"),
        emptySection("Website alerts", "Technical, email, API, and security alert queue.")
      ]
    };
  }

  const sections = await Promise.all([
    getLeadsSection(),
    getClientIntakesSection(),
    getProjectRequestsSection(),
    getTalentApplicationsSection(),
    getSeoAgentSection(),
    getWebsiteAlertsSection()
  ]);

  return {
    isConfigured: true,
    sections,
    settings
  };
}
