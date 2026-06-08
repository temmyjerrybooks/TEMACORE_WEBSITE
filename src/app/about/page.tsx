import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/sections/home-sections";
import { site, whyTemacore } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Temacore",
  description:
    "Learn how Temacore combines global remote operations, outsourcing systems, and business technology for companies in North America, the UK, and Europe."
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Temacore"
        title="A global operations and technology partner built for modern business execution."
        body={`${site.name} is a ${site.legalDescriptor}. We help companies build dependable operating capacity with remote teams, outsourcing workflows, business applications, and automation.`}
      />

      <section className="bg-white py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Operating philosophy"
            title="Temacore exists for the work between strategy and delivery."
            body="Many companies know what needs to improve, but lack the team capacity, process structure, or internal tools to make the work run consistently. Temacore fills that gap with managed operations and practical technology."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              "US-registered for international client confidence",
              "Built for remote execution across distributed teams",
              "Focused on measurable operating outcomes",
              "Structured for future secure data and admin workflows"
            ].map((item) => (
              <div key={item} className="rounded-lg border border-line bg-paper p-6">
                <p className="text-lg font-black text-ink">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Principles"
            title="Premium delivery is built from clarity, accountability, and visibility."
            body="Temacore engagements are designed so clients understand who owns the work, how quality is checked, what tools are used, and how progress is reported."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {whyTemacore.map((item) => (
              <InfoCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
