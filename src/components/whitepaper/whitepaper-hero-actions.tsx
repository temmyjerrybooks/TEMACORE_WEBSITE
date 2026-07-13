"use client";

import { Download } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { whitepaperAssets } from "@/lib/whitepaper";
import { trackWhitepaperEvent } from "./analytics";

export function WhitepaperHeroActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <ButtonLink href="#whitepaper-reader" variant="light">
        Read the Whitepaper
      </ButtonLink>
      <a
        href={whitepaperAssets.pdfSrc}
        download="temacore-connected-operations-intelligence-whitepaper.pdf"
        onClick={() => trackWhitepaperEvent("whitepaper_pdf_downloaded", 1)}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download PDF
      </a>
    </div>
  );
}
