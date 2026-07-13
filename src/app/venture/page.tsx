import type { Metadata } from "next";
import { Bot, Code2, HeartPulse, Layers3, Presentation, ShieldCheck, UsersRound } from "lucide-react";
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
  "Learn how Temacore connects managed operations, custom software, insurance technology, and developing AI-assisted workflow intelligence.";

export const metadata: Metadata = buildMetadata({
  title: "Venture Overview",
  description: pageDescription,
  path: routes.venture
});

const productAreas = [
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
        title="Connected infrastructure for operations, insurance, and AI."
        body="Temacore builds the operational, software, insurance, and intelligence infrastructure businesses need to deliver services more efficiently."
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
            body="Temacore combines managed operations, custom business applications, insurance technology platforms, and AI-assisted workflow intelligence within one connected ecosystem."
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
            eyebrow="Current product areas"
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
            title="Delivery capacity and technology designed to connect."
            body="Temacore combines operational delivery capacity, custom software development, insurance-specific platforms, and a developing AI intelligence layer."
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
          </div>
        </Container>
      </section>

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
