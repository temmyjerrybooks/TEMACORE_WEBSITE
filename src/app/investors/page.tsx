import type { Metadata } from "next";
import { Mail, Presentation } from "lucide-react";
import { InvestorDeckViewer } from "@/components/investors/investor-deck-viewer";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import {
  investorDeckAssetRequirements,
  investorDeckAssets,
  investorDeckSlideHeight,
  investorDeckSlideWidth
} from "@/lib/investor-deck";
import { routes } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/data";

const description =
  "View Temacore's investor presentation covering its managed operations, custom applications, insurance technology platforms and AI-assisted workflow intelligence.";

export const metadata: Metadata = buildMetadata({
  title: "Temacore Investor Presentation",
  description,
  path: routes.investors,
  image: investorDeckAssets.ready ? investorDeckAssets.coverSrc : "/logo.png",
  imageWidth: investorDeckAssets.ready ? investorDeckSlideWidth : 1024,
  imageHeight: investorDeckAssets.ready ? investorDeckSlideHeight : 1024,
  imageAlt: investorDeckAssets.ready ? "Temacore investor presentation cover" : "TEMACORE logo",
  noIndex: true,
  noArchive: true
});

export default function InvestorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Temacore investor presentation"
        title="Building AI-Powered Operations, Insurance and Technology Infrastructure"
        body="Explore Temacore's connected ecosystem across managed operations, custom business applications, insurance technology platforms and AI-assisted workflow intelligence."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#investor-presentation" variant="light">
            View Presentation
          </ButtonLink>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-blue001"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Contact Temacore
          </a>
        </div>
      </PageHero>

      <section className="bg-paper py-16 md:py-20">
        <Container>
          {investorDeckAssets.ready ? <InvestorDeckViewer /> : <InvestorDeckAssetNotice />}
        <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-5 text-slate-500">
          This presentation is shared as an unlisted investor resource. It is not indexed in Temacore&apos;s public sitemap or AI-search resource file.
        </p>
        </Container>
      </section>
    </>
  );
}

function InvestorDeckAssetNotice() {
  const development = process.env.NODE_ENV === "development";

  return (
    <div className="rounded-lg border border-line bg-white p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-blue001/10 text-blue001">
        <Presentation className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-ink">Investor presentation assets are being prepared.</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        The presentation is temporarily unavailable in this environment. Please contact Temacore for the current investor materials.
      </p>
      <a
        href={`mailto:${site.email}`}
        className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002"
      >
        Contact Temacore
      </a>
      {development ? (
        <div className="mx-auto mt-8 max-w-2xl rounded-md bg-paper p-4 text-left text-xs leading-5 text-slate-600">
          <p className="font-bold text-ink">Required production asset manifest</p>
          <p className="mt-2">
            Export {investorDeckAssetRequirements.slideFiles.join(", ")} and {investorDeckAssetRequirements.coverFile} at {investorDeckAssetRequirements.dimensions} WebP, plus {investorDeckAssetRequirements.pdfFile}, into {investorDeckAssetRequirements.directory}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
