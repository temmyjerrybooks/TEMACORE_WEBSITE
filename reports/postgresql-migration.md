# PostgreSQL pre-deployment verification

Production cutover authorized: the user confirmed PostgreSQL is connected and there are no existing records to migrate.

## Implemented

- Replaced application storage access through Supabase's REST client with server-only, pooled PostgreSQL queries for forms, admin dashboards, analytics, and SEO records.
- Added a versioned initial migration for all 13 application tables, transactional migration execution, checksums, and an advisory lock.
- Made lead and intake creation one transaction. Failed storage returns a safe 503 response; the browser retains entered fields and does not retry automatically. Notification failure does not change a committed intake into a failed response.
- Kept query values parameterized and database errors out of visitor responses and diagnostic logs.
- Added `db:migrate` and `db:check`. The diagnostic checks write/read/rollback through the runtime database connection without calling email or public form endpoints.
- Preserved Supabase Auth for admin sign-in. Removed the unused Supabase JavaScript SDK and application service-role storage dependency.
- Fixed the mobile menu's containing block by placing its fixed overlay outside the blurred header.
- Updated Next.js and matching ESLint configuration to 16.3.8, PostCSS to 8.5.28, and compatible transitive dependencies. The final npm audit reports zero known vulnerabilities.

## Verification

- Final validation on the patched dependency versions: 28/28 tests passed, including real PostgreSQL SQL execution through PGlite, transaction rollback, parameterization, constraints, repeated migrations, and changed-checksum rejection.
- Baseline commit ba176f4 passed the production build (44 pages), standalone TypeScript, and full repository lint. The release additions pass TypeScript and targeted lint; Vercel validates their build before publication.
- Built-site HTTP audit: 29/29 pages returned 200, with zero metadata/content issues, broken internal links, or broken anchors.
- Approved investor PDF and all 15 slide asset checks passed; their source files are unchanged.
- Browser interaction checks and real provider TLS/connectivity checks were pending at this pre-deployment checkpoint. The browser automation connection is unavailable in this session, and credentials remain in Vercel rather than this workspace. Production builds now apply migrations and verify database write/read/rollback before compilation.

## Production status and remaining work

At this pre-deployment checkpoint, fetched remote `main` was `f43e4096b5bbb3c1141bfc2436b128f937681cec`, with no divergence. Production verification must confirm the newly deployed commit through `/api/health` and the GitHub deployment status before declaring the live intake issue resolved.

1. Connect managed PostgreSQL to TEMACORE's Production environment in Vercel, with server-side `DATABASE_URL`.
2. No record transfer is required, as explicitly confirmed by the user. No existing data has been deleted.
3. The production build now initializes the new schema and runs the runtime write/read/rollback diagnostic. A failure blocks publication. Preview deployments never mutate the database.
4. Merge and push after those checks, verify the production deployment SHA, forms, authenticated dashboards, mobile navigation, and investor presentation.

Do not delete Supabase while admin authentication still depends on it. No real form test or notification email was sent during this work. Follow [the deployment guide](../docs/postgresql-deployment.md) for the connection and migration steps.
