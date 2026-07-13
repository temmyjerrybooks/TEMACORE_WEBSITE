import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Download, FileText, Mail, Presentation, UsersRound } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { requireAdminSession } from "@/lib/admin/session";
import { getWhitepaperDashboardData } from "@/lib/whitepaper/dashboard-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Whitepaper Analytics",
  description: "Protected Temacore whitepaper analytics.",
  path: "/admin/whitepaper",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default async function WhitepaperAnalyticsPage() {
  await requireAdminSession();
  const dashboard = await getWhitepaperDashboardData();
  const hasActivity = Object.values(dashboard.counts).some((count) => count > 0) || dashboard.recentEvents.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Protected admin"
        title="Whitepaper analytics."
        body="Review privacy-conscious, anonymous engagement events from the Temacore Connected Operations Intelligence whitepaper."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="space-y-8">
          <div className="flex flex-col gap-4 rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue001/10 text-blue001">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-2xl font-black text-ink">Whitepaper activity</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Analytics records event types and anonymous session progress only. It does not store full IP addresses or browser fingerprints.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001"
            >
              Back to Admin
            </Link>
          </div>

          {dashboard.setupMessage ? (
            <div className="rounded-lg border border-warm/30 bg-warm/10 p-5 text-sm font-semibold leading-6 text-ink">
              {dashboard.setupMessage}
            </div>
          ) : null}

          {dashboard.isConfigured && !hasActivity ? (
            <div className="rounded-lg border border-line bg-white p-6 text-sm font-semibold text-slate-600">
              No whitepaper activity has been recorded yet.
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard icon={UsersRound} label="Total whitepaper opens" value={dashboard.counts.opens} showValue={dashboard.isConfigured} />
            <MetricCard icon={Presentation} label="Reading sessions started" value={dashboard.counts.starts} showValue={dashboard.isConfigured} />
            <MetricCard icon={BarChart3} label="Halfway reached" value={dashboard.counts.halfway} showValue={dashboard.isConfigured} />
            <MetricCard icon={FileText} label="Completed readings" value={dashboard.counts.completions} showValue={dashboard.isConfigured} />
            <MetricCard icon={Download} label="PDF downloads" value={dashboard.counts.downloads} showValue={dashboard.isConfigured} />
            <MetricCard icon={Mail} label="Contact clicks" value={dashboard.counts.contactClicks} showValue={dashboard.isConfigured} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InsightCard label="Most frequently reached page" value={dashboard.mostFrequentlyReachedPage ? `Page ${dashboard.mostFrequentlyReachedPage}` : dashboard.isConfigured ? "No page activity yet" : "Unavailable"} />
            <InsightCard label="Average furthest page" value={dashboard.averageFurthestPage ? `Page ${dashboard.averageFurthestPage}` : dashboard.isConfigured ? "No page activity yet" : "Unavailable"} />
          </div>

          <div className="rounded-lg border border-line bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue002" aria-hidden="true" />
              <div>
                <h2 className="text-xl font-black text-ink">Recent anonymous sessions</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Recent event activity without personal identifiers.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {dashboard.recentEvents.length > 0 ? (
                dashboard.recentEvents.map((event) => (
                  <div key={event.id} className="rounded-md bg-paper p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-black text-ink">{event.event_name.replaceAll("_", " ")}</p>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue002">
                        {event.page_number ? `Page ${event.page_number}` : "Whitepaper"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-600">
                      Session {event.session_id.slice(0, 8)} &middot; {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(event.created_at))}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-paper p-4 text-sm font-semibold text-slate-600">
                  No whitepaper activity has been recorded yet.
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  showValue
}: {
  icon: typeof Presentation;
  label: string;
  value: number;
  showValue: boolean;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-6">
      <Icon className="h-6 w-6 text-blue002" aria-hidden="true" />
      <p className="mt-5 text-3xl font-black text-ink">{showValue ? value : "Unavailable"}</p>
      <p className="mt-2 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function InsightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-black text-ink">{value}</p>
    </div>
  );
}
