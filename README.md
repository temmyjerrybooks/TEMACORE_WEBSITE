# Temacore Website

Premium corporate website for Temacore, a US-registered AI-first technology company building vertical AI, enterprise software, and intelligent workflow infrastructure.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Reusable component architecture
- PostgreSQL application storage with versioned migrations

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Connect a PostgreSQL database through Vercel's Marketplace. Follow [PostgreSQL deployment and data-preservation instructions](docs/postgresql-deployment.md) before switching production.

Server environment settings:

```text
NEXT_PUBLIC_SITE_URL=https://www.temacore.com
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_EMAIL=
RESEND_API_KEY=
NOTIFICATION_EMAIL_FROM=
INDEXNOW_KEY=
SEO_AUDIT_SECRET=
CRON_SECRET=
```

The connected Vercel integration can use `TEMACORE_DATABASE_URL` instead of `DATABASE_URL`; both are supported, as is `POSTGRES_URL`. Enable the chosen variable for Production.

Initialize a new database with `npm run db:migrate`, then run `npm run db:check`. The second command verifies write/read/rollback without retaining test submissions or sending emails. Configure secrets privately in Vercel or ignored `.env.local`.

Application data uses PostgreSQL. Admin sign-in still uses Supabase Auth; keep the authentication project and settings until a separate identity migration is complete. Preserve existing records before production cutover. Production Vercel builds apply migrations and verify the runtime database connection before publishing. Preview and local builds do not mutate the database.

## Admin Access

The admin panel is restricted to authorized operators and protected through server-side checks. Do not publish admin credentials or operational access details.

## SEO Audit Engine

The protected SEO Agent can run a real internal audit from `/admin/seo`. It checks sitemap.xml, robots.txt, llms.txt, page metadata, JSON-LD, internal links, image alt text, and Basic Response Performance.

Manual audit route:

- `POST /api/admin/seo/run-audit`
- Requires authorized server-side access.

Scheduled audit placeholder:

- `GET /api/cron/seo-audit`
- Requires private cron authorization.
- Add a Vercel Cron schedule later when you are ready to activate it.

The audit stores real results in PostgreSQL tables initialized by the versioned database migrations. It does not use Search Console, Bing Webmaster Tools, paid SEO tools, or fake SEO metrics.

## Email Notifications

Form notification emails use Resend. In Vercel, add:

- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL_FROM`, for example `TEMACORE <info@temacore.com>`

Notification recipients are locked to `info@temacore.com`.

If `RESEND_API_KEY` is not set, form submissions still save to PostgreSQL but no email is sent.

## SEO and AI Search Readiness

The site includes reusable metadata helpers, sitemap generation, robots.txt, llms.txt, JSON-LD schema helpers, service FAQs, related service links, and a protected future SEO Agent route at `/admin/seo`.

Set `NEXT_PUBLIC_SITE_URL=https://www.temacore.com` in Vercel so canonical URLs, sitemap URLs, robots.txt, and llms.txt use the production domain currently serving the site.

`src/lib/indexnow.ts` contains a disabled-by-default IndexNow helper. To enable it later, add `INDEXNOW_KEY`, publish the matching key file at `/{key}.txt`, and call `submitIndexNowUrls()` from a trusted server workflow after publishing or updating pages.

The `topsborg-reference/` folder is ignored and should remain local only.

## Investor Presentation Assets

`/investors` is an unlisted, noindex investor-presentation route. It is intentionally excluded from the public sitemap and `llms.txt`.

Export the supplied investor deck as the following production assets before setting `investorDeckAssets.ready` and `investorDeckAssets.pdfAvailable` to `true` in `src/lib/investor-deck.ts`:

```text
public/investor-deck/
  cover.webp                         2560 × 1440
  slide-01.webp through slide-15.webp 2560 × 1440 each
  temacore-investor-deck.pdf
```

Use the original deck as the source of truth. Do not publish the editable PowerPoint file. If the exported assets are unavailable, the production page shows a safe contact state instead of broken images; development additionally shows the expected asset manifest.

Optional, privacy-conscious deck analytics use the PostgreSQL schema initialized by `npm run db:migrate`. The public viewer continues to work if the database or analytics table is unavailable. The current access-protection helper is intentionally inactive: publicly served assets cannot be truly protected until they move to authenticated/private storage or server-delivered asset routes.

## Site Verification

Run the audit parser regression tests with `npm test`. After a production build, start the site and inspect its served output:

```powershell
npm run build
npm run start -- --port 3100
node scripts/site-audit.mjs http://localhost:3100 reports/local-after.json
```

The same read-only audit can verify production:

```powershell
node scripts/site-audit.mjs https://www.temacore.com reports/live-after.json
```

It fetches all sitemap pages plus the intentionally unindexed investor page, checks rendered metadata and JSON-LD, checks internal links and anchors, and records route-specific positioning requirements. A report containing issues is evidence for review, not a passing result. External profile links are listed separately because providers may block automated requests.

Optional browser checks use an installed Chromium browser with a temporary profile and no form submissions:

```powershell
node scripts/browser-check.mjs http://localhost:3100 reports/browser-local-after
```

The default browser path is Microsoft Edge on Windows. Pass a browser executable as the fourth argument (or set CHROME_PATH), and an optional comma-separated route list as the fifth. Browser checks save screenshots and report viewport overflow and JavaScript exceptions. Screenshot folders remain local.
