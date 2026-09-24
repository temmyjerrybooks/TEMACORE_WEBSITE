import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  Code2,
  Gauge,
  LockKeyhole,
  RadioTower,
  ShieldCheck,
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
    <section className="relative overflow-hidden bg-footer text-white">
      <div className="absolute inset-0 bg-command-grid opacity-30 animate-pulse-grid" />
      <div className="hero-universe-stars" />
      <div className="hero-universe-stars-mini" />
      <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-blue002/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-signal/15 blur-3xl" />
      <div className="hero-universe-starburst right-[8%] top-[9%] hidden md:block" />
      <div className="hero-universe-starburst left-[58%] top-[38%] scale-50 opacity-70" />
      <div className="hero-universe-starburst -left-16 bottom-[24%] scale-75 opacity-60" />
      <div className="hero-universe-vignette" />
      <Container className="relative z-10 grid min-h-[78svh] items-center gap-12 py-16 lg:grid-cols-[1fr_0.92fr] lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            <Sparkles className="h-4 w-4 text-warm" aria-hidden="true" />
            AI-first technology company
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
            Vertical AI for Complex Business Operations
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50/90 md:text-xl">
            Enterprise software, industry platforms, and an evolving AI intelligence layer for InsurTech, FinTech, and BPO. We digitize workflows and progressively automate repetitive work, with people accountable for decisions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.platforms} variant="light">
              Explore Our Platforms
            </ButtonLink>
            <ButtonLink href={routes.contact} variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001">
              Book a Consultation
            </ButtonLink>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {homeStats.map((stat) => (
              <div key={stat.label} className="border-l border-white/15 pl-4">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-xs leading-5 text-blue-100/75">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <DashboardVisual />
      </Container>
    </section>
  );
}

function DashboardVisual() {
  const queue = [
    { label: "Workflow status", value: "In review", width: "84%", tone: "bg-signal" },
    { label: "Quality review", value: "Monitored", width: "76%", tone: "bg-blue002" },
    { label: "Human review", value: "Active", width: "68%", tone: "bg-warm" }
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl animate-float-panel">
      <div className="absolute -inset-4 rounded-[2rem] bg-blue002/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-lg border border-white/15 bg-white/10 p-3 shadow-[0_35px_100px_rgba(0,0,0,0.28)] backdrop-blur">
        <div className="flex items-center justify-between rounded-md border border-white/10 bg-ink/80 px-4 py-3">
          <div>
            <p className="text-sm font-bold">Temacore Command Center</p>
            <p className="text-xs text-blue-100/70">Illustrative workflow concept</p>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-signal/15 px-3 py-2 text-xs font-bold text-emerald-200">
            <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
            Workflow Status
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-md border border-white/10 bg-white p-4 text-ink">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black">Workflow Throughput</p>
              <Gauge className="h-5 w-5 text-blue002" aria-hidden="true" />
            </div>
            <div className="mt-5 space-y-4">
              {queue.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`${item.tone} h-full rounded-full`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-md border border-white/10 bg-white p-4 text-ink">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black">Coverage</p>
                <RadioTower className="h-5 w-5 text-blue002" aria-hidden="true" />
              </div>
              <p className="mt-4 text-3xl font-black">Global delivery</p>
              <p className="mt-1 text-xs text-slate-500">Operations, technology, and insurance workflows</p>
            </div>
            <div className="rounded-md border border-white/10 bg-ink p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black">Access Control</p>
                <LockKeyhole className="h-5 w-5 text-blue-200" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2 text-xs text-blue-100/80">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-signal" aria-hidden="true" />
                  Role-based work queues
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-signal" aria-hidden="true" />
                  Human approval checkpoints
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-md border border-white/10 bg-blue001/70 px-4 py-3">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            Intake - Scoping - Delivery - Optimization
          </p>
        </div>
      </div>
    </div>
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
            title="Enterprise software and operating expertise, connected by AI."
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

export function EcosystemSection() {
  const ecosystem = [
    { title: "FinTech / Financial Services", body: "A strategic opportunity for document intelligence, financial administration, and decision support with human controls. Capabilities are scoped opportunities, not a deployed financial product claim.", icon: Gauge, href: routes.industries },
    {
      title: "Managed BPO Services",
      body: "A commercial service and an environment for developing AI around real customer, document, and back-office workflows.",
      icon: BriefcaseBusiness,
      href: `${routes.services}/business-process-outsourcing`
    },
    {
      title: "Custom Business Applications",
      body: "Practical portals, CRM systems, dashboards, and automation designed around real operating work.",
      icon: Code2,
      href: routes.technology
    },
    {
      title: "Life Insurance Technology",
      body: "Technology designed to support life insurance onboarding, policy workflows, operations, and reporting.",
      icon: ShieldCheck,
      href: `${routes.insurtech}#life-insurance`
    },
    {
      title: "General Insurance Technology",
      body: "Workflow support for general insurance records, applications, claims operations, and visibility.",
      icon: ShieldCheck,
      href: `${routes.insurtech}#general-insurance`
    },
    {
      title: "AI Workflow Intelligence",
      body: "A developing AI-assisted layer for workflow intelligence, operational support, and human review.",
      icon: Bot,
      href: routes.ai
    }
  ];

  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Connected ecosystem"
            title="One AI architecture. Three strategic verticals."
            body="Insurance, FinTech, and BPO are strategic applications of Temacore AI. Enterprise software structures the work and data; our developing intelligence layer is designed to support review, routing, and repeatable tasks across them."
          />
          <ButtonLink href={routes.venture} variant="outline" className="w-fit">
            Venture Overview
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ecosystem.map((item) => (
            <InfoCard key={item.title} {...item} />
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
            body="Temacore combines people, software, automation, and developing AI. Our managed teams deliver recurring work today and help identify what can be automated next, so people can focus on judgment, exceptions, relationships, and review."
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
            title="Vertical expertise, reusable workflow intelligence."
            body="Insurance, financial services, and managed operations lead the opportunity, with applicability across eCommerce, professional services, and other workflow-intensive industries."
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
          title="Domain knowledge, operations, software, data, and AI."
          body="Our advantage comes from understanding the work, building its digital foundation, and developing intelligence that can be reused with human oversight."
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
