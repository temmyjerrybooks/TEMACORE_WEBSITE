import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  Code2,
  FileText,
  Github,
  Layers3,
  Linkedin,
  ShieldCheck,
  Workflow
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { founderProfile } from "@/lib/founder-profile";
import { routes } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/seo";
import {
  breadcrumbSchema,
  founderPersonSchema,
  founderProfilePageSchema,
  webPageSchema
} from "@/lib/seo-schema";

const pageTitle = `${founderProfile.name} | Founder of Temacore`;
const pageDescription =
  "Meet Temitope Abodunde, founder of Temacore, connecting software engineering, insurance technology, and operations to the company's vertical AI product strategy.";

const intersectionAreas = [
  {
    title: "Insurance systems",
    body: "Experience across life and general insurance technology informs practical systems for records, workflows, and operations teams.",
    icon: ShieldCheck
  },
  {
    title: "BPO automation",
    body: "Operational workflows are designed to make handoffs, repeatable work, and quality controls easier to manage.",
    icon: Workflow
  },
  {
    title: "Full-stack delivery",
    body: "Custom applications and connected business systems are shaped around the people and processes they need to support.",
    icon: Code2
  },
  {
    title: "Requirements to execution",
    body: "Business needs are translated into usable technical systems with a clear view of the operating outcome.",
    icon: BriefcaseBusiness
  }
];

const foundingPrinciples = [
  {
    title: "Start with the operation",
    body: "The strongest systems begin with an honest understanding of the work, the people responsible for it, and the decisions that need context.",
    icon: BriefcaseBusiness
  },
  {
    title: "Turn requirements into systems",
    body: "Temacore was founded to bridge business requirements and technical delivery through practical applications, automation, and operating workflows.",
    icon: Code2
  },
  {
    title: "Keep people accountable",
    body: "Automation and AI-assisted workflow intelligence should strengthen visibility and human review, not remove responsibility from the work.",
    icon: Workflow
  }
];

const thingsBuilt = [
  {
    title: "Life insurance technology",
    body: "Technology designed to support life insurance workflows, customer records, documents, operations, and reporting visibility.",
    icon: ShieldCheck
  },
  {
    title: "General insurance technology",
    body: "Technology designed to support general and business insurance workflows with clearer records, processes, and operational support.",
    icon: FileText
  },
  {
    title: "Custom business applications",
    body: "Custom systems, portals, dashboards, and applications shaped around the operating needs of a business.",
    icon: Code2
  },
  {
    title: "Connected operations infrastructure",
    body: "Workflow automation and operating systems that connect people, processes, information, and accountable decisions.",
    icon: Layers3
  }
];

const journey = [
  {
    title: "Early digital foundations",
    body: "Early work across web development, technical instruction, and SEO/content systems established a practical foundation for digital delivery."
  },
  {
    title: "Insurance and operations automation",
    body: "That foundation developed into hands-on work across insurance systems, BPO automation, full-stack development, and custom business applications."
  },
  {
    title: "Temacore",
    body: "Temacore brings these areas together around one goal: help organizations build connected operations, insurance technology, and intelligent workflow systems."
  }
];

const capabilityGroups = [
  {
    title: "Software and systems",
    body: "Full-stack development, custom business applications, portals, dashboards, and systems that support real operational work.",
    icon: Code2
  },
  {
    title: "Insurance technology",
    body: "Life and general insurance technology informed by the workflows, records, documents, and teams that sustain insurance operations.",
    icon: ShieldCheck
  },
  {
    title: "Operations automation",
    body: "BPO workflow design, automation, and connected operating systems designed to keep execution visible and repeatable.",
    icon: Workflow
  },
  {
    title: "Business perspective",
    body: "An accounting and business background that keeps technical decisions grounded in operating needs and practical outcomes.",
    icon: BriefcaseBusiness
  }
];

const featuredLinks = [
  {
    title: "Platform ecosystem",
    body: "Explore how operations, custom software, insurance technology, and AI-assisted workflow intelligence connect.",
    href: routes.platforms,
    icon: Layers3
  },
  {
    title: "Insurance technology",
    body: "See Temacore's responsible overview of life and general insurance technology platforms.",
    href: routes.insurtech,
    icon: ShieldCheck
  },
  {
    title: "AI workflow intelligence",
    body: "Learn about Temacore's developing, human-in-the-loop intelligence layer for workflow support.",
    href: routes.ai,
    icon: Bot
  },
  {
    title: "Investor presentation",
    body: "Open the unlisted investor presentation for a deeper view of Temacore's platform direction.",
    href: routes.investors,
    icon: BriefcaseBusiness
  },
  {
    title: "Connected Operations Intelligence",
    body: "Read Temacore's whitepaper on its AI-assisted infrastructure model for operations and insurance technology.",
    href: routes.whitepaper,
    icon: FileText
  }
];

export const metadata: Metadata = {
  title: {
    absolute: pageTitle
  },
  description: pageDescription,
  alternates: {
    canonical: absoluteUrl(routes.founder)
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: absoluteUrl(routes.founder),
    siteName: "Temacore",
    type: "website",
    images: []
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
    images: []
  }
};

