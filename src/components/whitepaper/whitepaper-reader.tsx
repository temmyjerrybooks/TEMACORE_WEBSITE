"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Mail, TriangleAlert } from "lucide-react";
import {
  whitepaperAssets,
  whitepaperPageAspectRatio,
  whitepaperPageCount,
  whitepaperPages
} from "@/lib/whitepaper";
import { site } from "@/lib/data";
import { trackWhitepaperEvent } from "./analytics";
import {
  WhitepaperReaderControls,
  type WhitepaperFitMode,
  type WhitepaperViewMode
} from "./whitepaper-reader-controls";
import { WhitepaperReaderLoadingState } from "./whitepaper-reader-loading-state";
import { WhitepaperReaderProgress } from "./whitepaper-reader-progress";
import { WhitepaperReaderThumbnails } from "./whitepaper-reader-thumbnails";

type NavigationSource = "manual" | "thumbnail" | "restart" | "continuous";

type WebkitFullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

type WebkitFullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

type StageSize = {
  width: number;
  height: number;
};

const minimumZoom = 0.6;
const maximumZoom = 2;
const zoomStep = 0.2;

const fullscreenPreviousStyle: CSSProperties = {
  left: "max(0.75rem, env(safe-area-inset-left, 0px))"
};

const fullscreenNextStyle: CSSProperties = {
  right: "max(0.75rem, env(safe-area-inset-right, 0px))"
};

const fullscreenNavigationButtonClass =
  "pointer-events-auto absolute top-1/2 z-30 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-footer/85 text-white shadow-[0_12px_30px_rgba(11,16,32,0.34)] backdrop-blur transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 md:h-16 md:w-16";

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

