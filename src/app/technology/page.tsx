import type { Metadata } from "next";
import { CTASection } from "@/components/sections/home-sections";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { technologySolutions } from "@/lib/data";
import { routes } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Technology Solutions",
  description:
    "Temacore builds client portals, CRM systems, workflow dashboards, and automation tools for business operations."
};

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Technology solutions"
        title="Software built around the way your business actually operates."
        body="Temacore develops practical business applications, portals, CRM systems, dashboards, and automation tools that support real teams and recurring workflows."
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
