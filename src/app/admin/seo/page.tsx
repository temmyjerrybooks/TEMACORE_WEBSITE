import type { Metadata } from "next";
import { Children, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  FileSearch,
  Gauge,
  Link2,
  ListChecks,
  Rss,
  ShieldCheck
} from "lucide-react";
import { RunSeoAuditButton } from "@/components/admin/run-seo-audit-button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { requireAdminSession } from "@/lib/admin/session";
import { getSeoAgentDashboardData } from "@/lib/seo-agent/dashboard-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SEO Agent",
  description: "Protected Temacore SEO Agent dashboard.",
  path: "/admin/seo",
  noIndex: true
});

export const dynamic = "force-dynamic";

const statusIcons = {
  Sitemap: Rss,
  "Robots.txt": ShieldCheck,
  "llms.txt": Bot,
  Metadata: FileSearch,
  "Structured Data": ListChecks,
  "Broken Links": Link2,
  "Basic Response Performance": Gauge
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Awaiting First Audit";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function SeoAgentPage() {
  await requireAdminSession();
  const dashboard = await getSeoAgentDashboardData();
  const hasAudit = Boolean(dashboard.latestAudit);

  return (
    <>
      <PageHero
        eyebrow="Protected admin"
        title="SEO Agent dashboard."
        body="Run internal SEO checks for sitemap health, robots.txt, llms.txt, metadata, structured data, internal links, image alt text, and basic response performance."
      />

      <section className="bg-paper py-20 md:py-24">
        <Container className="space-y-8">
          <div className="rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue002">
                  SEO Agent
                </p>
                <h2 className="mt-3 text-3xl font-black text-ink">Audit and recommendation dashboard</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  The SEO Agent foundation is configured. Live audit results will appear here after the first crawler/audit job is connected and executed.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/admin"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001"
                >
                  Back to Admin
                </Link>
                <RunSeoAuditButton enabled={dashboard.runAuditEnabled} />
              </div>
            </div>
          </div>

          {dashboard.setupMessage ? (
            <div className="rounded-lg border border-warm/30 bg-warm/10 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-warm" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-ink">{dashboard.setupMessage}</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-4">
            <SummaryCard
              icon={BarChart3}
              tone="dark"
              value={hasAudit ? `${dashboard.latestAudit?.overall_score}/100` : "Awaiting First Audit"}
              label="Overall SEO health score"
            />
            <SummaryCard
              icon={FileSearch}
              value={hasAudit ? String(dashboard.latestAudit?.pages_checked ?? 0) : "Awaiting First Audit"}
              label="Pages checked"
            />
            <SummaryCard
              icon={AlertTriangle}
              value={hasAudit ? String(dashboard.latestAudit?.issues_found ?? 0) : "Awaiting First Audit"}
              label={hasAudit ? "Total issues found" : "No live audit has been run yet"}
            />
            <SummaryCard
              icon={CheckCircle2}
              value={formatDate(dashboard.latestAudit?.audit_date)}
              label="Latest audit date"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <SeverityCard label="Critical issues" value={dashboard.counts.critical} tone="critical" hasAudit={hasAudit} />
            <SeverityCard label="High issues" value={dashboard.counts.high} tone="high" hasAudit={hasAudit} />
            <SeverityCard label="Medium issues" value={dashboard.counts.medium} tone="medium" hasAudit={hasAudit} />
            <SeverityCard label="Low issues" value={dashboard.counts.low} tone="low" hasAudit={hasAudit} />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {dashboard.statusCards.map((card) => {
              const Icon = statusIcons[card.label as keyof typeof statusIcons] ?? FileSearch;

              return (
                <div key={card.label} className="rounded-lg border border-line bg-white p-5">
                  <Icon className="h-5 w-5 text-blue002" aria-hidden="true" />
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-lg font-black text-ink">{card.value}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <AdminPanel
              title="Latest issues"
              description="Real audit issues from the latest stored SEO audit."
              emptyText={hasAudit ? "No Issues Found Yet" : "Awaiting First Audit"}
            >
              {dashboard.latestIssues.map((issue) => (
                <AdminRow
                  key={issue.id}
                  title={issue.issue_type}
                  meta={`${issue.severity} - ${issue.status}`}
                  body={`${issue.page_url}: ${issue.issue_message}`}
                />
              ))}
            </AdminPanel>

            <AdminPanel
              title="Website alerts"
              description="High-priority SEO and website alerts stored for admin review."
              emptyText="No Issues Found Yet"
            >
              {dashboard.alerts.map((alert) => (
                <AdminRow
                  key={alert.id}
                  title={alert.alert_type}
                  meta={`${alert.severity} - ${alert.status}`}
                  body={alert.message}
                />
              ))}
            </AdminPanel>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <AdminPanel
              title="Site-based recommendations"
              description="Recommendations generated from site checks only, not Search Console or traffic data."
              emptyText={hasAudit ? "No Issues Found Yet" : "Awaiting First Audit"}
            >
              {dashboard.recommendations.map((item) => (
                <AdminRow
                  key={item.id}
                  title={item.title}
                  meta={`${item.recommendation_type} - ${item.status}`}
                  body={`${item.page_url}: ${item.description}`}
                />
              ))}
            </AdminPanel>

            <AdminPanel
              title="Keyword opportunities"
              description="Site-based opportunities only. No search volume, rankings, clicks, or impressions are inferred."
              emptyText={hasAudit ? "No Issues Found Yet" : "Awaiting First Audit"}
            >
              {dashboard.keywordOpportunities.map((item) => (
                <AdminRow
                  key={item.id}
                  title={item.keyword}
                  meta={`${item.priority} - ${item.status}`}
                  body={`${item.target_page}: ${item.recommendation}`}
                />
              ))}
            </AdminPanel>
          </div>
        </Container>
      </section>
    </>
  );
}

function SummaryCard({
  icon: Icon,
  value,
  label,
  tone = "light"
}: {
  icon: typeof BarChart3;
  value: string;
  label: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={`rounded-lg p-6 ${tone === "dark" ? "bg-blue001 text-white" : "border border-line bg-white"}`}>
      <Icon className={`h-6 w-6 ${tone === "dark" ? "text-blue-100" : "text-blue002"}`} aria-hidden="true" />
      <p className={`mt-5 text-3xl font-black ${tone === "dark" ? "text-white" : "text-ink"}`}>{value}</p>
      <p className={`mt-2 text-sm ${tone === "dark" ? "text-blue-100/80" : "text-slate-600"}`}>{label}</p>
    </div>
  );
}

function SeverityCard({
  label,
  value,
  tone,
  hasAudit
}: {
  label: string;
  value: number;
  tone: "critical" | "high" | "medium" | "low";
  hasAudit: boolean;
}) {
  const toneClass = {
    critical: "bg-red-50 text-red-700",
    high: "bg-warm/10 text-warm",
    medium: "bg-blue001/10 text-blue001",
    low: "bg-signal/10 text-signal"
  }[tone];

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${toneClass}`}>
        {label}
      </span>
      <p className="mt-5 text-3xl font-black text-ink">{hasAudit ? value : "Awaiting First Audit"}</p>
    </div>
  );
}

function AdminPanel({
  title,
  description,
  emptyText,
  children
}: {
  title: string;
  description: string;
  emptyText: string;
  children: ReactNode;
}) {
  const childArray = Children.toArray(children);

  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5 grid gap-4">
        {childArray.length > 0 ? childArray : <p className="rounded-md bg-paper p-4 text-sm font-bold text-slate-600">{emptyText}</p>}
      </div>
    </div>
  );
}

function AdminRow({ title, meta, body }: { title: string; meta: string; body: string }) {
  return (
    <div className="rounded-md bg-paper p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-sm font-black text-ink">{title}</h3>
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue002">{meta}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
