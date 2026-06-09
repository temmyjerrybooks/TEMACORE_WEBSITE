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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NOTIFICATION_EMAIL_FROM=
NOTIFICATION_EMAIL_TO=
```

## Supabase Activation

1. In Supabase, open SQL Editor and run `src/lib/db/schema.sql` for a fresh setup.
2. If the original schema was already created, run `src/lib/db/activation.sql` to add the newer form fields.
3. In Vercel, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy the project.

The public forms submit through server API routes so the service role key stays server-side.

## Email Notifications

Form notification emails use Resend. In Vercel, add:

- `RESEND_API_KEY`
- `NOTIFICATION_EMAIL_TO`, for example `info@temacore.com`
- `NOTIFICATION_EMAIL_FROM`, for example `TEMACORE <noreply@temacore.com>`

If `RESEND_API_KEY` is not set, form submissions still save to Supabase but no email is sent.

The `topsborg-reference/` folder is ignored and should remain local only.
