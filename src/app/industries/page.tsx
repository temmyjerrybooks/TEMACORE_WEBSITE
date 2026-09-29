import type { Metadata } from "next";
import { CTASection } from "@/components/sections/home-sections";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { industries } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Vertical AI for Insurance & Financial Operations",
  description:
    "Explore Temacore's insurance software foundation and developing AI direction for financial operations and complex business workflows, supported by managed operations.",
  path: "/industries"
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Shared AI architecture. Industry-specific workflows."
        body="Temacore builds for insurance, financial operations, and intelligent business operations. Insurance is our strongest current product base; financial operations and adjacent workflows are directions for the developing AI layer. Enterprise software and structured data provide the foundation, while BPO and managed operations support commercial execution and workflow insight."
      />
      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Coverage"
            title="Intelligent workflow infrastructure shaped around each industry."
            body="Each engagement is adapted to the client's tools, risk profile, regulatory expectations, and communication cadence."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <InfoCard
                key={industry.title}
                id={industry.title === "Financial Services / FinTech" ? "financial-operations" : undefined}
                icon={industry.icon}
                title={industry.title}
                body={industry.body}
                href={
                  industry.title === "Insurance / InsurTech"
                    ? routes.insurtech
                    : industry.title === "Financial Services / FinTech"
                      ? routes.ai
                      : industry.title === "BPO / Managed Operations"
                        ? `${routes.services}/business-process-outsourcing`
                        : undefined
                }
              />
            ))}
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
