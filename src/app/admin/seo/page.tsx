import type { Metadata } from "next";
import type { ReactNode } from "react";
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
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { requireAdminSession } from "@/lib/admin/session";
import { buildMetadata } from "@/lib/seo";
import {
  mockContentRecommendations,
  mockKeywordOpportunities,
  mockSeoAgentSummary,
  mockSeoIssues,
  mockWebsiteAlerts
} from "@/lib/seo-agent/mock-data";

export const metadata: Metadata = buildMetadata({
  title: "SEO Agent",
  description: "Protected future SEO Agent dashboard for Temacore.",
  path: "/admin/seo",
  noIndex: true
});

const statusCards = [
  { label: "Sitemap", value: "Available", icon: Rss },
  { label: "Robots.txt", value: "Available", icon: ShieldCheck },
  { label: "llms.txt", value: "Available", icon: Bot },
  { label: "Structured data", value: "Added", icon: ListChecks },
  { label: "Metadata", value: "Configured", icon: FileSearch },
  { label: "Broken links", value: "Audit pending", icon: Link2 },
  { label: "Page speed", value: "Audit pending", icon: Gauge }
];

const aiReadinessChecklist = [
  "Public pages have crawlable metadata and canonical URLs",
  "Sitemap, robots.txt, and llms.txt are available",
  "Core service pages include structured service and FAQ content",
  "Admin route is prepared for future protected audits",
  "SEO Agent is recommendation-only and does not auto-publish content"
];

export default async function SeoAgentPage() {
  await requireAdminSession();

  return (
    <>
      <PageHero
        eyebrow="Protected admin"
        title="SEO Agent foundation."
        body="This protected future route is prepared to audit metadata, links, structured data, crawler files, content recommendations, AI-search readiness, and technical website alerts. It does not auto-publish content."
      />

      <section className="bg-paper py-20 md:py-24">
        <Container className="space-y-8">
          <div className="rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue002">
                  SEO Agent
                </p>
                <h2 className="mt-3 text-3xl font-black text-ink">Audit and recommendation dashboard</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  This module is structured as a protected admin surface for future Supabase-backed audits and alerts.
                </p>
              </div>
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001"
              >
                Back to Admin
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-lg bg-blue001 p-6 text-white md:col-span-1">
              <BarChart3 className="h-6 w-6 text-blue-100" aria-hidden="true" />
              <p className="mt-5 text-4xl font-black">{mockSeoAgentSummary.overallScore}</p>
              <p className="mt-2 text-sm text-blue-100/80">Overall SEO health score</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <FileSearch className="h-6 w-6 text-blue002" aria-hidden="true" />
              <p className="mt-5 text-3xl font-black text-ink">{mockSeoAgentSummary.pagesChecked}</p>
              <p className="mt-2 text-sm text-slate-600">Pages configured for audit</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <AlertTriangle className="h-6 w-6 text-warm" aria-hidden="true" />
              <p className="mt-5 text-3xl font-black text-ink">{mockSeoAgentSummary.issuesFound}</p>
              <p className="mt-2 text-sm text-slate-600">Issues queued for review</p>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <CheckCircle2 className="h-6 w-6 text-signal" aria-hidden="true" />
              <p className="mt-5 text-lg font-black text-ink">{mockSeoAgentSummary.aiSearchReadiness}</p>
              <p className="mt-2 text-sm text-slate-600">AI search readiness status</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-lg border border-line bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue002">
                Latest audit date
              </p>
              <p className="mt-3 text-2xl font-black text-ink">{mockSeoAgentSummary.latestAuditDate}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Connect scheduled checks after authentication and Supabase admin storage are active.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue002">
                AI search readiness checklist
              </p>
              <div className="mt-5 grid gap-3">
                {aiReadinessChecklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-md bg-paper p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                    <p className="text-sm font-semibold leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {statusCards.map((card) => {
              const Icon = card.icon;

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

          <div className="grid gap-8 lg:grid-cols-2">
            <AdminPanel title="Technical SEO Issues">
              {mockSeoIssues.map((issue) => (
                <AdminRow key={issue.id} title={issue.issue_type} meta={`${issue.page_url} - ${issue.severity}`} body={issue.issue_message} />
              ))}
            </AdminPanel>

            <AdminPanel title="Keyword Opportunities">
              {mockKeywordOpportunities.map((item) => (
                <AdminRow key={item.id} title={item.keyword} meta={`${item.target_page} - ${item.priority}`} body={item.recommendation} />
              ))}
            </AdminPanel>

            <AdminPanel title="Content Recommendations">
              {mockContentRecommendations.map((item) => (
                <AdminRow key={item.id} title={item.title} meta={item.page_url} body={item.description} />
              ))}
            </AdminPanel>

            <AdminPanel title="Website Alerts">
              {mockWebsiteAlerts.map((item) => (
                <AdminRow key={item.id} title={item.alert_type} meta={item.severity} body={item.message} />
              ))}
            </AdminPanel>
          </div>
        </Container>
      </section>
    </>
  );
}

function AdminPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
      <h2 className="text-xl font-black text-ink">{title}</h2>
      <div className="mt-5 grid gap-4">{children}</div>
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
