import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { TallyEmbed } from "@/components/forms/tally-embed";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Temacore",
  description:
    "Contact Temacore to discuss BPO, remote operations teams, customer support outsourcing, back-office operations, application development, and automation."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Book a consultation with Temacore."
        body="Use the contact form or email the team directly. Share the workflow, service need, or project idea and Temacore will respond with the next step."
      />
      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <SectionHeading
              eyebrow="Start the conversation"
              title="A concise brief is enough."
              body="Temacore can help shape the operating model after understanding the current workload, tools, pain points, and timeline."
            />
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex items-center gap-3 rounded-md border border-line bg-white px-5 py-4 text-sm font-bold text-blue001 transition hover:border-blue001"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              {site.email}
            </a>
          </div>
          <TallyEmbed />
        </Container>
      </section>
    </>
  );
}