export function WhitepaperReader() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageStageRef = useRef<HTMLDivElement>(null);
  const continuousStageRef = useRef<HTMLDivElement>(null);
  const continuousPageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasTrackedStart = useRef(false);
  const hasTrackedHalfway = useRef(false);
  const hasTrackedCompletion = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const pendingContinuousScrollIndex = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<WhitepaperViewMode>("page");
  const [fitMode, setFitMode] = useState<WhitepaperFitMode>("page");
  const [zoom, setZoom] = useState(1);
  const [isThumbnailOpen, setIsThumbnailOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadedPages, setLoadedPages] = useState<Set<number>>(() => new Set());
  const [failedPages, setFailedPages] = useState<Set<number>>(() => new Set());
  const [fullscreenMessage, setFullscreenMessage] = useState("");
  const [stageSize, setStageSize] = useState<StageSize>({ width: 960, height: 720 });
  const activePageNumber = activeIndex + 1;
  const isFirstPage = activeIndex === 0;
  const isLastPage = activeIndex === whitepaperPageCount - 1;

  const fitWidth = useMemo(() => {
    const horizontalSpace = Math.max(240, stageSize.width - 32);
    const verticalSpace = Math.max(320, stageSize.height - 32);
    const readableWidth = Math.min(horizontalSpace, isFullscreen ? horizontalSpace : 960);

    if (fitMode === "width") {
      return readableWidth;
    }

    return Math.min(readableWidth, verticalSpace * whitepaperPageAspectRatio);
  }, [fitMode, isFullscreen, stageSize.height, stageSize.width]);

  const displayedPageWidth = Math.max(180, Math.round(fitWidth * zoom));
  const displayedPageHeight = Math.round(displayedPageWidth / whitepaperPageAspectRatio);
  const pageCanvasStyle: CSSProperties = {
    minWidth: Math.max(displayedPageWidth + 32, stageSize.width)
  };

  const trackStart = useCallback((pageNumber = activePageNumber) => {
    if (hasTrackedStart.current) {
      return;
    }

    hasTrackedStart.current = true;
    trackWhitepaperEvent("whitepaper_started", pageNumber);
  }, [activePageNumber]);

  const scrollToContinuousPage = useCallback((index: number) => {
    const page = continuousPageRefs.current[index];

    page?.scrollIntoView({ behavior: "auto", block: "start", inline: "nearest" });
  }, []);

  const goToPage = useCallback(
    (nextIndex: number, source: NavigationSource) => {
      const boundedIndex = Math.max(0, Math.min(whitepaperPageCount - 1, nextIndex));

      if (source !== "continuous") {
        trackStart(boundedIndex + 1);
      }

      if (source === "thumbnail") {
        setIsThumbnailOpen(false);
      }

      setFullscreenMessage("");
      setActiveIndex(boundedIndex);

      if (viewMode === "continuous" && source !== "continuous") {
        pendingContinuousScrollIndex.current = boundedIndex;
        window.requestAnimationFrame(() => scrollToContinuousPage(boundedIndex));
      }
    },
    [scrollToContinuousPage, trackStart, viewMode]
  );

  useEffect(() => {
    trackWhitepaperEvent("whitepaper_page_view", 1);
  }, []);

  useEffect(() => {
    const neighboringIndexes = [activeIndex - 1, activeIndex + 1].filter(
      (index) => index >= 0 && index < whitepaperPageCount
    );

    neighboringIndexes.forEach((index) => {
      const preloadImage = new window.Image();
      preloadImage.src = whitepaperPages[index].src;
    });
  }, [activeIndex]);

  useEffect(() => {
    trackWhitepaperEvent("whitepaper_page_viewed", activePageNumber);

    if (activePageNumber >= Math.ceil(whitepaperPageCount / 2) && !hasTrackedHalfway.current) {
      hasTrackedHalfway.current = true;
      trackWhitepaperEvent("whitepaper_halfway_reached", activePageNumber);
    }

    if (isLastPage && !hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      trackWhitepaperEvent("whitepaper_completed", activePageNumber);
    }
  }, [activePageNumber, isLastPage]);

  useEffect(() => {
    const element = viewMode === "page" ? pageStageRef.current : continuousStageRef.current;

    if (!element) {
      return;
    }

    const updateStageSize = () => {
      const rect = element.getBoundingClientRect();
      setStageSize({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) });
    };

    updateStageSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateStageSize);

      return () => window.removeEventListener("resize", updateStageSize);
    }

    const observer = new ResizeObserver(updateStageSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [isFullscreen, viewMode]);

  useEffect(() => {
    if (viewMode !== "continuous") {
      return;
    }

    const pendingIndex = pendingContinuousScrollIndex.current;

    if (pendingIndex === null) {
      return;
    }

    pendingContinuousScrollIndex.current = null;
    const frame = window.requestAnimationFrame(() => scrollToContinuousPage(pendingIndex));

    return () => window.cancelAnimationFrame(frame);
  }, [scrollToContinuousPage, viewMode]);

  useEffect(() => {
    if (viewMode !== "continuous" || !continuousStageRef.current || typeof IntersectionObserver === "undefined") {
      return;
    }

    const root = continuousStageRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const index = Number((visible.target as HTMLElement).dataset.pageIndex);

        if (!Number.isInteger(index) || index < 0 || index >= whitepaperPageCount) {
          return;
        }

        if (pendingContinuousScrollIndex.current !== null && index !== pendingContinuousScrollIndex.current) {
          return;
        }

        pendingContinuousScrollIndex.current = null;

        if (index > 0) {
          trackStart(index + 1);
        }

        setActiveIndex((current) => (current === index ? current : index));
      },
      { root, threshold: [0.35, 0.55, 0.75] }
    );

    continuousPageRefs.current.forEach((page) => {
      if (page) {
        observer.observe(page);
      }
    });

    return () => observer.disconnect();
  }, [trackStart, viewMode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = getFullscreenElement() === viewerRef.current;
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

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goToPage(activeIndex + 1, "manual");
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToPage(activeIndex - 1, "manual");
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        goToPage(0, "manual");
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goToPage(whitepaperPageCount - 1, "manual");
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        trackStart();
        setZoom((current) => Math.min(maximumZoom, Number((current + zoomStep).toFixed(1))));
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        trackStart();
        setZoom((current) => Math.max(minimumZoom, Number((current - zoomStep).toFixed(1))));
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        trackStart();
        setZoom(1);
        setFitMode("page");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goToPage, isThumbnailOpen, trackStart]);

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
      () => trackWhitepaperEvent("whitepaper_fullscreen_opened", activePageNumber),
      () => setFullscreenMessage("Full screen could not be opened in this browser.")
    );
  };

  const handleSetViewMode = (mode: WhitepaperViewMode) => {
    if (mode === viewMode) {
      return;
    }

    trackStart();
    setIsThumbnailOpen(false);
    setViewMode(mode);
    trackWhitepaperEvent("whitepaper_view_mode_changed", activePageNumber);

    if (mode === "continuous") {
      pendingContinuousScrollIndex.current = activeIndex;
    }
  };

  const handleDownload = () => {
    trackWhitepaperEvent("whitepaper_pdf_downloaded", activePageNumber);
    const link = document.createElement("a");
    link.href = whitepaperAssets.pdfSrc;
    link.download = "temacore-connected-operations-intelligence-whitepaper.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePageLoaded = (pageId: number) => {
    setLoadedPages((current) => new Set(current).add(pageId));
  };

  const handlePageFailed = (pageId: number) => {
    setFailedPages((current) => new Set(current).add(pageId));
  };

  const handleReturnToFirstPage = () => {
    hasTrackedCompletion.current = false;
    goToPage(0, "restart");
  };

  const handleContact = () => {
    trackWhitepaperEvent("whitepaper_contact_clicked", activePageNumber);
  };

  const renderPage = (pageIndex: number, continuous = false) => {
    const page = whitepaperPages[pageIndex];
    const failed = failedPages.has(page.id);
    const loaded = loadedPages.has(page.id);

    return (
      <div
        ref={continuous ? (element) => { continuousPageRefs.current[pageIndex] = element; } : undefined}
        data-page-index={continuous ? pageIndex : undefined}
        className={continuous ? "whitepaper-continuous-page relative shrink-0 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.24)]" : "relative shrink-0 bg-white shadow-[0_18px_55px_rgba(0,0,0,0.3)]"}
        style={{ width: displayedPageWidth, height: displayedPageHeight }}
      >
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink p-6 text-center text-white">
            <div className="max-w-sm rounded-md border border-white/15 bg-white/5 p-6">
              <TriangleAlert className="mx-auto h-6 w-6 text-warm" aria-hidden="true" />
              <p className="mt-4 text-sm font-bold">This whitepaper page is currently unavailable.</p>
              {process.env.NODE_ENV === "development" ? (
                <p className="mt-2 text-xs leading-5 text-blue-100/75">Expected asset: {page.src}</p>
              ) : null}
            </div>
          </div>
        ) : (
          <Image
            src={page.src}
            alt={page.alt}
            fill
            unoptimized
            priority={page.id === 1}
            sizes="(min-width: 1280px) 960px, (min-width: 768px) 86vw, 100vw"
            className="object-contain"
            onLoad={() => handlePageLoaded(page.id)}
            onError={() => handlePageFailed(page.id)}
          />
        )}
        {!loaded && !failed ? <WhitepaperReaderLoadingState /> : null}
      </div>
    );
  };

  return (
    <section id="whitepaper-reader" aria-labelledby="whitepaper-reader-title" className="scroll-mt-28">
      <h2 id="whitepaper-reader-title" className="sr-only">
        Connected Operations Intelligence whitepaper reader
      </h2>
      <p className="sr-only" aria-live="polite">
        Whitepaper page {activePageNumber} of {whitepaperPageCount}
      </p>
      <div
        ref={viewerRef}
        data-testid="whitepaper-reader-fullscreen-root"
        className="whitepaper-reader-fullscreen-root relative overflow-hidden rounded-lg border border-white/15 bg-footer p-3 shadow-[0_32px_100px_rgba(15,23,42,0.25)] md:p-5"
      >
        {viewMode === "page" ? (
          <div
            ref={pageStageRef}
            id="whitepaper-reader-page-stage"
            data-testid="whitepaper-reader-stage"
            className="whitepaper-reader-stage relative flex min-h-[32rem] max-h-[78dvh] overflow-auto rounded-md bg-ink"
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

              goToPage(activeIndex + (horizontalDistance < 0 ? 1 : -1), "manual");
            }}
          >
            <div className="flex min-h-full items-center justify-center p-4" style={pageCanvasStyle}>
              {renderPage(activeIndex)}
            </div>

            {isFullscreen && !isThumbnailOpen ? (
              <div className="pointer-events-none absolute inset-0 z-30" role="group" aria-label="Full screen whitepaper navigation">
                <button
                  type="button"
                  onClick={() => goToPage(activeIndex - 1, "manual")}
                  disabled={isFirstPage}
                  className={fullscreenNavigationButtonClass}
                  style={fullscreenPreviousStyle}
                  aria-label="Previous page"
                  aria-controls="whitepaper-reader-page-stage"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => goToPage(activeIndex + 1, "manual")}
                  disabled={isLastPage}
                  className={fullscreenNavigationButtonClass}
                  style={fullscreenNextStyle}
                  aria-label="Next page"
                  aria-controls="whitepaper-reader-page-stage"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div
            ref={continuousStageRef}
            id="whitepaper-reader-continuous-stage"
            data-testid="whitepaper-reader-stage"
            className="whitepaper-reader-stage relative flex min-h-[32rem] max-h-[78dvh] flex-col items-center gap-6 overflow-auto rounded-md bg-ink p-4"
          >
            {whitepaperPages.map((_, index) => renderPage(index, true))}
          </div>
        )}

        <div className="whitepaper-reader-normal-controls mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <WhitepaperReaderProgress activePage={activePageNumber} pageCount={whitepaperPageCount} />
          <WhitepaperReaderControls
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
            isFullscreen={isFullscreen}
            viewMode={viewMode}
            fitMode={fitMode}
            zoom={zoom}
            canDownload={whitepaperAssets.pdfAvailable}
            onPrevious={() => goToPage(activeIndex - 1, "manual")}
            onNext={() => goToPage(activeIndex + 1, "manual")}
            onReturnToFirstPage={handleReturnToFirstPage}
            onSetViewMode={handleSetViewMode}
            onZoomIn={() => {
              trackStart();
              setZoom((current) => Math.min(maximumZoom, Number((current + zoomStep).toFixed(1))));
            }}
            onZoomOut={() => {
              trackStart();
              setZoom((current) => Math.max(minimumZoom, Number((current - zoomStep).toFixed(1))));
            }}
            onResetZoom={() => {
              trackStart();
              setZoom(1);
              setFitMode("page");
            }}
            onFitPage={() => {
              trackStart();
              setZoom(1);
              setFitMode("page");
            }}
            onFitWidth={() => {
              trackStart();
              setZoom(1);
              setFitMode("width");
            }}
            onToggleThumbnails={() => {
              trackStart();
              setIsThumbnailOpen((open) => !open);
            }}
            onToggleFullscreen={() => {
              void handleToggleFullscreen();
            }}
            onDownload={handleDownload}
          />
        </div>

        {fullscreenMessage ? <p className="mt-3 text-xs font-semibold text-blue-100/80">{fullscreenMessage}</p> : null}

        <WhitepaperReaderThumbnails
          pages={whitepaperPages}
          activeIndex={activeIndex}
          isOpen={isThumbnailOpen}
          isFullscreen={isFullscreen}
          onClose={() => setIsThumbnailOpen(false)}
          onSelect={(index) => goToPage(index, "thumbnail")}
        />
      </div>

      {isLastPage ? (
        <div className="mt-6 flex flex-col gap-5 rounded-lg border border-line bg-paper p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-black text-ink">Continue the conversation with Temacore</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Discuss partnerships, platform implementation, accelerator opportunities or investment conversations with the Temacore team.
            </p>
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
            <Link
              href="/platforms"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue001/20 bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
            >
              Explore Our Platforms
            </Link>
            <Link
              href="/investors"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue001/20 bg-white px-5 py-3 text-sm font-bold text-blue001 transition hover:border-blue001 hover:bg-blue001 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue001"
            >
              View Investor Presentation
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
