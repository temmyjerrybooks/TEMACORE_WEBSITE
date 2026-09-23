import type { Metadata } from "next";
import { CTASection } from "@/components/sections/home-sections";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { industries } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description:
    "Temacore builds for insurance, financial services, and managed operations, with workflow architecture applicable across other complex industries.",
  path: "/industries"
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Shared AI architecture. Industry-specific workflows."
        body="Insurance, FinTech, and BPO are our strongest strategic verticals. The common foundation is enterprise software, structured data, and developing AI workflow intelligence, adapted to each industry and its human decision points."
      />
      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Coverage"
            title="Built for repeatable workflows, client operations, and distributed teams."
            body="Each engagement is adapted to the client's tools, risk profile, regulatory expectations, and communication cadence."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <InfoCard key={industry.title} icon={industry.icon} title={industry.title} body={industry.body} />
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
