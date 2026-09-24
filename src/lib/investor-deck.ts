export const investorDeckSlideCount = 15;
export const investorDeckSlideWidth = 2560;
export const investorDeckSlideHeight = 1440;

// Content-addressed paths prevent an old CDN/image-cache entry serving the previous deck.
export const investorDeckRevision = "2026-c195ba3c";
const assetBase = `/investor-deck/${investorDeckRevision}`;

const slideTitles = [
  "The AI Operating System for Modern Business",
  "Vision",
  "The Problem",
  "The Solution",
  "Products: Life and General Insurance Operating System",
  "Technology and AI Platform",
  "Market Opportunity",
  "Business Model",
  "Traction: monthly company revenue and working platforms",
  "Competitive Landscape",
  "Go-to-Market Strategy",
  "Product Roadmap",
  "18-Month Value Creation Plan",
  "Funding Ask and Use of Funds",
  "Closing: vertical AI for complex business operations"
] as const;

export type InvestorDeckSlide = {
  id: number;
  src: string;
  alt: string;
};

export const investorDeckSlides: InvestorDeckSlide[] = slideTitles.map((title, index) => {
  const id = index + 1;
  const number = String(id).padStart(2, "0");
  return {
    id,
    src: `${assetBase}/slide-${number}.webp`,
    alt: `Temacore investor presentation slide ${id} of ${investorDeckSlideCount}: ${title}`
  };
});

export const investorDeckAssets = {
  ready: true,
  pdfSrc: `${assetBase}/TEMACORE_Investor_Deck_2026.pdf`,
  pdfDownloadName: "TEMACORE_Investor_Deck_2026.pdf",
  pdfAvailable: true
} as const;

export const investorDeckAssetRequirements = {
  directory: `public${assetBase}`,
  dimensions: `${investorDeckSlideWidth}x${investorDeckSlideHeight}`,
  slideFiles: investorDeckSlides.map((slide) => slide.src.split("/").at(-1)),
  pdfFile: investorDeckAssets.pdfDownloadName
} as const;
