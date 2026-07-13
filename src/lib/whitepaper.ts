export const whitepaperPageCount = 17;
export const whitepaperPageWidth = 1547;
export const whitepaperPageHeight = 2002;
export const whitepaperPageAspectRatio = whitepaperPageWidth / whitepaperPageHeight;

export type WhitepaperPage = {
  id: number;
  src: string;
  alt: string;
};

export const whitepaperPages: WhitepaperPage[] = Array.from(
  { length: whitepaperPageCount },
  (_, index) => {
    const id = index + 1;
    const number = String(id).padStart(2, "0");

    return {
      id,
      src: `/whitepaper/page-${number}.webp`,
      alt: `Temacore Connected Operations Intelligence whitepaper page ${id} of ${whitepaperPageCount}`
    };
  }
);

export const whitepaperAssets = {
  ready: true,
  coverSrc: "/whitepaper/cover.webp",
  pdfSrc: "/whitepaper/temacore-connected-operations-intelligence-whitepaper.pdf",
  pdfAvailable: true
} as const;

export const whitepaperAssetRequirements = {
  directory: "public/whitepaper",
  dimensions: `${whitepaperPageWidth}x${whitepaperPageHeight}`,
  pageFiles: whitepaperPages.map((page) => page.src.replace("/whitepaper/", "")),
  coverFile: "cover.webp",
  pdfFile: "temacore-connected-operations-intelligence-whitepaper.pdf",
  manifestFile: "whitepaper-manifest.json"
} as const;
