type WhitepaperReaderProgressProps = {
  activePage: number;
  pageCount: number;
};

export function WhitepaperReaderProgress({ activePage, pageCount }: WhitepaperReaderProgressProps) {
  const value = Math.round((activePage / pageCount) * 100);

  return (
    <div className="grid min-w-28 gap-2" aria-label={`Whitepaper progress: page ${activePage} of ${pageCount}`}>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={pageCount}
        aria-valuenow={activePage}
        aria-valuetext={`Page ${activePage} of ${pageCount}`}
      >
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-right text-xs font-bold tabular-nums text-blue-100/80" aria-live="polite">
        {activePage} / {pageCount}
      </p>
    </div>
  );
}
