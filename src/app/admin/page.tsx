import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BriefcaseBusiness,
  ClipboardList,
  Contact,
  FileText,
  Presentation,
  SearchCheck,
  Settings,
  ShieldCheck,
  UserRoundCheck
} from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAdminDashboardData, type AdminDashboardSection } from "@/lib/admin/dashboard-data";
import { requireAdminSession } from "@/lib/admin/session";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "Protected Temacore admin dashboard placeholder.",
  path: "/admin",
  noIndex: true
});

const sectionIcons = {
  Leads: Contact,
  "Client intakes": ClipboardList,
  "Project requests": BriefcaseBusiness,
  "Talent applications": UserRoundCheck,
  "SEO Agent": SearchCheck,
  "Investor presentation": Presentation,
  "Website alerts": AlertTriangle
};

export default async function AdminPage() {
  await requireAdminSession();
  const dashboard = await getAdminDashboardData();

  return (
    <>
      <PageHero
        eyebrow="Protected admin"
        title="Temacore admin dashboard."
        body="Review leads, intake submissions, project requests, talent applications, SEO readiness, website alerts, and admin settings from one protected surface."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="space-y-8">
          <div className="rounded-lg border border-line bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-blue001 text-white">
                  <ShieldCheck className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-black text-ink">Signed in</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                  Admin records are loaded in a restricted workspace for authorized operators.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:items-center">
                <Link
                  href="/admin/seo"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue001 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue002"
                >
                  <SearchCheck className="h-4 w-4" aria-hidden="true" />
                  SEO Agent
                </Link>
                <LogoutButton />
              </div>
            </div>
          </div>

          {!dashboard.isConfigured ? (
            <div className="rounded-lg border border-warm/30 bg-warm/10 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-warm" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-ink">{dashboard.setupMessage}</p>
              </div>
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.sections.map((section) => (
              <DashboardSectionCard key={section.title} section={section} />
            ))}
          </div>

          <div className="rounded-lg border border-line bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue001/10 text-blue001">
                <Settings className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-black text-ink">Settings</h2>
                <p className="text-sm text-slate-600">Operational readiness checks without exposing secret values.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {dashboard.settings.map((setting) => (
                <div key={setting.label} className="flex items-center justify-between rounded-md bg-paper p-4">
                  <span className="text-sm font-bold text-ink">{setting.label}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${
                      setting.isConfigured ? "bg-signal/10 text-signal" : "bg-warm/10 text-warm"
                    }`}
                  >
                    {setting.isConfigured ? "Set" : "Missing"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function DashboardSectionCard({ section }: { section: AdminDashboardSection }) {
  const Icon = sectionIcons[section.title as keyof typeof sectionIcons] ?? FileText;

  return (
    <div className="rounded-lg border border-line bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue001/10 text-blue001">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="rounded-full bg-paper px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-blue001">
          {section.countLabel}
        </span>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-ink">{section.title}</h2>
          {section.href ? (
            <Link href={section.href} className="text-sm font-bold text-blue001 hover:text-blue002">
              Open
            </Link>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">{section.description}</p>
      </div>

      {section.error ? (
        <p className="mt-5 rounded-md bg-warm/10 px-4 py-3 text-sm font-semibold leading-6 text-ink">
          {section.error}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3">
        {section.items.length > 0 ? (
          section.items.map((item) => (
            <div key={`${section.title}-${item.title}-${item.meta}`} className="rounded-md bg-paper p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-sm font-black text-ink">{item.title}</p>
                {item.status ? (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-blue001">
                    {item.status}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{item.meta}</p>
            </div>
          ))
        ) : (
          <p className="rounded-md bg-paper px-4 py-3 text-sm font-semibold text-slate-600">
            No records to show yet.
          </p>
        )}
      </div>
    </div>
  );
}
