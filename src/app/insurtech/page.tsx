import type { Metadata } from "next";
import {
  Bot,
  FileText,
  HeartPulse,
  Route,
  ShieldCheck,
  UsersRound
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

const pageDescription =
  "Temacore has developed technology platforms for life insurance and general insurance operations, with AI-assisted workflow intelligence in development.";

export const metadata: Metadata = buildMetadata({
  title: "Insurance Technology Platforms",
  description: pageDescription,
  path: routes.insurtech
});

const lifeInsuranceWorkflows = [
  "Customer onboarding and insurance applications",
  "Policy workflow support and customer records",
  "Agent and administrator operations",
  "Document handling, payment and renewal workflow support",
  "Reporting and operational visibility"
];

const generalInsuranceWorkflows = [
  "General and business insurance operations",
  "Quote and submission workflow support",
  "Customer and policy records",
  "Claims workflow support",
  "Agent and administrator operations, document management, and reporting"
];

const aiSupportAreas = [
  {
    title: "Document and workflow support",
    body: "Temacore is building AI-assisted support for document processing, workflow routing, application review support, and claims triage support.",
    icon: FileText
  },
  {
    title: "Customer operations support",
    body: "The developing intelligence layer is intended to assist customer support and surface relevant workflow context for teams.",
    icon: UsersRound
  },
  {
    title: "Reporting and recommendations",
    body: "AI-assisted reporting and operational recommendations are being developed to help accountable teams review workload and workflow signals.",
    icon: Bot
  }
];

export default function InsurtechPage() {
  const jsonLd = [
    webPageSchema({
      name: "Temacore Insurance Technology",
      description: pageDescription,
      path: routes.insurtech
    }),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "Insurance Technology", url: absoluteUrl(routes.insurtech) }
    ])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Insurance technology"
        title="Technology platforms for insurance operations."
        body="Temacore has developed technology platforms for life insurance and general insurance operations. They are designed to support clearer workflows, records, documents, and operational visibility while exact implementation is scoped to the organization and use case."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={routes.projectRequest} variant="light">
            Discuss an Insurance Project
          </ButtonLink>
          <ButtonLink
            href={routes.contact}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Talk to Temacore
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
            eyebrow="Insurance technology overview"
            title="A connected foundation for life and general insurance operations."
            body="The platforms are intended to bring customer records, insurance workflows, documents, operations teams, and reporting into clearer working systems. Specific capabilities and deployment status are validated for each engagement."
            align="center"
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <InfoCard
              icon={HeartPulse}
              title="Life Insurance Platform"
              body="Designed to support digital insurance workflows across onboarding, applications, policy administration support, agent and administrator operations, document handling, payment and renewal workflows, and reporting."
            />
            <InfoCard
              icon={ShieldCheck}
              title="General Insurance Platform"
              body="Designed to support general and business insurance workflows across quote and submission processes, customer and policy records, claims workflow support, role-aware operations, document management, and reporting."
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Life insurance"
              title="Workflow support that keeps people and records connected."
              body="Temacore has developed the life insurance platform to support operational workflows at a responsible, high level. The final scope depends on the organization, roles, and operating requirements."
            />
            <div className="mt-8 grid gap-3">
              {lifeInsuranceWorkflows.map((workflow) => (
                <div key={workflow} className="flex items-center gap-3 rounded-md border border-line bg-white p-4">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue002" />
                  <span className="text-sm font-bold text-ink">{workflow}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="General insurance"
              title="Operational support for general and business insurance workflows."
              body="Temacore has developed the general insurance platform to support structured operations and visibility. It is not presented as a claim that every workflow area is production-live for every use case."
            />
            <div className="mt-8 grid gap-3">
              {generalInsuranceWorkflows.map((workflow) => (
                <div key={workflow} className="flex items-center gap-3 rounded-md border border-line bg-white p-4">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue002" />
                  <span className="text-sm font-bold text-ink">{workflow}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="AI-assisted insurance operations"
            title="Workflow intelligence with human review."
            body="Temacore is building AI-assisted systems intended to support insurance operations. The direction is human-in-the-loop: AI-assisted decision support with human review for regulated decisions."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {aiSupportAreas.map((area) => (
              <InfoCard key={area.title} icon={area.icon} title={area.title} body={area.body} />
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-6 text-slate-600">
            Temacore does not present its developing AI as making final underwriting, pricing, claim approval, or claim rejection decisions.
          </p>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Connected ecosystem"
            title="Insurance technology is one part of the Temacore operating ecosystem."
            body="Explore how the insurance platforms connect with broader operations, business technology, and developing AI workflow intelligence."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoCard
              href={routes.platforms}
              icon={Route}
              title="Platform Ecosystem"
              body="See how managed operations, software platforms, insurance technology, and workflow intelligence are designed to work together."
            />
            <InfoCard
              href={routes.ai}
              icon={Bot}
              title="AI Workflow Intelligence"
              body="Learn about Temacore's developing, human-in-the-loop AI direction for operational and insurance workflows."
            />
            <InfoCard
              href={routes.technology}
              icon={FileText}
              title="Technology Solutions"
              body="Explore custom applications, client portals, CRM systems, dashboards, and workflow automation."
            />
          </div>
        </Container>
      </section>

      <CTASection
        title="Exploring an insurance technology workflow?"
        body="Share the operational context, workflow, or system need. Temacore can help clarify the right next step for a responsible implementation discussion."
        primaryHref={routes.projectRequest}
        primaryLabel="Submit Project Request"
        secondaryHref={routes.contact}
        secondaryLabel="Talk to Temacore"
      />
    </>
  );
}
