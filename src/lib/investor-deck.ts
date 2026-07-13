export const investorDeckSlideCount = 15;
export const investorDeckSlideWidth = 2560;
export const investorDeckSlideHeight = 1440;

export type InvestorDeckSlide = {
  id: number;
  src: string;
  alt: string;
};

export const investorDeckSlides: InvestorDeckSlide[] = Array.from(
  { length: investorDeckSlideCount },
  (_, index) => {
    const id = index + 1;
    const number = String(id).padStart(2, "0");

    return {
      id,
      src: `/investor-deck/slide-${number}.webp`,
      alt: `Temacore investor presentation slide ${id} of ${investorDeckSlideCount}`
    };
  }
);

export const investorDeckAssets = {
  ready: true,
  coverSrc: "/investor-deck/cover.webp",
  pdfSrc: "/investor-deck/temacore-investor-deck.pdf",
  pdfAvailable: true
} as const;

export const investorDeckAssetRequirements = {
  directory: "public/investor-deck",
  dimensions: `${investorDeckSlideWidth}x${investorDeckSlideHeight}`,
  slideFiles: investorDeckSlides.map((slide) => slide.src.replace("/investor-deck/", "")),
  coverFile: "cover.webp",
  pdfFile: "temacore-investor-deck.pdf"
} as const;
