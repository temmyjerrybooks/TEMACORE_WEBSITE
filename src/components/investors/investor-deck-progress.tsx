type InvestorDeckProgressProps = {
  activeSlide: number;
  slideCount: number;
};

export function InvestorDeckProgress({ activeSlide, slideCount }: InvestorDeckProgressProps) {
  const value = Math.round((activeSlide / slideCount) * 100);

  return (
    <div className="grid gap-2" aria-label={`Presentation progress: slide ${activeSlide} of ${slideCount}`}>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={slideCount}
        aria-valuenow={activeSlide}
        aria-valuetext={`Slide ${activeSlide} of ${slideCount}`}
      >
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-right text-xs font-bold tabular-nums text-blue-100/80" aria-live="polite">
        {activeSlide} / {slideCount}
      </p>
    </div>
  );
}
