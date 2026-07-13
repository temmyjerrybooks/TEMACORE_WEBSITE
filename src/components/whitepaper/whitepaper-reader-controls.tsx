"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut
} from "lucide-react";

export type WhitepaperViewMode = "page" | "continuous";
export type WhitepaperFitMode = "page" | "width";

type WhitepaperReaderControlsProps = {
  isFirstPage: boolean;
  isLastPage: boolean;
  isFullscreen: boolean;
  viewMode: WhitepaperViewMode;
  fitMode: WhitepaperFitMode;
  zoom: number;
  canDownload: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReturnToFirstPage: () => void;
  onSetViewMode: (mode: WhitepaperViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitPage: () => void;
  onFitWidth: () => void;
  onToggleThumbnails: () => void;
  onToggleFullscreen: () => void;
  onDownload: () => void;
};

const iconButtonClass =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-md border border-white/20 bg-white/10 px-2 text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40";

const textButtonClass =
  "inline-flex h-11 items-center justify-center rounded-md border border-white/20 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white hover:text-blue001 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function WhitepaperReaderControls({
  isFirstPage,
  isLastPage,
  isFullscreen,
  viewMode,
  fitMode,
  zoom,
  canDownload,
  onPrevious,
  onNext,
  onReturnToFirstPage,
  onSetViewMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitPage,
  onFitWidth,
  onToggleThumbnails,
  onToggleFullscreen,
  onDownload
}: WhitepaperReaderControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button type="button" onClick={onPrevious} disabled={isFirstPage} className={iconButtonClass} aria-label="Previous page">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={onNext} disabled={isLastPage} className={iconButtonClass} aria-label="Next page">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={onReturnToFirstPage} className={iconButtonClass} aria-label="Return to first page">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center gap-1 rounded-md border border-white/15 p-1" aria-label="Whitepaper view mode">
          <button
            type="button"
            onClick={() => onSetViewMode("page")}
            className={`${textButtonClass} h-9 ${viewMode === "page" ? "bg-white text-blue001" : "border-transparent bg-transparent"}`}
            aria-label="Use page view"
            aria-pressed={viewMode === "page"}
          >
            Page
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode("continuous")}
            className={`${textButtonClass} h-9 ${viewMode === "continuous" ? "bg-white text-blue001" : "border-transparent bg-transparent"}`}
            aria-label="Use continuous view"
            aria-pressed={viewMode === "continuous"}
          >
            <List className="mr-1 h-4 w-4" aria-hidden="true" />
            Read
          </button>
        </div>
        <button type="button" onClick={onZoomOut} disabled={zoom <= 0.6} className={iconButtonClass} aria-label="Zoom out">
          <ZoomOut className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={onZoomIn} disabled={zoom >= 2} className={iconButtonClass} aria-label="Zoom in">
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={onResetZoom} className={textButtonClass} aria-label="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={onFitPage}
          className={`${textButtonClass} ${fitMode === "page" && zoom === 1 ? "bg-white text-blue001" : ""}`}
          aria-label="Fit page"
          aria-pressed={fitMode === "page" && zoom === 1}
        >
          Fit page
        </button>
        <button
          type="button"
          onClick={onFitWidth}
          className={`${textButtonClass} ${fitMode === "width" && zoom === 1 ? "bg-white text-blue001" : ""}`}
          aria-label="Fit width"
          aria-pressed={fitMode === "width" && zoom === 1}
        >
          Fit width
        </button>
        <button type="button" onClick={onToggleThumbnails} className={iconButtonClass} aria-label="Open whitepaper thumbnails">
          <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className={iconButtonClass}
          aria-label={isFullscreen ? "Exit full screen" : "Open whitepaper in full screen"}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
        </button>
        {canDownload ? (
          <button type="button" onClick={onDownload} className={iconButtonClass} aria-label="Download whitepaper PDF">
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
