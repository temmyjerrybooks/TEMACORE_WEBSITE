import type { Metadata } from "next";
import { CTASection } from "@/components/sections/home-sections";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { technologySolutions } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Enterprise Software & AI-Ready Workflow Systems",
  description:
    "Enterprise applications, portals, CRM, mobile software, and business process automation: the system foundation for validated enterprise AI workflows.",
  path: "/technology"
});

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology solutions"
        title="Software built around the way your business actually operates."
        body="Temacore builds enterprise applications, portals, APIs, CRM systems, and dashboards around real workflows. Structured data, integrations, and role-based controls establish the foundation for automation and AI assistance where appropriate; AI scope is agreed and validated for each project."
      />
      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Solutions"
            title="From internal tools to client-facing systems."
            body="The goal is not software for its own sake. The goal is better visibility, fewer manual handoffs, cleaner records, and faster decisions."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {technologySolutions.map((solution) => (
              <InfoCard key={solution.title} icon={solution.icon} title={solution.title} body={solution.body} />
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.insurtech} variant="outline">
              Explore Insurance Technology
            </ButtonLink>
            <ButtonLink href={routes.ai} variant="outline">
              AI Workflow Intelligence
            </ButtonLink>
          </div>
        </Container>
      </section>
      <CTASection
        title="Have a portal, CRM, dashboard, or automation idea?"
        body="Send the project context and Temacore will help shape the workflow, data model, permissions, and delivery plan."
        primaryHref={routes.projectRequest}
        primaryLabel="Submit Project Request"
        secondaryHref={routes.contact}
        secondaryLabel="Talk to Temacore"
      />
    </>
  );
}
