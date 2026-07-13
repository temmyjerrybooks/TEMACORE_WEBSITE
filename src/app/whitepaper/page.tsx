import type { Metadata } from "next";
import Image from "next/image";
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  FileText,
  ShieldCheck
} from "lucide-react";
import { WhitepaperHeroActions } from "@/components/whitepaper/whitepaper-hero-actions";
import { WhitepaperReader } from "@/components/whitepaper/whitepaper-reader";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { InfoCard } from "@/components/ui/info-card";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  whitepaperAssets,
  whitepaperPageHeight,
  whitepaperPageWidth
} from "@/lib/whitepaper";
import { routes } from "@/lib/navigation";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  organizationSchema,
  whitepaperSchema
} from "@/lib/seo-schema";

const title = "Connected Operations Intelligence Whitepaper";
const description =
  "Read Temacore's whitepaper on integrating managed BPO, custom business applications, insurance technology platforms and human-in-the-loop AI workflow intelligence.";

export const metadata: Metadata = buildMetadata({
  title,
  description,
  path: routes.whitepaper,
  image: whitepaperAssets.coverSrc,
  imageWidth: whitepaperPageWidth,
  imageHeight: whitepaperPageHeight,
  imageAlt: "Temacore Connected Operations Intelligence whitepaper cover"
});

export default function WhitepaperPage() {
  const jsonLd = [
    whitepaperSchema({
      headline: "Connected Operations Intelligence",
      description,
      path: routes.whitepaper,
      coverImage: whitepaperAssets.coverSrc,
      pdfUrl: whitepaperAssets.pdfSrc
    }),
    breadcrumbSchema([
      { name: "Home", url: absoluteUrl(routes.home) },
      { name: "Connected Operations Intelligence Whitepaper", url: absoluteUrl(routes.whitepaper) }
    ]),
    organizationSchema()
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero
        eyebrow="Temacore whitepaper"
        title="Connected Operations Intelligence"
        body="A practical operating model connecting managed BPO, custom business applications, life and general insurance technology, and human-in-the-loop AI workflow intelligence."
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <WhitepaperHeroActions />
          <div className="relative w-28 shrink-0 overflow-hidden rounded-md border border-white/20 bg-white shadow-[0_18px_44px_rgba(0,0,0,0.24)] sm:w-32">
            <Image
              src={whitepaperAssets.coverSrc}
              alt="Temacore Connected Operations Intelligence whitepaper cover"
              width={whitepaperPageWidth}
              height={whitepaperPageHeight}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </PageHero>

      <section className="bg-white py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Executive overview"
            title="A connected operating model for practical delivery."
            body="Temacore's Connected Operations Intelligence whitepaper presents an integrated operating model in which managed service teams, custom business applications, life and general insurance platforms, and human-in-the-loop AI work as connected layers. The paper explains Temacore's current foundations, developing AI direction, governance principles, commercial pathways and implementation roadmap without presenting unverified traction or automated regulated decision-making claims."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={BriefcaseBusiness}
              title="Managed Operations"
              body="Managed service teams and operational workflows designed around the work that needs to get done."
            />
            <InfoCard
              icon={Code2}
              title="Custom Business Applications"
              body="Business applications designed to organize workflows, records and operating visibility."
            />
            <InfoCard
              icon={ShieldCheck}
              title="Insurance Technology"
              body="Life and general insurance technology platforms for structured operational workflows."
            />
            <InfoCard
              icon={Bot}
              title="AI Workflow Intelligence"
              body="Human-in-the-loop workflow intelligence designed to support accountable teams."
            />
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Read the report"
            title="Connected Operations Intelligence"
            body="Read page by page or switch to continuous reading. The supplied whitepaper pages are shown in their original order."
            align="center"
          />
          <div className="mt-12">
            {whitepaperAssets.ready ? <WhitepaperReader /> : <WhitepaperAssetNotice />}
          </div>
        </Container>
      </section>
    </>
  );
}

function WhitepaperAssetNotice() {
  return (
    <div className="rounded-lg border border-line bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-blue001/10 text-blue001">
        <FileText className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-ink">The whitepaper is being prepared.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        The document is temporarily unavailable in this environment. Please contact Temacore for the current whitepaper.
      </p>
      <a
        href="mailto:info@temacore.com"
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
      >
        Contact Temacore
      </a>
    </div>
  );
}
