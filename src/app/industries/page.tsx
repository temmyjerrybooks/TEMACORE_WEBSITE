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
    "Temacore supports professional services, SaaS, healthcare support, real estate, ecommerce, finance, and other service-heavy industries.",
  path: "/industries"
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Operational support for companies where follow-through matters."
        body="Temacore works across service-heavy industries that depend on accurate records, timely follow-up, customer support, and repeatable back-office execution."
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
