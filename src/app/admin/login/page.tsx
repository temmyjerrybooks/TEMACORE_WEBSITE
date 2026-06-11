import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAdminEmail, getSupabaseAuthConfig } from "@/lib/admin/config";
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
  const adminEmail = getAdminEmail();

  return (
    <>
      <PageHero
        eyebrow="Admin access"
        title="Sign in to the Temacore admin panel."
        body="Admin access is restricted to the email configured in the ADMIN_EMAIL environment variable."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-line bg-white p-6">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-md bg-blue001 text-white">
              <LockKeyhole className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-black text-ink">Protected admin route</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Public signup is disabled. Sign in with the Supabase Auth user that matches{" "}
              <span className="font-bold text-ink">{adminEmail}</span>.
            </p>
            {!authConfig.isConfigured ? (
              <div className="mt-6 rounded-md bg-warm/10 p-4 text-sm font-semibold leading-6 text-ink">
                Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before admin login can be used.
              </div>
            ) : null}
          </div>
          <LoginForm isConfigured={authConfig.isConfigured} adminEmail={adminEmail} />
        </Container>
      </section>
    </>
  );
}
