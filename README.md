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
NOTIFICATION_EMAIL_TO=
INDEXNOW_KEY=
```

## Supabase Activation

1. In Supabase, open SQL Editor and run `src/lib/db/schema.sql` for a fresh setup.
2. If the original schema was already created, run `src/lib/db/activation.sql` to add the newer form fields.
3. Run `src/lib/db/seo-schema.sql` when you are ready to prepare SEO Agent storage.
4. In Vercel, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Redeploy the project.

The public forms submit through server API routes so the service role key stays server-side.

## Email Notifications

Form notification emails use Resend. In Vercel, add:

- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL_TO`, for example `info@temacore.com`
- `NOTIFICATION_EMAIL_FROM`, for example `TEMACORE <info@temacore.com>`

If `RESEND_API_KEY` is not set, form submissions still save to Supabase but no email is sent.

## SEO and AI Search Readiness

The site includes reusable metadata helpers, sitemap generation, robots.txt, llms.txt, JSON-LD schema helpers, service FAQs, related service links, and a protected future SEO Agent route at `/admin/seo`.

Set `NEXT_PUBLIC_SITE_URL=https://www.temacore.com` in Vercel so canonical URLs, sitemap URLs, robots.txt, and llms.txt use the production domain currently serving the site.

`src/lib/indexnow.ts` contains a disabled-by-default IndexNow helper. To enable it later, add `INDEXNOW_KEY`, publish the matching key file at `/{key}.txt`, and call `submitIndexNowUrls()` from a trusted server workflow after publishing or updating pages.

The `topsborg-reference/` folder is ignored and should remain local only.
