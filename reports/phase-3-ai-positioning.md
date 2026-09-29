# Phase 3: AI Entity, SEO and LLM Positioning

Implementation date: 28-29 September 2026. Branch: `feat/phase-3-ai-positioning`. Base: `60987e740e8c83a3e92efc57dda7c941e35171d4` (approved Phase 1 and investor deck release).

## Status and release boundary

Completed and validated for review. This branch is for review. Main has not been changed, and no production search submission has been made. The delivery message supplies the final commit hash. Merge/deployment requires explicit approval under the Phase 3 brief.

## Routes audited

The live baseline inspected 29 routes (28 public/indexable sitemap pages plus the deliberately noindex investor page), robots.txt, sitemap.xml, llms.txt, internal links/anchors, and the protected admin entry point. Baseline: `phase-3-live-before.json`.

- `/`
- `/about`
- `/services`
- `/platforms`
- `/ai`
- `/insurtech`
- `/whitepaper`
- `/founder`
- `/industries`
- `/venture`
- `/how-it-works`
- `/technology`
- `/careers`
- `/client-intake`
- `/project-request`
- `/contact`
- `/services/business-process-outsourcing`
- `/services/remote-teams`
- `/services/customer-support`
- `/services/back-office-operations`
- `/services/custom-application-development`
- `/services/business-automation`
- `/services/virtual-assistant-services`
- `/services/lead-generation-appointment-setting`
- `/services/mobile-application-development`
- `/services/crm-development`
- `/services/client-portal-development`
- `/services/data-reporting-dashboards`
- `/investors`

There is no standalone /fintech route or blog route in this codebase. Financial operations is represented on existing pages, now with the contextual /industries#financial-operations anchor. /ai already existed; it was strengthened rather than duplicated.

## Problems found

- The homepage title repeated the brand through the inherited title template. AI-first messaging was already present, but hero copy and some ecosystem descriptions still put BPO beside the primary technology verticals.
- About lacked contextual AI/insurance/financial links. Some global and whitepaper wrapper copy elevated managed BPO over the parent technology identity.
- Platforms and Venture repeated the same generic description. Contact/intake/how-it-works metadata still led with remote teams or service delivery. Two card groups used sibling H2s below a section H2.
- Organization/WebSite schema had no stable identifiers, legalName or public founder relationship. The founder page omitted social images.
- Sitemap lastModified values claimed every page changed whenever the sitemap was generated. Existing IndexNow code could accept arbitrary URLs and had no usable ownership proof route or operator workflow.

## Implemented copy and entity hierarchy

The canonical parent definition in site.description now says Temacore builds vertical AI, enterprise software, and intelligent workflow infrastructure for insurance, financial services, and complex business operations. The shared footer and default metadata use this definition.

Homepage H1 and eyebrow are preserved; supporting copy puts insurance and financial workflows first, the main existing CTA points to Temacore AI, and a short text line links About and the investor resource. Existing cards, sections, imagery, classes, animation and navigation architecture remain. BPO and managed services remain discoverable commercial offerings, framed as execution and workflow insight.

The AI page defines the shared intelligence layer, identifies insurance as the strongest current product base, and explains that a process must be understood and structured before AI can automate it effectively. It covers document intelligence, knowledge retrieval, workflow orchestration, decision support, permissions, traceability, enterprise controls and APIs/integrations with human review. Existing development/implementation caveats remain; no deployed AI, customer, revenue, certification, ROI or partnership claims were introduced.

About, Industries, Platforms, Venture and the whitepaper wrapper align with that hierarchy. Service pages retain service-specific search intent while adding the AI-first parent definition and contextual enterprise-software/insurance links. Existing form behavior, service offerings, founder facts and whitepaper PDF are unchanged.

## SEO, schema and linking

- Homepage uses an absolute title: Temacore | Vertical AI for Insurance, FinTech & Enterprise Operations. Relevant pages receive specific descriptions. The founder social card uses the existing company logo, without fabricating a portrait.
- Organization uses a stable /#organization identifier, TEMACORE name, TEMACORE LLC legalName, existing logo/contact/address, and the already-public founder linked to /founder#person. WebSite uses /#website; page, publisher, service and founder relationships reference the same entity IDs.
- Added About WebPage/BreadcrumbList. Existing factual Service/FAQ/TechArticle/ProfilePage structures remain. No commercial company sameAs profiles were invented; founder personal profiles remain attached only to the Person.
- Contextual anchors connect Home/About to AI, insurance and financial operations, services to AI/software/insurance, and existing whitepaper cards to their relevant pages. Added optional nonvisual InfoCard id support for the financial-operations section.
- /ai remains indexable, canonical and in the sitemap. Existing robots directives remain. Removed unreliable sitemap modification timestamps. Rewrote llms.txt around the parent, AI layer, product foundation and supporting operations; it remains supplementary text rather than a claimed LLM indexing mechanism.