export default function FounderPage() {
  const jsonLd = [
    webPageSchema({
      name: pageTitle,
      description: pageDescription,
      path: routes.founder
    }),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "Founder", url: absoluteUrl(routes.founder) }
    ]),
    founderProfilePageSchema({
      name: pageTitle,
      description: pageDescription,
      path: routes.founder
    }),
    founderPersonSchema({
      name: founderProfile.name,
      title: founderProfile.title,
      path: routes.founder,
      sameAs: [founderProfile.linkedInUrl, founderProfile.githubUrl],
      knowsAbout: founderProfile.knowsAbout
    })
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Founder of Temacore"
        title={founderProfile.name}
        body={`${founderProfile.title} - ${founderProfile.descriptor}. His work across software engineering, insurance technology, and business operations informs Temacore's AI-first product strategy: digitize real workflows, structure their data, and progressively add intelligence with human oversight.`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={founderProfile.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Connect with ${founderProfile.name} on LinkedIn (opens in a new tab)`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-blue001 shadow-[0_14px_32px_rgba(255,255,255,0.16)] transition hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              Connect on LinkedIn
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <ButtonLink
              href={routes.platforms}
              variant="outline"
              className="border-white/25 bg-transparent text-white hover:bg-white hover:text-blue001"
            >
              Explore Temacore&apos;s Platforms
            </ButtonLink>
          </div>
          <FounderPortrait />
        </div>
      </PageHero>

      <section className="bg-white py-20 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionHeading
            eyebrow="Founder overview"
            title="Building connected systems from the work outward."
            body="Temitope Abodunde founded Temacore to connect software engineering, industry platforms, and managed operations. That foundation now supports the company's direction in vertical AI across InsurTech, FinTech, and intelligent business operations."
          />
          <div className="space-y-5 text-base leading-7 text-slate-600 md:text-lg">
            <p>
              As Temacore&apos;s sole founder, Temitope works where business requirements meet technical delivery. His perspective combines insurance systems, BPO automation, full-stack software development, and custom business systems.
            </p>
            <p>
              The AI product strategy starts with understanding the workflow, building its software foundation, and validating assistance around human decision points. Insurance is an initial product foundation; financial services and managed operations offer further applications for reusable intelligence.
            </p>
            <div className="rounded-lg border border-line bg-paper p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue002">
                Professional foundation
              </p>
              <p className="mt-3 text-lg font-bold leading-7 text-ink">
                Five years working across insurance technology, automation, and custom business systems.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Experience"
            title="Five years at the intersection of insurance and technology."
            body="Temitope&apos;s work is grounded in the systems that support insurance operations and the software, automation, and business context needed to make them more useful."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {intersectionAreas.map((area) => (
              <InfoCard key={area.title} {...area} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Temacore"
            title="A venture built to connect execution and technology."
            body="Temacore was founded around a simple operating belief: businesses need systems that are connected to their teams, their workflows, and the outcomes they are accountable for."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {foundingPrinciples.map((principle) => (
              <InfoCard key={principle.title} {...principle} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Built across the ecosystem"
            title="Technology shaped around insurance, operations, and business systems."
            body="The work behind Temacore spans insurance technology, custom applications, automation, and connected operational infrastructure."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {thingsBuilt.map((item) => (
              <InfoCard key={item.title} {...item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Professional journey"
            title="A progression from digital delivery to connected operating systems."
            body="The path from digital delivery to Temacore brings together the foundations that now shape its connected operating model."
            align="center"
          />
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {journey.map((step, index) => (
              <li
                key={step.title}
                className="rounded-lg border border-line bg-paper p-6 shadow-[0_18px_55px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-blue001 text-sm font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue002">
                    Journey
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Technical and business perspective"
            title="Systems thinking informed by the operation behind the screen."
            body="Temitope combines technical capability with an accounting and business perspective, keeping the work focused on what teams need to deliver reliably."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {capabilityGroups.map((capability) => (
              <InfoCard key={capability.title} {...capability} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-footer py-20 text-white md:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
              Leadership approach
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Build for clarity, review, and accountable execution.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-blue-50/85">
            <p>
              Temacore&apos;s leadership approach favors practical systems, transparent handoffs, human review, and delivery that stays connected to the business need.
            </p>
            <p>
              The long-term vision is a connected operating ecosystem where managed teams, business applications, insurance technology, and AI-assisted workflow intelligence reinforce one another.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Explore Temacore"
            title="Follow the connected platform direction."
            body="Explore the areas Temacore is building and the resources that explain the operating model in more depth."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredLinks.map((link) => (
              <InfoCard key={link.title} {...link} />
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={founderProfile.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${founderProfile.name}'s LinkedIn profile (opens in a new tab)`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-blue001/20 bg-white px-5 py-3 text-sm font-semibold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={founderProfile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${founderProfile.name}'s GitHub profile (opens in a new tab)`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-blue001/20 bg-white px-5 py-3 text-sm font-semibold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-16 md:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-lg bg-blue001 p-8 text-white md:p-12">
            <div className="absolute inset-0 bg-command-grid opacity-20" />
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Start a conversation</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                  Build the next connected system with Temacore.
                </h2>
                <p className="mt-4 text-lg leading-8 text-blue-50/90">
                  Whether you are exploring operations support, insurance technology, custom systems, or AI-assisted workflow intelligence, Temacore is ready to discuss the work ahead.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <ButtonLink href={routes.contact} variant="light">
                  Contact Temacore
                </ButtonLink>
                <a
                  href={founderProfile.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Connect with ${founderProfile.name} on LinkedIn (opens in a new tab)`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Connect on LinkedIn
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={founderProfile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${founderProfile.name}'s GitHub profile (opens in a new tab)`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  View GitHub
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function FounderPortrait() {
  if (founderProfile.portrait) {
    return (
      <Image
        src={founderProfile.portrait.src}
        alt={founderProfile.portrait.alt}
        width={112}
        height={112}
        sizes="112px"
        className="h-28 w-28 rounded-lg border border-white/20 object-cover shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
      />
    );
  }

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-28 w-28 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-3xl font-black tracking-tight text-white shadow-[0_18px_45px_rgba(0,0,0,0.2)]"
    >
      {founderProfile.initials}
    </div>
  );
}
