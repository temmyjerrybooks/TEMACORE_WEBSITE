import { CapabilityStatus } from "@/components/sections/capability-status";
import type { Metadata } from "next";
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  FileCheck2,
  Layers3,
  ShieldCheck,
  UserRound
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
  "Temacore is an AI-first technology company building vertical AI, enterprise software, and intelligent workflow infrastructure for insurance, finance, and business operations.";

export const metadata: Metadata = buildMetadata({
  title: "Platforms",
  description,
  path: routes.platforms
});

export default function PlatformsPage() {
  const jsonLd = [
    webPageSchema({
      name: "Temacore Platforms",
      description,
      path: routes.platforms
    }),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "Platforms", url: absoluteUrl(routes.platforms) }
    ])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Platform ecosystem"
        title="The software foundation for reusable vertical AI."
        body="Temacore is building a shared AI architecture on enterprise software and workflow infrastructure. Life and General Insurance platforms are an initial product foundation, alongside managed operations and strategic FinTech opportunities."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={routes.projectRequest} variant="light">
            Discuss a Platform Project
          </ButtonLink>
          <ButtonLink
            href={routes.insurtech}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Explore Insurance Technology
          </ButtonLink>
          <ButtonLink
            href={routes.whitepaper}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Read Our Whitepaper
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Connected capabilities"
            title="One ecosystem, designed around the work that needs to get done."
            body="Each area can stand on its own or support the others: the operating team supplies context, software organizes the workflow, insurance platforms support specialist operations, and AI is being developed to help people review and improve the work."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              icon={BriefcaseBusiness}
              title="Managed Operations"
              body="Temacore provides BPO and remote operations support for customer service, back-office work, virtual assistance, CRM administration, and lead follow-up."
              href={`${routes.services}/business-process-outsourcing`}
            />
            <InfoCard
              icon={Code2}
              title="Custom Business Applications"
              body="Web and mobile applications, CRM systems, client portals, internal dashboards, workflow automation, and reporting systems can be shaped around the way a team works."
              href={routes.technology}
            />
            <InfoCard
              icon={FileCheck2}
              title="Life Insurance Technology"
              body="Temacore has developed a life insurance platform designed to support digital workflows, customer onboarding, policy administration support, agent and administrator operations, document handling, and reporting visibility."
              href={routes.insurtech}
            />
            <InfoCard
              icon={Layers3}
              title="General Insurance Technology"
              body="Temacore has developed a general insurance platform designed to support general and business insurance workflows, customer and policy records, quote and application workflow support, claims workflow support, role-based operations, and reporting visibility."
              href={routes.insurtech}
            />
            <InfoCard
              icon={Bot}
              title="AI Workflow Intelligence"
              body="Temacore is building AI-assisted systems for workflow intelligence, decision support, and operational recommendations with people reviewing accountable decisions."
              href={routes.ai}
            />
            <InfoCard
              icon={UserRound}
              title="FinTech Opportunity"
              body="Financial services share document volumes, manual review, disconnected systems, and administrative bottlenecks. Our architecture offers a direction for assistance and automation, subject to validation and human controls."
              href={routes.industries}
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="How the ecosystem connects"
            title="Better systems begin with a clearer view of the operation."
            body="Temacore can support a live workflow, build the software around it, and develop intelligence that helps the right people review information and act with context."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={BriefcaseBusiness}
              title="Start with the workflow"
              body="Managed service teams can support recurring customer, administrative, and CRM workflows while keeping roles, handoffs, and reporting visible."
              href={`${routes.services}/remote-teams`}
            />
            <InfoCard
              icon={ShieldCheck}
              title="Build the operating foundation"
              body="Custom portals, dashboards, and automation tools can give teams a more consistent place to manage records, tasks, permissions, and reporting."
              href={routes.technology}
            />
            <InfoCard
              icon={Bot}
              title="Add intelligence with oversight"
              body="AI-assisted workflow intelligence is being developed to help with review, routing, knowledge assistance, and recommendations while people remain responsible for decisions."
              href={routes.ai}
            />
          </div>
        </Container>
      </section>

      <CapabilityStatus />

      <CTASection
        title="Planning an operations, platform, or insurance technology initiative?"
        body="Share the workflow, systems, and outcomes you are working toward. Temacore can help identify the practical mix of operations support, software, and AI-assisted workflow intelligence."
        primaryHref={routes.projectRequest}
        primaryLabel="Submit Project Request"
        secondaryHref={routes.contact}
        secondaryLabel="Talk to Temacore"
      />
    </>
  );
}
