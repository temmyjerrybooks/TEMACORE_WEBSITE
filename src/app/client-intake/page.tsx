import type { Metadata } from "next";
import { ClientIntakeForm } from "@/components/forms/client-intake-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Client Intake Form",
  description:
    "Start a Temacore client intake for BPO, remote teams, customer support, back-office operations, application development, or automation.",
  path: "/client-intake"
});

export default function ClientIntakePage() {
  return (
    <>
      <PageHero
        eyebrow="Client intake"
        title="Tell us what needs to run better."
        body="Share the workflow, current tools, team gaps, and expected volume so Temacore can recommend the right operating model."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <SectionHeading
            eyebrow="Secure scoping"
            title="A clear starting point for your service requirements."
            body="Share your workflow and service requirements so our team can review your needs and plan the next step."
          />
          <ClientIntakeForm />
        </Container>
      </section>
    </>
  );
}
