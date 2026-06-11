import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getSupabaseAuthConfig } from "@/lib/admin/config";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Login",
  description: "Secure Temacore admin login.",
  path: "/admin/login",
  noIndex: true
});

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const authConfig = getSupabaseAuthConfig();

  return (
    <>
      <PageHero
        eyebrow="Admin access"
        title="Secure operator access."
        body="This area is reserved for authorized Temacore operators."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-line bg-white p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-blue001 text-white">
              <LockKeyhole className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-black text-ink">Restricted workspace</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Use assigned credentials only. Access attempts may be reviewed for security.
            </p>
            {!authConfig.isConfigured ? (
              <div className="mt-6 rounded-md bg-warm/10 p-4 text-sm font-semibold leading-6 text-ink">
                Admin access is temporarily unavailable in this environment.
              </div>
            ) : null}
          </div>
          <LoginForm isConfigured={authConfig.isConfigured} />
        </Container>
      </section>
    </>
  );
}
