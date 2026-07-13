"use client";

import Image from "next/image";
import { X } from "lucide-react";
import {
  whitepaperPageHeight,
  whitepaperPageWidth,
  type WhitepaperPage
} from "@/lib/whitepaper";

type WhitepaperReaderThumbnailsProps = {
  pages: WhitepaperPage[];
  activeIndex: number;
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
};

export function WhitepaperReaderThumbnails({
  pages,
  activeIndex,
  isOpen,
  isFullscreen,
  onClose,
  onSelect
}: WhitepaperReaderThumbnailsProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 max-h-[78%] overflow-y-auto border-t border-white/15 bg-footer/95 p-4 backdrop-blur-xl md:p-6"
      role="region"
      aria-labelledby="whitepaper-page-overview-title"
      style={isFullscreen ? { paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" } : undefined}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p id="whitepaper-page-overview-title" className="text-sm font-black text-white">
          Page overview
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close whitepaper thumbnails"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {pages.map((page, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Open page ${page.id}`}
              aria-current={active ? "page" : undefined}
              className={`group overflow-hidden rounded-md border text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                active ? "border-signal bg-white/10" : "border-white/15 hover:border-white/50"
              }`}
            >
              <div
                className="relative bg-ink"
                style={{ aspectRatio: `${whitepaperPageWidth} / ${whitepaperPageHeight}` }}
              >
                <Image
                  src={page.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, 45vw"
                  loading="lazy"
                  className="object-contain"
                />
              </div>
              <span className="block px-3 py-2 text-xs font-bold text-white">Page {page.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
