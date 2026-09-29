# TEMACORE: SEO and AI positioning after deployment

Phase 3 is prepared on a feature branch. Merge to main only after review and explicit approval. Run these steps against the approved production release, not a Vercel preview. No search submission or account configuration was performed during implementation.

## Release verification

Confirm https://www.temacore.com/ serves the approved commit. Run:

```powershell
node scripts/site-audit.mjs https://www.temacore.com reports/phase-3-live-after.json
node scripts/phase-3-seo-check.mjs https://www.temacore.com reports/phase-3-seo-live.json
```

Check HTTP 200, server-rendered copy, a single canonical on the www host, intended robots directives, and valid Organization/WebSite/WebPage references. Compare the homepage, AI, About and a service page on desktop and mobile. Verify the investor deck remains at revision `2026-c195ba3c`, with its approved 15 slides and PDF unchanged.

## Indexing priorities

Use canonical page URLs, without tracking parameters or section fragments:

1. https://www.temacore.com/
2. https://www.temacore.com/ai
3. https://www.temacore.com/about
4. https://www.temacore.com/insurtech and https://www.temacore.com/platforms
5. https://www.temacore.com/industries for financial operations; then /technology, /venture, /whitepaper and materially updated service pages.
6. Verify https://www.temacore.com/investors separately; do **not** request indexing or submit it through IndexNow.

There is no standalone /fintech page. `/industries#financial-operations` is a contextual link to existing page content; request indexing for `/industries`, without its fragment.

The investor page intentionally retains `noindex, nofollow, noarchive` and is excluded from sitemap/llms/IndexNow. Its new homepage link improves human discovery as requested, but noindex is not access control: the page and deck remain publicly accessible. Changing its indexing policy requires an explicit management decision. Do not remove noindex simply to satisfy an indexing checklist.

## Google Search Console

An owner or full user of the verified property should inspect each priority URL. Review Google's selected canonical and indexing status; use the live test to confirm the current rendered page and crawl access. If eligible, request indexing for the changed public page. Inspect errors before resubmitting; repeated requests do not accelerate a crawl. Requests do not guarantee indexing. [Google recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

In Sitemaps, submit or resubmit `https://www.temacore.com/sitemap.xml` once after the release and check its processing status. `/ai` must be included, while investor/admin/API URLs must be absent. The sitemap omits unverified last-modified dates rather than claiming every page changed whenever it was built. Add dates later only from reliable content-change records. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Validate Organization markup using Google's Rich Results Test, and inspect general Schema.org relationships with a schema validator. Some valid schema types do not generate rich results. Founder identity comes from the existing public profile; do not insert personal social profiles as company `sameAs` values. Add organization profiles only after management confirms ownership. [Google Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization).

## Bing Webmaster Tools

Use a verified property for the www host. Inspect the priority URLs for crawl access, HTTP status, indexing and markup issues; submit the changed public URLs through the available submission workflow. Run Site Scan for broken links and duplicate metadata. [Bing Webmaster setup and tools](https://blogs.bing.com/webmaster/2025/6/Start-Using-Bing-Webmaster-Tools-to-Improve-Your-Site-Visibility/), [URL Inspection](https://blogs.bing.com/webmaster/2020/9/Introducing-the-Bing-Webmaster-Tools-URL-Inspection-Tool/).

Submit the canonical sitemap in the Sitemaps tool and monitor processing. Keep the robots.txt sitemap reference. Do not use the discontinued anonymous sitemap ping endpoint. [Bing sitemap submission guidance](https://blogs.bing.com/webmaster/2022/5/Spring-cleaning-Removed-Bing-anonymous-sitemap-submission/).

## Optional IndexNow configuration

Implementation uses an explicit manual command, never a page-render or build hook. No key is supplied in source control. The public proof route `/indexnow-key.txt` returns 404 while `INDEXNOW_KEY` is missing or invalid. With a configured key it serves plain text, no-store, with an X-Robots-Tag noindex header.

An authorized operator can generate an ownership key of 8-128 letters, digits or hyphens and set `INDEXNOW_KEY` in Vercel **Production** and the local shell. Do not reuse a service credential. Redeploy configuration, then confirm the proof route returns the same key. The root proof route is passed explicitly as `keyLocation`. [IndexNow key setup](https://www.indexnow.org/faq).

First run a dry run (GET requests only, no submission):

```powershell
node scripts/indexnow-submit.mjs https://www.temacore.com/ https://www.temacore.com/ai https://www.temacore.com/about https://www.temacore.com/insurtech https://www.temacore.com/platforms https://www.temacore.com/industries
```

The command validates URLs against the production sitemap, www origin, canonical tags, HTTP responses, and indexability. It excludes investor assets, investor/admin/API routes and intake/project-request forms, even if accidentally listed in the sitemap. It rejects query strings, fragments, credentials and redirects. The dry run can run without a configured key.

After verifying the production release and approving submission, repeat the same command with `--submit`. It verifies the deployed ownership proof before POSTing. HTTP 200 acknowledges receipt; 202 means ownership validation is pending. Neither proves indexing. On rejection, review configuration/status before retrying; respect rate limits. [IndexNow protocol and responses](https://www.indexnow.org/documentation).

Do not submit unchanged URLs repeatedly. IndexNow does not replace Google Search Console or sitemap verification. Preview URLs, unpublished changes and fundraising materials are outside this workflow.

## Monitoring and management decisions

Record deployment commit/time and submission dates. Check crawl/indexing diagnostics after release, then review search performance weekly: brand queries, vertical-AI/insurance/software queries, selected canonicals, impressions, clicks and indexing exclusions. Correct actual errors before requesting another crawl. Search engines may choose different snippets.

Entity consistency, useful pages and normal crawlable links are the strategy. `llms.txt` is a human-readable supplementary description, not a guarantee that an LLM will retrieve, cite, or train on the site. No ranking, knowledge-panel, or AI-answer inclusion is promised. [Bing discovery guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/).

Management still owns Search Console/Bing access, IndexNow activation, official company profile verification, and any change to investor confidentiality/indexability. Keep AI maturity statements qualified until specific capabilities have been validated for a deployment.
