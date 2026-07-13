"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw
} from "lucide-react";

type InvestorDeckControlsProps = {
  isFirstSlide: boolean;
  isLastSlide: boolean;
  isAutoplaying: boolean;
  isFullscreen: boolean;
  hideSlideNavigation?: boolean;
  canDownload: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
  onToggleAutoplay: () => void;
  onToggleThumbnails: () => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
};

const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40";

export function InvestorDeckControls({
  isFirstSlide,
  isLastSlide,
  isAutoplaying,
  isFullscreen,
  hideSlideNavigation = false,
  canDownload,
  onPrevious,
  onNext,
  onRestart,
  onToggleAutoplay,
  onToggleThumbnails,
  onToggleFullscreen,
  onDownload
}: InvestorDeckControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {!hideSlideNavigation ? (
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrevious} disabled={isFirstSlide} className={iconButtonClass} aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={onNext} disabled={isLastSlide} className={iconButtonClass} aria-label="Next slide">
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={onRestart} className={iconButtonClass} aria-label="Restart presentation at slide 1">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        {hideSlideNavigation ? (
          <button type="button" onClick={onRestart} className={iconButtonClass} aria-label="Restart presentation at slide 1">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          onClick={onToggleAutoplay}
          className={iconButtonClass}
          aria-label={isAutoplaying ? "Pause autoplay" : "Start autoplay"}
          aria-pressed={isAutoplaying}
        >
          {isAutoplaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </button>
        <button type="button" onClick={onToggleThumbnails} className={iconButtonClass} aria-label="Open slide thumbnails">
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={iconButtonClass}
          aria-label={isFullscreen ? "Exit full screen" : "Open full screen presentation"}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
        </button>
        {canDownload ? (
          <button type="button" onClick={onDownload} className={iconButtonClass} aria-label="Download investor presentation PDF">
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
