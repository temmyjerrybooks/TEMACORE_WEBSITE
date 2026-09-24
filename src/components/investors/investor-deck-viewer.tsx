"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, Mail, TriangleAlert } from "lucide-react";
import { investorDeckAssets, investorDeckSlideCount, investorDeckSlides } from "@/lib/investor-deck";
import { site } from "@/lib/data";
import { trackInvestorDeckEvent } from "./analytics";
import { InvestorDeckControls } from "./investor-deck-controls";
import { InvestorDeckLoadingState } from "./investor-deck-loading-state";
import { InvestorDeckProgress } from "./investor-deck-progress";
import { InvestorDeckThumbnails } from "./investor-deck-thumbnails";

const autoplayIntervalMs = 8000;

const fullscreenPreviousStyle: CSSProperties = {
  left: "max(0.75rem, env(safe-area-inset-left, 0px))"
};

const fullscreenNextStyle: CSSProperties = {
  right: "max(0.75rem, env(safe-area-inset-right, 0px))"
};

const fullscreenNavigationButtonClass =
  "pointer-events-auto absolute top-1/2 z-30 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-footer/85 text-white shadow-[0_12px_30px_rgba(11,16,32,0.34)] backdrop-blur transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 md:h-16 md:w-16";

type NavigationSource = "manual" | "thumbnail" | "restart" | "autoplay";

type WebkitFullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("button, a, input, textarea, select, [contenteditable='true']"));
}

function getFullscreenElement() {
  const fullscreenDocument = document as WebkitFullscreenDocument;

  return document.fullscreenElement ?? fullscreenDocument.webkitFullscreenElement ?? null;
}

async function exitFullscreen() {
  const fullscreenDocument = document as WebkitFullscreenDocument;
  const exit = document.exitFullscreen ?? fullscreenDocument.webkitExitFullscreen;

  if (!exit) {
    throw new Error("Full screen is not available in this browser.");
  }

  await Promise.resolve(exit.call(document));
}

async function requestFullscreen(element: HTMLElement) {
  const fullscreenElement = element as WebkitFullscreenElement;
  const request = element.requestFullscreen ?? fullscreenElement.webkitRequestFullscreen;

  if (!request) {
    throw new Error("Full screen is not available in this browser.");
  }

  await Promise.resolve(request.call(element));
}

