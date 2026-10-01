import { getDatabaseConfig } from "@/lib/db/config";
import { getDatabase } from "@/lib/db/postgres";

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
    countLabel: "Unavailable",
    items: []
  };
}

function countLabel(count: number | null) {
  return `${count ?? 0} ${count === 1 ? "record" : "records"}`;
}

async function getLeadsSection(): Promise<AdminDashboardSection> {
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("leads", { head: true }),
    database.select("leads", { orderBy: "created_at", ascending: false, limit: 5 })
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
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("client_intakes", { head: true }),
    database.select("client_intakes", { orderBy: "created_at", ascending: false, limit: 5 })
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
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("project_requests", { head: true }),
    database.select("project_requests", { orderBy: "created_at", ascending: false, limit: 5 })
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
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("talent_applications", { head: true }),
    database.select("talent_applications", { orderBy: "created_at", ascending: false, limit: 5 })
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
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("seo_issues", { head: true }),
    database.select("seo_issues", { orderBy: "created_at", ascending: false, limit: 5 })
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
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("website_alerts", { head: true }),
    database.select("website_alerts", { orderBy: "created_at", ascending: false, limit: 5 })
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

async function getInvestorPresentationSection(): Promise<AdminDashboardSection> {
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("investor_deck_events", { head: true }),
    database.select("investor_deck_events", { orderBy: "created_at", ascending: false, limit: 5 })
  ]);

  if (countError || error) {
    return sectionError(
      "Investor presentation",
      "Anonymous investor deck engagement activity.",
      countError?.message ?? error?.message ?? "Unable to load investor presentation activity.",
      "/admin/investors"
    );
  }

  return {
    title: "Investor presentation",
    description: "Anonymous investor deck engagement activity.",
    href: "/admin/investors",
    countLabel: countLabel(count),
    items: (data ?? []).map((event) => ({
      title: event.event_name.replaceAll("_", " "),
      meta: `${event.slide_number ? `Slide ${event.slide_number} - ` : ""}${formatDate(event.created_at)}`
    }))
  };
}

async function getWhitepaperSection(): Promise<AdminDashboardSection> {
  const database = getDatabase();
  const [{ count, error: countError }, { data, error }] = await Promise.all([
    database.select("whitepaper_events", { head: true }),
    database.select("whitepaper_events", { orderBy: "created_at", ascending: false, limit: 5 })
  ]);

  if (countError || error) {
    return sectionError(
      "Whitepaper",
      "Anonymous whitepaper reading activity.",
      countError?.message ?? error?.message ?? "Unable to load whitepaper activity.",
      "/admin/whitepaper"
    );
  }

  return {
    title: "Whitepaper",
    description: "Anonymous whitepaper reading activity.",
    href: "/admin/whitepaper",
    countLabel: countLabel(count),
    items: (data ?? []).map((event) => ({
      title: event.event_name.replaceAll("_", " "),
      meta: `${event.page_number ? `Page ${event.page_number} - ` : ""}${formatDate(event.created_at)}`
    }))
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const adminConfig = getDatabaseConfig();
  const settings = [
    { label: "Admin authentication connection", isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { label: "Browser auth key", isConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
    { label: "PostgreSQL data connection", isConfigured: adminConfig.isConfigured },
    { label: "Admin identity", isConfigured: Boolean(process.env.ADMIN_EMAIL) }
  ];

  if (!adminConfig.isConfigured) {
    return {
      isConfigured: false,
      setupMessage:
        "Admin data access is not fully configured for this environment.",
      settings,
      sections: [
        emptySection("Leads", "Latest captured sales and contact leads."),
        emptySection("Client intakes", "Structured BPO and operations intake submissions."),
        emptySection("Project requests", "Custom application, CRM, portal, and automation requests."),
        emptySection("Talent applications", "Talent pool applications and screening queue."),
        emptySection("SEO Agent", "SEO audit issues and recommendations.", "/admin/seo"),
        emptySection("Investor presentation", "Anonymous investor deck engagement activity.", "/admin/investors"),
        {
          title: "Whitepaper",
          description: "Anonymous whitepaper reading activity.",
          href: "/admin/whitepaper",
          countLabel: "Unavailable",
          items: []
        },
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
    getInvestorPresentationSection(),
    getWhitepaperSection(),
    getWebsiteAlertsSection()
  ]);

  return {
    isConfigured: true,
    sections,
    settings
  };
}
