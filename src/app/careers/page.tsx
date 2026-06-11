import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { TalentApplicationForm } from "@/components/forms/talent-application-form";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Join Our Talent Pool",
  description:
    "Join Temacore's remote talent pool for operations, customer support, virtual assistant, back-office, CRM, and software roles.",
  path: "/careers"
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join Temacore's global talent pool."
        body="Temacore is building a network of remote operators, assistants, support agents, analysts, CRM specialists, and software professionals."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Talent intake"
            title="We look for dependable people who can communicate clearly and own the work."
            body="Submit your profile for future screening across remote operations and technology roles."
          />
          <TalentApplicationForm />
        </Container>
      </section>
    </>
  );
}
