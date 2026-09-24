import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Presentation } from "lucide-react";
import { InvestorDeckViewer } from "@/components/investors/investor-deck-viewer";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import {
  investorDeckAssetRequirements,
  investorDeckAssets
} from "@/lib/investor-deck";
import { routes } from "@/lib/navigation";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/data";
import { founderProfile } from "@/lib/founder-profile";

const description =
  "TEMACORE builds vertical AI software and intelligent workflow infrastructure across InsurTech, FinTech, and complex business operations.";

export const metadata: Metadata = buildMetadata({
  title: "Investor Overview: Vertical AI & InsurTech",
  description,
  path: routes.investors,
  image: "/logo.png",
  imageWidth: 1024,
  imageHeight: 1024,
  imageAlt: "TEMACORE logo",
  noIndex: true,
  noArchive: true
});

export default function InvestorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Temacore investor presentation"
        title="Building Vertical AI and Intelligent Workflow Infrastructure"
        body="TEMACORE is an AI-first technology company building vertical AI, enterprise software, and intelligent operations. TEMACORE AI is the shared intelligence layer across InsurTech, FinTech, and AI-enhanced BPO."
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
          This presentation is shared as an unlisted investor resource. It is not indexed in Temacore&apos;s public sitemap or AI-search resource file. Learn about {" "}
          <Link href={routes.founder} className="font-semibold text-blue001 underline-offset-4 hover:underline">
            {founderProfile.name}, Temacore&apos;s founder
          </Link>
          {" "}and the perspective behind the platform direction.
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
            Export {investorDeckAssetRequirements.slideFiles.join(", ")} at {investorDeckAssetRequirements.dimensions} WebP, plus {investorDeckAssetRequirements.pdfFile}, into {investorDeckAssetRequirements.directory}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
