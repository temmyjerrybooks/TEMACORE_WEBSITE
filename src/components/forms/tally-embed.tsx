"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export function TallyEmbed() {
  useEffect(() => {
    const scriptUrl = "https://tally.so/widgets/embed.js";
    const loadEmbeds = () => {
      if (window.Tally) {
        window.Tally.loadEmbeds();
        return;
      }

      document
        .querySelectorAll<HTMLIFrameElement>("iframe[data-tally-src]:not([src])")
        .forEach((iframe) => {
          iframe.src = iframe.dataset.tallySrc ?? "";
        });
    };

    if (window.Tally) {
      loadEmbeds();
      return;
    }

    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.onload = loadEmbeds;
      script.onerror = loadEmbeds;
      document.body.appendChild(script);
    } else {
      loadEmbeds();
    }
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white p-2 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <iframe
        data-tally-src="https://tally.so/embed/GxbyQL?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="260"
        title="Contact Us"
        className="w-full"
      />
    </div>
  );
}
