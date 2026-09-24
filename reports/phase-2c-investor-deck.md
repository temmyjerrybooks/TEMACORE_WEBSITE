# Phase 2C — approved investor deck integration

Validation date: 24 September 2026. Branch: `feat/investor-deck-2026`.

## Implementation and source authority

1. **Previous implementation:** `/investors` uses the existing Next.js/React custom image presentation viewer, a 15-entry TypeScript manifest, WebP slides, and a public PDF download. It is not a PDF iframe or third-party embed. Live baseline screenshots were captured at 1440 and 390 pixels; both passed geometry/control checks.
2. **Integration:** rendered the approved PDF directly into 15 lossless 2560 × 1440 WebP slides. Each decoded image is pixel-identical to its PDF raster. Preserved the viewer, aspect ratio, controls, transitions, page architecture, and visual system. Updated only conflicting surrounding positioning copy and metadata.
3. **Changed implementation files:** `src/lib/investor-deck.ts`, `src/app/investors/page.tsx`, `src/components/investors/investor-deck-viewer.tsx`. Added asset provenance, investor verification scripts, and this report. No unrelated website pages, analytics backend, dependencies, or lockfile changed.
4. **Asset hygiene:** removed the obsolete 15 slides, duplicate cover, and old PDF from `public/investor-deck`. Replaced them with 15 slides and `TEMACORE_Investor_Deck_2026.pdf` under `2026-c195ba3c/`. Old asset URLs return 404 in the local production build. Source and archive files outside production were preserved. No PPTX, working screenshots, CRM, investor rankings, or personal investor lists were added to public assets.
5. **Slide count:** exactly 15, sequentially ordered, with the existing 16:9 dimensions.
6. **Content parity:** all 15 PPTX/PDF slide pairs match after normalizing text extraction whitespace/punctuation. Slide 7 and 13 PDF extraction splits some words, but normalized content is identical. No content or market estimates were rewritten. The provided `(1)` files were used because similarly named files without that suffix differ.

Approved source hashes:

- PPTX: `f8e7516f0b83e408aa07cbc49e81d0e01e0d289e3d882488824508d3f2e9715f`
- PDF: `c195ba3c4d6f0f60e74434fd9505b2b077661e9f6d83f3adb46453d33db40f61`

The editable source remains in the supplied Downloads location. Full per-file evidence is in `investor-deck-2026-assets.json`.

## Responsive and interaction verification

7. **Desktop:** passed at 1440, 1280, and 1024 pixels, all 15 slides at each width.
8. **Tablet:** passed at 768 pixels, all 15 slides and touch swipe.
9. **Mobile:** passed at 390 and 375 pixels, all 15 slides at each width, touch swipe, and reduced motion at 375 pixels. No horizontal overflow or newly clipped slide content.

The browser script exercises all 15 slides at each width, checks loaded dimensions, 16:9 containment, viewport overflow, labelled 44-pixel controls, keyboard navigation, thumbnails, and restart. It additionally checks swipes at tablet/mobile widths, fullscreen, autoplay start/pause, actual PDF download hash, and the email CTA. Local screenshots and baseline screenshots are kept outside production in ignored `reports/browser-phase2c/`.

