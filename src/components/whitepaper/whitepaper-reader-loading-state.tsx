export function WhitepaperReaderLoadingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-footer/45 backdrop-blur-[1px]" aria-live="polite">
      <div className="rounded-md border border-white/15 bg-ink/90 px-4 py-3 text-sm font-bold text-white shadow-xl">
        Loading whitepaper page...
      </div>
    </div>
  );
}
