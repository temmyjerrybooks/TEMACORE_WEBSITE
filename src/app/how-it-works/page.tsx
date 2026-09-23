import { AiFlywheel } from "@/components/sections/ai-flywheel";
import type { Metadata } from "next";
import { CTASection, HowItWorksSection } from "@/components/sections/home-sections";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "See how Temacore scopes workflows, designs operating models, deploys remote teams, and optimizes business operations.",
  path: "/how-it-works"
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="A clear path from workflow pressure to managed execution."
        body="Temacore engagements begin with practical discovery, then move into operating design, team setup, managed delivery, and optimization."
      />
      <HowItWorksSection />
      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Engagement models"
            title="Start with the model that matches the work."
            body="Temacore can support a narrow workflow, a dedicated team, or a technology build. The model can combine as the operation matures."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Managed workflow",
                body: "A repeatable process such as ticket triage, CRM cleanup, data entry, or lead follow-up."
              },
              {
                title: "Dedicated remote team",
                body: "A staffed team with roles, schedule, supervision, reporting, and performance accountability."
              },
              {
                title: "Technology build",
                body: "A custom portal, CRM, dashboard, or automation system that supports the operating model."
              }
            ].map((model) => (
              <div key={model.title} className="rounded-lg border border-line bg-paper p-6">
                <h2 className="text-xl font-black text-ink">{model.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{model.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <AiFlywheel />

      <CTASection />
    </>
  );
}
