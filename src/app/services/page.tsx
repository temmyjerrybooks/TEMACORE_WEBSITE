import type { Metadata } from "next";
import { ServicesOverview, CTASection } from "@/components/sections/home-sections";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/lib/data";
import { routes } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Explore Temacore services across BPO, remote teams, customer support, virtual assistant services, CRM development, client portals, application development, and business automation.",
  path: "/services"
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="All services"
        title="Business operations and technology services built to work together."
        body="Temacore combines managed operations and enterprise software to improve recurring work. Our developing AI layer is intended to enhance these services through assistance and automation, with people responsible for review, exceptions, and decisions."
      />
      <ServicesOverview showAll />
      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Service model"
            title="Choose one service line or combine several into a managed operating model."
            body="Most clients start with one pressure point: support backlog, lead follow-up, back-office work, or a missing internal system. The model can expand as the workflow becomes clearer."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.slug} className="rounded-lg border border-line bg-paper p-6">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue002">
                  {service.shortTitle}
                </p>
                <h2 className="mt-4 text-xl font-black text-ink">{service.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.platforms} variant="outline">
              Explore Our Platforms
            </ButtonLink>
            <ButtonLink href={routes.ai} variant="outline">
              Explore AI Workflow Intelligence
            </ButtonLink>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
