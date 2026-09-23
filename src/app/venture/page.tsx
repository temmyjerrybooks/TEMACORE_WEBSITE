import { AiFlywheel } from "@/components/sections/ai-flywheel";
import type { Metadata } from "next";
import { Bot, Code2, HeartPulse, Layers3, Presentation, ShieldCheck, UserRound, UsersRound } from "lucide-react";
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
  "Temacore is an AI-first technology company building vertical AI, enterprise software, and intelligent workflow infrastructure for insurance, finance, and business operations.";

export const metadata: Metadata = buildMetadata({
  title: "Venture Overview",
  description: pageDescription,
  path: routes.venture
});

const productAreas = [
  { title: "FinTech Opportunity", body: "A strategic vertical for applying workflow intelligence to document-heavy financial operations, customer support, and administrative review. Specific capabilities remain subject to development and validation.", icon: Layers3 },
  {
    title: "Managed BPO Services",
    body: "Temacore provides managed BPO services and remote operations support for recurring business workflows.",
    icon: UsersRound
  },
  {
    title: "Custom Applications",
    body: "Temacore provides custom business applications, portals, CRM systems, dashboards, and workflow automation.",
    icon: Code2
  },
  {
    title: "Life Insurance Technology",
    body: "Temacore has developed a platform designed to support life insurance operations and related workflows.",
    icon: HeartPulse
  },
  {
    title: "General Insurance Technology",
    body: "Temacore has developed a platform designed to support general and business insurance operations and related workflows.",
    icon: ShieldCheck
  },
  {
    title: "Developing AI Workflow Models",
    body: "Temacore is building human-in-the-loop AI-assisted workflow intelligence intended to support accountable teams.",
    icon: Bot
  }
];

export default function VenturePage() {
  const jsonLd = [
    webPageSchema({
      name: "Temacore Venture Overview",
      description: pageDescription,
      path: routes.venture
    }),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "Venture", url: absoluteUrl(routes.venture) }
    ])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Venture overview"
        title="Building vertical AI for complex industries."
        body="Temacore is an AI-first technology company combining enterprise software, operating expertise, and a developing intelligence layer. Insurance, financial services, and managed operations are strategic verticals for reusable workflow infrastructure."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href={routes.platforms} variant="light">
            Explore the Platform Ecosystem
          </ButtonLink>
          <ButtonLink
            href={routes.contact}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Contact Temacore
          </ButtonLink>
          <ButtonLink
            href={routes.whitepaper}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Connected Operations Intelligence
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="What Temacore is building"
            title="One connected operating ecosystem."
            body="Managed operations reveals the workflow; enterprise software structures the process and data; AI is being developed to support and automate repeatable work. Reusing validated patterns across industries is the long-term platform opportunity."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <InfoCard
              icon={Layers3}
              title="The problem"
              body="Businesses often manage operations, service teams, software systems, insurance workflows, and automation as disconnected functions."
            />
            <InfoCard
              icon={UsersRound}
              title="The solution"
              body="Temacore connects managed operations, custom software, insurance technology, and AI-assisted workflow intelligence around the work teams need to run."
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Products, services, and strategic opportunities"
            title="Built across delivery, systems, insurance, and intelligence."
            body="The ecosystem includes established operating and software services, developed insurance platforms, and an AI workflow layer that is currently in development."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {productAreas.map((area) => (
              <InfoCard key={area.title} icon={area.icon} title={area.title} body={area.body} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Strategic differentiation"
            title="An architecture that can grow across industries."
            body="Life and General Insurance platforms demonstrate the software foundation for the vertical AI thesis. BPO supplies operational insight and a deployment environment; FinTech offers adjacent workflows. The aim is reusable platforms and intelligence, with adoption and commercial models validated over time."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Operational delivery capacity",
              "Custom software development",
              "Insurance-specific platforms",
              "A developing AI intelligence layer"
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
            eyebrow="Platform ecosystem"
            title="Explore the connected parts of Temacore."
            body="These pages provide the operational, technology, insurance, and AI context behind the broader platform direction."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              href={routes.platforms}
              icon={Layers3}
              title="Platform Overview"
              body="See the connected ecosystem across managed operations, software, insurance technology, and AI-assisted workflow intelligence."
            />
            <InfoCard
              href={routes.ai}
              icon={Bot}
              title="AI Workflow Intelligence"
              body="Learn about Temacore's developing human-in-the-loop intelligence layer for operational support."
            />
            <InfoCard
              href={routes.insurtech}
              icon={ShieldCheck}
              title="Insurance Technology"
              body="Explore the life insurance and general insurance technology platforms at a responsible, high level."
            />
            <InfoCard
              href={`${routes.services}/business-process-outsourcing`}
              icon={UsersRound}
              title="Managed Operations"
              body="Explore Temacore's managed BPO service for structured, recurring business workflows."
            />
            <InfoCard
              href={`${routes.services}/custom-application-development`}
              icon={Code2}
              title="Custom Applications"
              body="Explore custom application development for business systems, workflows, and operational visibility."
            />
            <InfoCard
              href={routes.about}
              icon={Layers3}
              title="About Temacore"
              body="Learn more about Temacore's operating and technology direction."
            />
            <InfoCard
              href={routes.investors}
              icon={Presentation}
              title="Investor Presentation"
              body="Open Temacore's unlisted investor presentation for a deeper view of the platform direction."
            />
            <InfoCard
              href={routes.founder}
              icon={UserRound}
              title="Meet the Founder"
              body="Learn about the operating and technical perspective behind Temacore's connected platform direction."
            />
          </div>
        </Container>
      </section>

      <AiFlywheel />

      <CTASection
        title="Start a conversation with Temacore."
        body="For venture capital firms, incubators, accelerators, funding programs, and strategic partners, contact Temacore at info@temacore.com."
        primaryHref={routes.contact}
        primaryLabel="Contact Temacore"
        secondaryHref={routes.platforms}
        secondaryLabel="Explore Platforms"
      />
    </>
  );
}
