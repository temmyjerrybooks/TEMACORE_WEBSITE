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
```

The `topsborg-reference/` folder is ignored and should remain local only.
