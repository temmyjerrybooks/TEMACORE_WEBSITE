import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTASection } from "@/components/sections/home-sections";
import type { Service } from "@/lib/data";
import { routes } from "@/lib/navigation";

export function ServicePageTemplate({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        body={service.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.clientIntake} variant="light">
            Start Client Intake
          </ButtonLink>
          <ButtonLink
            href={routes.contact}
            variant="outline"
            className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
          >
            Book Consultation
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-16">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {service.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-line bg-paper p-6">
                <p className="text-3xl font-black text-blue001">{metric.value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md bg-blue001 text-white">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <SectionHeading
              eyebrow="Service outcomes"
              title={`What ${service.shortTitle} should improve.`}
              body={service.summary}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {service.outcomes.map((outcome) => (
              <div key={outcome} className="rounded-lg border border-line bg-white p-5">
                <CheckCircle2 className="h-5 w-5 text-signal" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold leading-6 text-ink">{outcome}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Capabilities"
              title="The work Temacore can take on."
              body="The exact scope is shaped during intake, but these are the common operating lanes for this service."
            />
            <div className="mt-8 grid gap-3">
              {service.capabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-3 rounded-md border border-line p-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue002" />
                  <span className="text-sm font-bold text-ink">{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Deliverables"
              title="Built with documentation and controls."
              body="Temacore engagements are structured so clients can see how work is handled, measured, and improved."
            />
            <div className="mt-8 rounded-lg bg-footer p-6 text-white">
              <div className="grid gap-4">
                {service.deliverables.map((deliverable) => (
                  <div key={deliverable} className="flex items-center gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <CheckCircle2 className="h-5 w-5 text-signal" aria-hidden="true" />
                    <span className="text-sm font-semibold text-blue-50">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Engagement flow"
            title="A practical path from scope to managed execution."
            body="Every service starts with a clear operating design before Temacore scales people, systems, or automation."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {service.process.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-line bg-white p-6">
                <span className="text-sm font-black text-blue001">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-xl font-black text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title={`Need ${service.shortTitle} support?`}
        body="Share the workflow, workload, or system gap. Temacore will help you shape the right delivery model."
        primaryHref={routes.contact}
        primaryLabel="Talk to Temacore"
        secondaryHref={routes.projectRequest}
        secondaryLabel="Send Project Request"
      />
    </>
  );
}