10. **Metadata:** investor title is `Investor Overview: Vertical AI & InsurTech` with the existing site title template. Description positions TEMACORE around vertical AI, InsurTech, FinTech, and workflow infrastructure. Canonical remains `https://www.temacore.com/investors`. Existing noindex/nofollow/noarchive intent is retained, and the investor URL remains absent from the sitemap. Open Graph and Twitter metadata use the company logo instead of a cover containing fundraising figures. No page JSON-LD was present in the rendered investor page, and no schema was added.
11. **Download:** the updated PDF is byte-for-byte identical to the approved reference; filename is `TEMACORE_Investor_Deck_2026.pdf`. No editable presentation is publicly exposed.
12. **Accessibility:** slide alt text now identifies the slide number and subject. Existing labelled controls, keyboard navigation, focus outlines, touch target sizes, and reduced-motion styling are preserved. This remains an image-based deck: alt text describes slide subjects, not every sentence. Full slide text is available in the source PDF; this is not a claim of full accessibility certification.
13. **Performance:** public deck assets decrease from 8,017,911 to 5,601,316 bytes (30.14% smaller). Slides total 4,774,984 bytes; PDF is 826,332 bytes. Main slides bypass a second lossy Next.js re-encode, preserving fine text and using the same URL as adjacent-slide preloads. First-slide priority, adjacent preloads, and thumbnail loading remain. Versioned URLs prevent stale deck cache reuse. No runtime dependency or new JavaScript provider was added. This byte comparison is not a measured mobile latency benchmark.
14. **Analytics:** existing nine events and analytics backend remain unchanged. QA intercepts the event endpoint and verifies emitted names without recording test browsing in production analytics. Contact CTA remains `mailto:info@temacore.com`; the test prevents opening an email client.
15. **Checks:** clean locked dependency install (`npm.cmd ci --ignore-scripts`) succeeded; `npm.cmd test` passed 9/9; `npm.cmd run typecheck` passed; `npm.cmd run lint` passed. All 16 served assets match approved hashes, obsolete paths return 404, and sitemap exclusion passes. Browser verification passed across all six widths (90 slide/viewport combinations), with zero console/runtime/hydration errors or HTTP asset failures. All nine existing analytics events were observed. Initial mobile swipe timeout was resolved by centering the stage before the test touch; the targeted phone rerun passed without changing viewer behavior. The adjusted browser script also passed syntax and targeted lint checks.
16. **Production build:** `npm.cmd run build` passed, including compilation, TypeScript, all 44 generated pages, and build tracing.
17. **Commit:** the delivery message provides the exact final hash. This report is included in that commit on the dedicated branch.
18. **Preview:** local production verification at `http://localhost:3100/investors`. No hosted preview has been published. Production remains unchanged until deployment.
19. **Remaining limitations:** source slide 5 has tight title/subtitle spacing and `Risk Signals*` without an explanatory footnote visible on that slide. Small source footnotes on slides 7 and 13 are difficult to read at phone widths; fullscreen and the PDF provide enlargement. These approved-source details were preserved, not redesigned. Dependency installation reports 8 existing vulnerabilities (1 moderate, 6 high, 1 critical); dependency updates are outside this deck-only change and the lockfile is unchanged. Browser emulation does not replace physical iOS/Android device testing.
20. **Status:** **READY FOR PHASE 2D** ? implementation validated for review/deployment. No merge, production deployment, or Phase 2D work performed. Live replacement remains a release step; the local production build serves only the approved updated deck.

## Slide-by-slide review

Every row has matching PPTX/PDF normalized content and pixel-identical lossless export. Contact-sheet visual inspection covered all 15 slides, with enlarged inspection of slides 5, 7, 13, and 14. Direct rasterization preserves titles, subtitles, numbers, labels, illustrations, card/chart placement, footer, numbering, and spacing exactly as supplied.

| Slide | Approved content checked | Result |
| --- | --- | --- |
| 1 | AI-first thesis; $3K–$5K monthly company revenue, not MRR | Source parity |
| 2 | Vision and strategic direction | Source parity |
| 3 | Operational problem | Source parity |
| 4 | TEMACORE solution | Source parity |
| 5 | Life and General Insurance OS; AI Assist development label | Source parity; inherited spacing/asterisk noted |
| 6 | Shared AI and technology architecture | Source parity |
| 7 | Six adjacent market anchors and Grand View Research source citation | Source parity |
| 8 | Business model | Source parity |
| 9 | Traction and monthly company revenue wording | Source parity |
| 10 | Competitive landscape | Source parity |
| 11 | Go-to-market strategy | Source parity |
| 12 | Product and expansion roadmap | Source parity |
| 13 | 18-month value-creation plan and management caveat; no old revenue forecasts | Source parity |
| 14 | $1.25M raise; 35/15/18/10/8/14 percent allocations sum to 100% | Source parity |
| 15 | Closing vertical-AI investment thesis and company contact | Source parity |

Slide 7 preserves the six directional anchors: $24.5B Agentic AI (2030), $155.2B Enterprise AI (2030), $152.4B InsurTech (2030), $695.8B BPO (2033), $44.7B intelligent process automation (2030), and $949.4B FinTech-as-a-Service (2030). They were not summed into a TAM or independently updated.

Browser evidence: `investor-deck-2026-browser.json`. Commands: `node scripts/investor-browser-check.mjs https://www.temacore.com reports/browser-phase2c/live-before --baseline`; full local run against port 3100; targeted rerun with `INVESTOR_QA_WIDTHS=390,375` into `reports/browser-phase2c/mobile`. All retained screenshot sets remain local and ignored by Git.