## Investor preservation

No investor route, component, manifest or asset file was edited. The approved 15-slide revision remains `2026-c195ba3c`. All approved hashes are checked by the existing tests and the new served-output validation. The page retains noindex/nofollow/noarchive and stays outside sitemap, llms.txt and IndexNow.

The brief explicitly requests a homepage investor link, so it is now discoverable there. This changes human discovery, not indexing policy; noindex is not access control. The public deck has not been made confidential by these directives.

## Safe opt-in IndexNow

Added /indexnow-key.txt, returning 404 when unconfigured/invalid, and no-store/noindex headers. No credential was generated or committed. The operator command `node scripts/indexnow-submit.mjs ...` defaults to a dry run, validates production sitemap membership, www canonical URLs, status and robots headers, and rejects investor/admin/API/asset/form URLs, variants and other hosts. Explicit --submit and a deployed matching INDEXNOW_KEY are required for POST submission. Nothing runs on a page render or build.

Unit tests cover allowed/deduplicated URLs, private-route rejection, host/query/credential rejection, key format, and protocol batch bounds. The real production dry run for /, /ai and /about passed without sending a submission. Production key provisioning and actual submissions remain manual actions.

## Files changed

- `scripts/site-audit.mjs`
- `src/app/about/page.tsx`
- `src/app/ai/page.tsx`
- `src/app/client-intake/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/founder/page.tsx`
- `src/app/how-it-works/page.tsx`
- `src/app/industries/page.tsx`
- `src/app/llms.txt/route.ts`
- `src/app/page.tsx`
- `src/app/platforms/page.tsx`
- `src/app/services/page.tsx`
- `src/app/sitemap.ts`
- `src/app/venture/page.tsx`
- `src/app/whitepaper/page.tsx`
- `src/components/layout/footer.tsx`
- `src/components/sections/home-sections.tsx`
- `src/components/templates/service-page-template.tsx`
- `src/components/ui/info-card.tsx`
- `src/lib/data.ts`
- `src/lib/indexnow.ts`
- `src/lib/navigation.ts`
- `src/lib/seo-schema.ts`
- `src/lib/seo.ts`

New files:

- `src/lib/indexnow-policy.ts`
- `src/app/indexnow-key.txt/route.ts`
- `scripts/indexnow-submit.mjs`
- `scripts/indexnow.test.mjs`
- `scripts/phase-3-seo-check.mjs`
- `docs/seo-ai-positioning-post-deploy.md`
- This report and Phase 3 audit evidence JSON.

## Validation

- Unit tests: 13/13 passed, including approved investor hashes and new IndexNow policy cases.
- Final production build, lint and typecheck all passed after review corrections; all 44 generated pages completed.
- Initial rendered-route checks: all 29 return 200, zero canonical/H1/JSON-LD parse issues, zero broken links/anchors; detected About terminology and missing founder social images were corrected.
- Final rendered audit passed all 29 routes: zero content/metadata issues, zero broken internal links/anchors, unique titles/descriptions, valid social metadata, connected schema identities, expected robots directives, and all 16 approved investor assets matching their hashes. Evidence: phase-3-local-after.json.
- Desktop/mobile browser verification passed 12 checks across Home, AI, About, Industries, Services and the BPO service at 1440 and 390 pixels, with zero horizontal overflow or runtime errors. Desktop homepage before/after and final mobile Home/AI/About screenshots reviewed; approved visual language preserved. Evidence: phase-3-browser.json; local screenshots in ignored reports/browser-phase3/.
- No dependencies, lockfile, stylesheet, investor assets or navigation entry order changed. Existing installed locked dependencies used; no reinstall or dependency upgrades were necessary for this scope.

## Post-deploy actions and limitations

Follow `docs/seo-ai-positioning-post-deploy.md` after an approved production release: verify the exact commit, inspect priority public URLs in Google Search Console and Bing Webmaster Tools, resubmit the sitemap, and optionally configure IndexNow. /investors is verification-only, not an indexing target.

External authenticated search dashboards and external rich-results validators were not operated. JSON-LD verification is local structural/entity consistency checking, not a certification or guarantee of enhanced search presentation. Search engines decide indexing, snippets and ranking; LLM retrieval/citation is not guaranteed. No company social URLs are asserted until ownership is confirmed. Physical-device testing and resolution of previously reported dependency advisories are outside this copy/SEO change; lockfile is unchanged.
