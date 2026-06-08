import type { Metadata } from "next";
import { ProjectRequestForm } from "@/components/forms/project-request-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Project Request Form",
  description:
    "Request a Temacore client portal, CRM system, workflow dashboard, automation tool, or custom business application."
};

export default function ProjectRequestPage() {
  return (
    <>
      <PageHero
        eyebrow="Project request"
        title="Scope a portal, CRM, dashboard, automation, or custom application."
        body="Send the business context, workflow, users, timeline, and requirements. Temacore will shape it into a practical technology plan."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading
            eyebrow="Technology scoping"
            title="Built for future project status tracking and admin review."
            body="Project requests are structured around project type, requirements, budget range, timeline, and status fields."
          />
          <ProjectRequestForm />
        </Container>
      </section>
    </>
  );
}
