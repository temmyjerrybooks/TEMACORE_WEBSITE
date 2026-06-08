import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  homeStats,
  howItWorksSteps,
  industries,
  services,
  technologySolutions,
  trustItems,
  whyTemacore
} from "@/lib/data";
import { routes } from "@/lib/navigation";

export function HomeHero() {
  return (
    <section className="cosmic-shell relative overflow-hidden text-white">
      <div className="cosmic-stars" />
      <div className="cosmic-stars-mini" />
      <div className="cosmic-starburst right-[10%] top-[8%] hidden md:block" />
      <div className="cosmic-starburst -left-14 bottom-[24%] scale-75 opacity-60" />
      <div className="cosmic-starburst left-[64%] top-[39%] scale-50 opacity-70" />
      <div className="cosmic-vignette" />
      <Container className="relative z-10 flex min-h-[calc(100svh-76px)] flex-col items-center justify-center py-20 text-center md:py-24">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            <Sparkles className="h-4 w-4 text-warm" aria-hidden="true" />
            US-registered global operations partner
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Build cleaner operations with teams and systems that actually run.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-50/90 md:text-xl">
            Temacore provides managed BPO, remote operations teams, customer support, back-office execution, and custom business applications for companies serving North America, the UK, and Europe.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={routes.contact} variant="light">
              Book a Consultation
            </ButtonLink>
            <ButtonLink href={routes.services} variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001">
              View Services
            </ButtonLink>
          </div>
        </div>

        <div className="mt-16 flex w-full max-w-2xl items-center justify-center gap-4">
          <span className="h-px flex-1 bg-white/70" />
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-50">
            Trusted operating support for global teams
          </p>
          <span className="h-px flex-1 bg-white/70" />
        </div>

        <div className="mt-10 grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
            {homeStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-white/10 bg-white/10 px-4 py-4 backdrop-blur"
              >
                <p className="text-2xl font-black text-white md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs leading-5 text-blue-100/75">{stat.label}</p>
              </div>
            ))}
        </div>
      </Container>
    </section>
  );
}

export function TrustBar() {
  const items = [...trustItems, ...trustItems];

  return (
    <section className="border-y border-line bg-white py-4">
      <div className="overflow-hidden">
        <div className="flex w-max gap-4 animate-marquee">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex min-w-max items-center gap-3 px-4 text-sm font-bold text-slate-600"
            >
              <span className="h-2 w-2 rounded-full bg-blue002" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesOverview({ showAll = false }: { showAll?: boolean }) {
  const visibleServices = showAll ? services : services.slice(0, 6);

  return (
    <section className="bg-paper py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Core services"
            title="Operations support and business technology under one roof."
            body="Temacore helps companies decide what should be delegated, what should be automated, and what should be built into a better system."
          />
          {!showAll ? (
            <ButtonLink href={routes.services} variant="outline" className="w-fit">
              All Services
            </ButtonLink>
          ) : null}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((service) => (
            <InfoCard
              key={service.slug}
              href={`${routes.services}/${service.slug}`}
              icon={service.icon}
              title={service.title}
              body={service.summary}
              meta={service.eyebrow}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function OperationsSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="BPO and remote delivery"
            title="A managed operating layer for the work your team should not chase manually."
            body="Temacore combines documented workflows, trained operators, quality checks, and client-facing reporting so outsourcing feels controlled instead of loose."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`${routes.services}/business-process-outsourcing`}>
              Explore BPO
            </ButtonLink>
            <ButtonLink href={`${routes.services}/remote-teams`} variant="outline">
              Remote Teams
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Lead follow-up and appointment setting",
            "Customer support ticket triage",
            "Back-office data and document workflows",
            "Virtual assistant and admin support",
            "Weekly QA and status reporting",
            "Escalation paths for urgent decisions"
          ].map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-line bg-paper p-5">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
              <p className="text-sm font-semibold leading-6 text-ink">{item}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ApplicationDevelopmentSection() {
  return (
    <section className="overflow-hidden bg-footer py-20 text-white md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="rounded-md bg-white p-5 text-ink shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="text-sm font-black">Client Portal Blueprint</p>
                <p className="text-xs text-slate-500">Requests, approvals, files, dashboards</p>
              </div>
              <span className="rounded-md bg-blue001 px-3 py-2 text-xs font-bold text-white">
                In review
              </span>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {technologySolutions.slice(0, 3).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-md bg-paper p-4">
                    <Icon className="h-5 w-5 text-blue002" aria-hidden="true" />
                    <p className="mt-3 text-sm font-black">{item.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
            Application development
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Build the internal software your operations have been improvising around.
          </h2>
          <p className="mt-5 text-lg leading-8 text-blue-50/80">
            We create practical business applications: client portals, CRM systems, workflow dashboards, automation tools, and secure admin interfaces that match the way teams actually work.
          </p>
          <div className="mt-8">
            <ButtonLink href={`${routes.services}/custom-application-development`} variant="light">
              Custom Application Development
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function IndustriesPreview() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Industries"
            title="Flexible delivery for service-heavy businesses."
            body="The model works best where customer experience, repeatable admin, reliable follow-up, and clear records matter."
          />
          <ButtonLink href={routes.industries} variant="outline" className="w-fit">
            Industries We Serve
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.slice(0, 6).map((industry) => (
            <InfoCard key={industry.title} icon={industry.icon} title={industry.title} body={industry.body} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="bg-paper py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From messy workflow to managed delivery."
          body="Temacore structures each engagement so work can be delegated safely, measured clearly, and improved over time."
          align="center"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative rounded-lg border border-line bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-blue001 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-black text-blue001">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-black text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why Temacore"
          title="A stronger partner for companies that need execution, not another loose vendor."
          body="The operating model is built around accountability: clear roles, documented processes, measurable output, and technology that supports the work."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {whyTemacore.map((item) => (
            <InfoCard key={item.title} icon={item.icon} title={item.title} body={item.body} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function CTASection({
  title = "Ready to design a better operating model?",
  body = "Send the current workflow, pain point, or project idea. Temacore will help you shape the right mix of team, process, and technology.",
  primaryHref = routes.contact,
  primaryLabel = "Book Consultation",
  secondaryHref = routes.clientIntake,
  secondaryLabel = "Start Client Intake"
}: {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-paper py-16 md:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-lg bg-blue001 p-8 text-white md:p-12">
          <div className="absolute inset-0 bg-command-grid opacity-20" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-lg leading-8 text-blue-50/90">{body}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <ButtonLink href={primaryHref} variant="light">
                {primaryLabel}
              </ButtonLink>
              <Link
                href={secondaryHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-blue001"
              >
                {secondaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