export function InvestorDeckViewer() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const hasTrackedStart = useRef(false);
  const hasTrackedHalfway = useRef(false);
  const hasTrackedCompletion = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const fullscreenWasActive = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(false);
  const [isAutoplaying, setIsAutoplaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedSlideId, setLoadedSlideId] = useState<number | null>(null);
  const [failedSlides, setFailedSlides] = useState<Set<number>>(() => new Set());
  const [fullscreenMessage, setFullscreenMessage] = useState("");
  const activeSlide = investorDeckSlides[activeIndex];
  const activeSlideNumber = activeIndex + 1;
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === investorDeckSlideCount - 1;
  const currentSlideFailed = failedSlides.has(activeIndex);
  const isCurrentSlideLoaded = loadedSlideId === activeSlide.id;

  const trackStart = useCallback(() => {
    if (hasTrackedStart.current) {
      return;
    }

    hasTrackedStart.current = true;
    trackInvestorDeckEvent("investor_deck_started", activeSlideNumber);
  }, [activeSlideNumber]);

  const goToSlide = useCallback(
    (nextIndex: number, source: NavigationSource) => {
      const boundedIndex = Math.max(0, Math.min(investorDeckSlideCount - 1, nextIndex));

      if (source !== "autoplay") {
        setIsAutoplaying(false);
        trackStart();
      }

      if (source === "autoplay" && boundedIndex === investorDeckSlideCount - 1) {
        setIsAutoplaying(false);
      }

      if (source === "thumbnail") {
        setIsThumbnailOpen(false);
      }

      setFullscreenMessage("");
      setActiveIndex(boundedIndex);
    },
    [trackStart]
  );

  useEffect(() => {
    trackInvestorDeckEvent("investor_deck_page_view", 1);
  }, []);

  useEffect(() => {
    const neighboringIndexes = [activeIndex - 1, activeIndex + 1].filter(
      (index) => index >= 0 && index < investorDeckSlideCount
    );

    neighboringIndexes.forEach((index) => {
      const preloadImage = new window.Image();
      preloadImage.src = investorDeckSlides[index].src;
    });
  }, [activeIndex]);

  useEffect(() => {
    trackInvestorDeckEvent("investor_deck_slide_viewed", activeSlideNumber);

    if (activeSlideNumber >= Math.ceil(investorDeckSlideCount / 2) && !hasTrackedHalfway.current) {
      hasTrackedHalfway.current = true;
      trackInvestorDeckEvent("investor_deck_halfway_reached", activeSlideNumber);
    }

    if (isLastSlide && !hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      trackInvestorDeckEvent("investor_deck_completed", activeSlideNumber);
    }
  }, [activeSlideNumber, isLastSlide]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAutoplaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = getFullscreenElement() === viewerRef.current;

      if (fullscreenWasActive.current && !active) {
        setIsAutoplaying(false);
      }

      fullscreenWasActive.current = active;
      setIsFullscreen(active);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isThumbnailOpen) {
          event.preventDefault();
          setIsThumbnailOpen(false);
          return;
        }

        if (getFullscreenElement() === viewerRef.current) {
          event.preventDefault();
          void exitFullscreen().catch(() => undefined);
          return;
        }
      }

      if (isInteractiveTarget(event.target)) {
        return;
      }

      if (event.key === "ArrowRight" || event.code === "Space") {
        event.preventDefault();
        goToSlide(activeIndex + 1, "manual");
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSlide(activeIndex - 1, "manual");
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0, "manual");
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goToSlide(investorDeckSlideCount - 1, "manual");
        return;
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, goToSlide, isThumbnailOpen]);

  useEffect(() => {
    if (!isAutoplaying) {
      return;
    }

    if (isLastSlide) {
      return;
    }

    const timeout = window.setTimeout(() => {
      goToSlide(activeIndex + 1, "autoplay");
    }, autoplayIntervalMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeIndex, goToSlide, isAutoplaying, isLastSlide]);

  const handleToggleAutoplay = () => {
    if (isAutoplaying) {
      setIsAutoplaying(false);
      return;
    }

    trackStart();
    trackInvestorDeckEvent("investor_deck_autoplay_started", activeSlideNumber);

    if (isLastSlide) {
      setActiveIndex(0);
      hasTrackedCompletion.current = false;
    }

    setIsAutoplaying(true);
  };

  const handleToggleFullscreen = async () => {
    trackStart();

    if (getFullscreenElement() === viewerRef.current) {
      await exitFullscreen().catch(() => setFullscreenMessage("Unable to exit full screen."));
      return;
    }

    if (!viewerRef.current) {
      setFullscreenMessage("Full screen is not available in this browser.");
      return;
    }

    await requestFullscreen(viewerRef.current).then(
      () => trackInvestorDeckEvent("investor_deck_fullscreen_opened", activeSlideNumber),
      () => setFullscreenMessage("Full screen could not be opened in this browser.")
    );
  };

  const handleDownload = () => {
    trackInvestorDeckEvent("investor_deck_pdf_downloaded", activeSlideNumber);
    const link = document.createElement("a");
    link.href = investorDeckAssets.pdfSrc;
    link.download = investorDeckAssets.pdfDownloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleContact = () => {
    trackInvestorDeckEvent("investor_deck_contact_clicked", activeSlideNumber);
  };

  return (
    <section id="investor-presentation" aria-labelledby="investor-presentation-title" className="scroll-mt-28">
      <h2 id="investor-presentation-title" className="sr-only">
        Temacore investor presentation
      </h2>
      <div
        ref={viewerRef}
        data-testid="investor-deck-fullscreen-root"
        className="investor-deck-fullscreen-root relative overflow-hidden rounded-lg border border-white/15 bg-footer p-3 shadow-[0_32px_100px_rgba(15,23,42,0.25)] md:p-5"
      >
        <div
          id="investor-deck-slide-stage"
          data-testid="investor-deck-stage"
          className="investor-deck-stage relative overflow-hidden rounded-md bg-ink"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(event) => {
            const touch = event.changedTouches[0];
            const start = touchStart.current;
            touchStart.current = null;

            if (!start) {
              return;
            }

            const horizontalDistance = touch.clientX - start.x;
            const verticalDistance = touch.clientY - start.y;

            if (Math.abs(horizontalDistance) < 48 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
              return;
            }

            goToSlide(activeIndex + (horizontalDistance < 0 ? 1 : -1), "manual");
          }}
        >
          <div className="investor-deck-slide-frame relative aspect-video w-full">
            {currentSlideFailed ? (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="max-w-md rounded-md border border-white/15 bg-white/5 p-6 text-white">
                  <TriangleAlert className="mx-auto h-6 w-6 text-warm" aria-hidden="true" />
                  <p className="mt-4 text-sm font-bold">This presentation slide is currently unavailable.</p>
                  {process.env.NODE_ENV === "development" ? (
                    <p className="mt-2 text-xs leading-5 text-blue-100/75">Expected asset: {activeSlide.src}</p>
                  ) : null}
                </div>
              </div>
            ) : (
              <Image
                key={activeSlide.id}
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                unoptimized
                priority={activeIndex === 0}
                sizes="(min-width: 1280px) 1120px, (min-width: 768px) 92vw, 100vw"
                className="object-contain motion-safe:transition-opacity motion-safe:duration-300"
                onLoad={() => setLoadedSlideId(activeSlide.id)}
                onError={() => {
                  setFailedSlides((current) => new Set(current).add(activeIndex));
                }}
              />
            )}
            {!isCurrentSlideLoaded && !currentSlideFailed ? <InvestorDeckLoadingState /> : null}
          </div>

          {isFullscreen && !isThumbnailOpen ? (
            <div className="pointer-events-none absolute inset-0 z-30" role="group" aria-label="Full screen slide navigation">
              <button
                type="button"
                onClick={() => goToSlide(activeIndex - 1, "manual")}
                disabled={isFirstSlide}
                className={fullscreenNavigationButtonClass}
                style={fullscreenPreviousStyle}
                aria-label="Previous slide"
                aria-controls="investor-deck-slide-stage"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeIndex + 1, "manual")}
                disabled={isLastSlide}
                className={fullscreenNavigationButtonClass}
                style={fullscreenNextStyle}
                aria-label="Next slide"
                aria-controls="investor-deck-slide-stage"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="investor-deck-normal-controls mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <InvestorDeckProgress activeSlide={activeSlideNumber} slideCount={investorDeckSlideCount} />
          <InvestorDeckControls
            isFirstSlide={isFirstSlide}
            isLastSlide={isLastSlide}
            isAutoplaying={isAutoplaying}
            isFullscreen={isFullscreen}
            hideSlideNavigation={isFullscreen}
            canDownload={investorDeckAssets.pdfAvailable}
            onPrevious={() => goToSlide(activeIndex - 1, "manual")}
            onNext={() => goToSlide(activeIndex + 1, "manual")}
            onRestart={() => {
              hasTrackedCompletion.current = false;
              goToSlide(0, "restart");
            }}
            onToggleAutoplay={handleToggleAutoplay}
            onToggleThumbnails={() => {
              trackStart();
              setIsAutoplaying(false);
              setIsThumbnailOpen((open) => !open);
            }}
            onToggleFullscreen={() => {
              void handleToggleFullscreen();
            }}
            onDownload={handleDownload}
          />
        </div>

        {fullscreenMessage ? <p className="mt-3 text-xs font-semibold text-blue-100/80">{fullscreenMessage}</p> : null}

        <InvestorDeckThumbnails
          slides={investorDeckSlides}
          activeIndex={activeIndex}
          isOpen={isThumbnailOpen}
          isFullscreen={isFullscreen}
          onClose={() => setIsThumbnailOpen(false)}
          onSelect={(index) => goToSlide(index, "thumbnail")}
        />
      </div>

      {isLastSlide ? (
        <div className="mt-6 flex flex-col gap-5 rounded-lg border border-line bg-paper p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-black text-ink">Interested in learning more about Temacore?</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Contact the Temacore team or restart the presentation at any time.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${site.email}`}
              onClick={handleContact}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue001 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue002 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact Temacore
            </a>
            <button
              type="button"
              onClick={() => {
                hasTrackedCompletion.current = false;
                goToSlide(0, "restart");
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue001/20 bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
            >
              Restart Presentation
            </button>
            {investorDeckAssets.pdfAvailable ? (
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-blue001/20 bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Investor Deck
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
