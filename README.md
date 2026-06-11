# Temacore Website

Premium corporate website for Temacore, a US-registered global operations and technology company.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Reusable component architecture
- Supabase-ready data model stubs

## Local Development

```bash
npm install
npm run dev
```

## Deployment

This project is ready for Vercel. Add environment variables later when Supabase is connected:

```bash
NEXT_PUBLIC_SITE_URL=https://www.temacore.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NOTIFICATION_EMAIL_FROM=
INDEXNOW_KEY=
SEO_AUDIT_SECRET=
CRON_SECRET=
```

## Supabase Activation

1. In Supabase, open SQL Editor and run `src/lib/db/schema.sql` for a fresh setup.
2. If the original schema was already created, run `src/lib/db/activation.sql` to add the newer form fields.
3. Run `src/lib/db/seo-schema.sql` when you are ready to prepare SEO Agent storage.
4. In Vercel, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - the private admin identity setting
5. Configure the authorized admin account privately in Supabase Auth.
6. Redeploy the project.

The public forms submit through server API routes so the service role key stays server-side.

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

The audit stores real results in the Supabase SEO tables from `src/lib/db/seo-schema.sql`. It does not use Search Console, Bing Webmaster Tools, paid SEO tools, or fake SEO metrics.

## Email Notifications

Form notification emails use Resend. In Vercel, add:

- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL_FROM`, for example `TEMACORE <info@temacore.com>`

Notification recipients are locked to `info@temacore.com`.

If `RESEND_API_KEY` is not set, form submissions still save to Supabase but no email is sent.

## SEO and AI Search Readiness

The site includes reusable metadata helpers, sitemap generation, robots.txt, llms.txt, JSON-LD schema helpers, service FAQs, related service links, and a protected future SEO Agent route at `/admin/seo`.

Set `NEXT_PUBLIC_SITE_URL=https://www.temacore.com` in Vercel so canonical URLs, sitemap URLs, robots.txt, and llms.txt use the production domain currently serving the site.

`src/lib/indexnow.ts` contains a disabled-by-default IndexNow helper. To enable it later, add `INDEXNOW_KEY`, publish the matching key file at `/{key}.txt`, and call `submitIndexNowUrls()` from a trusted server workflow after publishing or updating pages.

The `topsborg-reference/` folder is ignored and should remain local only.
