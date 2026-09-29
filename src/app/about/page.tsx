import { JsonLd } from "@/components/seo/json-ld";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo-schema";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { CTASection } from "@/components/sections/home-sections";
import { site, whyTemacore } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Our AI-First Technology Company",
  description:
    "Discover Temacore's AI-first direction: vertical AI, enterprise software, and intelligent workflows, with insurance as its strongest current product base.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: "About Temacore", description: site.description, path: routes.about }), breadcrumbSchema([{ name: "Home", url: absoluteUrl(routes.home) }, { name: "About", url: absoluteUrl(routes.about) }])]} />
      <PageHero
        eyebrow="About Temacore"
        title="An AI-first technology company built around complex business operations."
        body={`${site.name} is a ${site.legalDescriptor}. We build vertical AI, enterprise software, and intelligent workflow infrastructure for insurance, financial services, and complex business operations. Our strongest current product base is insurance, including separate Life and General Insurance platforms. FinTech and financial operations offer adjacent applications for our developing intelligence layer; managed operations provide commercial execution and practical workflow insight.`}
      >
        <ButtonLink href={routes.founder} variant="light">
          Meet the Founder
        </ButtonLink>
        <p className="mt-6 text-sm leading-6 text-blue-50/90">
          Explore <Link href={routes.ai} className="font-semibold underline underline-offset-4">Temacore AI</Link>,
          our <Link href={routes.insurtech} className="font-semibold underline underline-offset-4">insurance operating system foundation</Link>,
          and the direction for <Link href={`${routes.industries}#financial-operations`} className="font-semibold underline underline-offset-4">financial workflow automation</Link>.
        </p>
      </PageHero>

      <section className="bg-white py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Operating philosophy"
            title="Understand the operation. Build the system. Add intelligence."
            body="Direct operating experience reveals repetitive tasks, data dependencies, and human decision points. We digitize those workflows, structure their data, and progressively develop AI assistance. Validated patterns can then inform reusable architecture across industries."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              "US-registered for international client confidence",
              "Built for remote execution across distributed teams",
              "Focused on measurable operating outcomes",
              "Clear responsibilities, review points, and access requirements"
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
            eyebrow="Principles"
            title="Premium delivery is built from clarity, accountability, and visibility."
            body="Temacore engagements are designed so clients understand who owns the work, how quality is checked, what tools are used, and how progress is reported."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {whyTemacore.map((item) => (
              <InfoCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
