import type { Metadata } from "next";
import { ClientIntakeForm } from "@/components/forms/client-intake-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Client Intake Form",
  description:
    "Start a Temacore client intake for BPO, remote teams, customer support, back-office operations, application development, or automation."
};

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
            title="Structured intake for leads, operations, and future admin review."
            body="This form is prepared for future Supabase persistence with lead status, intake status, and admin workflow tracking."
          />
          <ClientIntakeForm />
        </Container>
      </section>
    </>
  );
}
