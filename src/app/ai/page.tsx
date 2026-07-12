import type { Metadata } from "next";
import {
  Bot,
  ChartNoAxesColumnIncreasing,
  FileCheck2,
  Headphones,
  ShieldCheck,
  UsersRound,
  Workflow
} from "lucide-react";
import { CTASection } from "@/components/sections/home-sections";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { routes } from "@/lib/navigation";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo-schema";

const description =
  "Learn how Temacore is building AI-assisted workflow intelligence to support BPO operations, insurance technology, and custom business applications with human review.";

export const metadata: Metadata = buildMetadata({
  title: "AI Workflow Intelligence",
  description,
  path: routes.ai
});

export default function AiPage() {
  const jsonLd = [
    webPageSchema({
      name: "AI Workflow Intelligence | Temacore",
      description,
      path: routes.ai
    }),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "AI Workflow Intelligence", url: absoluteUrl(routes.ai) }
    ])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="AI workflow intelligence"
        title="AI-assisted workflow intelligence with people accountable for the decisions."
        body="Temacore is building an AI intelligence layer intended to support BPO services, insurance platforms, and custom applications. The direction is practical: help teams review information, improve workflow visibility, and act with stronger context."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.projectRequest} variant="light">
            Discuss an AI Workflow
          </ButtonLink>
          <ButtonLink
            href={routes.insurtech}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Explore Insurance Technology
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="AI across the ecosystem"
            title="An intelligence layer intended to support the work, not replace accountable people."
            body="Temacore is developing AI-assisted capabilities that can help teams organize information, surface relevant context, and support repeatable workflows across operations, insurance, and business applications."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <InfoCard
              icon={FileCheck2}
              title="AI for Insurance"
              body="Temacore is building AI-assisted models intended to help with document classification, data extraction, application review support, policy workflows, quote preparation, claims triage, customer service, and reporting insight."
              href={routes.insurtech}
            />
            <InfoCard
              icon={Workflow}
              title="AI for BPO Operations"
              body="AI-assisted workflows may help with ticket classification, workflow routing, quality-assurance support, knowledge assistance, escalation detection, and performance reporting."
              href={`${routes.services}/business-process-outsourcing`}
            />
            <InfoCard
              icon={Headphones}
              title="AI for Customer Support"
              body="Support teams may use conversation summarization, customer-intent detection, suggested responses, and contextual knowledge assistance to prepare for human review and follow-through."
              href={`${routes.services}/customer-support`}
            />
            <InfoCard
              icon={ChartNoAxesColumnIncreasing}
              title="AI for Business Applications"
              body="AI-assisted CRM support, workflow automation, document processing, reporting dashboards, internal knowledge assistance, and operational recommendations can be designed into business applications."
              href={`${routes.services}/custom-application-development`}
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Human oversight"
            title="AI-assisted decision support with human review."
            body="Temacore's AI direction is designed to keep decisions reviewable, role-aware, and accountable to the people responsible for the workflow."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={UsersRound}
              title="Human-in-the-loop"
              body="People remain involved in reviewing outputs, handling exceptions, and making decisions that require judgment."
            />
            <InfoCard
              icon={FileCheck2}
              title="Reviewable"
              body="AI assistance is intended to make relevant information easier to inspect rather than conceal how a recommendation was reached."
            />
            <InfoCard
              icon={ShieldCheck}
              title="Role-aware"
              body="Workflow support can be shaped around the responsibilities and access needs of the people using the system."
            />
            <InfoCard
              icon={Bot}
              title="Decision support"
              body="The aim is to support accountable decision-makers with context and recommendations, not to make final regulated decisions automatically."
            />
          </div>
        </Container>
      </section>

      <CTASection
        title="Want to explore an AI-assisted workflow?"
        body="Share the process, information sources, and review points involved. Temacore can help assess where AI-assisted workflow intelligence may support a practical operating model."
        primaryHref={routes.projectRequest}
        primaryLabel="Submit Project Request"
        secondaryHref={routes.contact}
        secondaryLabel="Talk to Temacore"
      />
    </>
  );
}
