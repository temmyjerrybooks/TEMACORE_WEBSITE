"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { InvestorDeckSlide } from "@/lib/investor-deck";

type InvestorDeckThumbnailsProps = {
  slides: InvestorDeckSlide[];
  activeIndex: number;
  isOpen: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onSelect: (index: number) => void;
};

export function InvestorDeckThumbnails({
  slides,
  activeIndex,
  isOpen,
  isFullscreen,
  onClose,
  onSelect
}: InvestorDeckThumbnailsProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 max-h-[72%] overflow-y-auto border-t border-white/15 bg-footer/95 p-4 backdrop-blur-xl md:p-6"
      role="region"
      aria-labelledby="investor-slide-overview-title"
      style={isFullscreen ? { paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" } : undefined}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <p id="investor-slide-overview-title" className="text-sm font-black text-white">
          Slide overview
        </p>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close slide thumbnails"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {slides.map((slide, index) => {
          const active = index === activeIndex;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Open slide ${slide.id}`}
              aria-current={active ? "true" : undefined}
              className={`group overflow-hidden rounded-md border text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                active ? "border-signal bg-white/10" : "border-white/15 hover:border-white/50"
              }`}
            >
              <div className="relative aspect-video bg-ink">
                <Image src={slide.src} alt="" fill sizes="(min-width: 1024px) 16vw, 45vw" loading="lazy" className="object-contain" />
              </div>
              <span className="block px-3 py-2 text-xs font-bold text-white">Slide {slide.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
