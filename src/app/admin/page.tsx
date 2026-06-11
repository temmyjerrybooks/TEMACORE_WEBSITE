import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole, SearchCheck, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard",
  description: "Protected Temacore admin dashboard placeholder.",
  path: "/admin",
  noIndex: true
});

export default function AdminPage() {
  return (
    <>
      <PageHero
        eyebrow="Protected admin"
        title="Admin dashboard route prepared for secure access."
        body="This route is ready for a future authentication layer, Supabase role checks, lead review, intake management, project status tracking, and talent application screening."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container>
          <div className="rounded-lg border border-line bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-blue001 text-white">
                  <LockKeyhole className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-black text-ink">Authentication pending</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
                  Connect Supabase Auth, admin user roles, and row-level security before exposing operational records.
                </p>
              </div>
              <div className="rounded-lg bg-footer p-6 text-white md:min-w-80">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-signal" aria-hidden="true" />
                  <p className="text-sm font-bold">Future modules</p>
                </div>
                <ul className="mt-5 grid gap-3 text-sm text-blue-50/85">
                  <li>Lead status pipeline</li>
                  <li>Client intake queue</li>
                  <li>Project request review</li>
                  <li>Talent application screening</li>
                  <li>
                    <Link href="/admin/seo" className="inline-flex items-center gap-2 font-bold text-white hover:text-blue-100">
                      <SearchCheck className="h-4 w-4" aria-hidden="true" />
                      SEO Agent dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
