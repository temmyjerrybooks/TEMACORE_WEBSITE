# PostgreSQL migration status

Branch: `fix/postgres-storage`. Production cutover is pending configuration and data-preservation checks.

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

- Final validation on the patched dependency versions: 23/23 tests passed, including real PostgreSQL SQL execution through PGlite, transaction rollback, parameterization, constraints, repeated migrations, and changed-checksum rejection.
- Production build passed, generating all 44 pages. Standalone TypeScript and full repository lint checks passed.
- Built-site HTTP audit: 29/29 pages returned 200, with zero metadata/content issues, broken internal links, or broken anchors.
- Approved investor PDF and all 15 slide asset checks passed; their source files are unchanged.
- Browser interaction checks and real provider TLS/connectivity checks are still pending. The browser automation connection is unavailable in this session, and no runtime database URL is configured locally.

## Production status and remaining work

The last fetched remote `main` is `f43e4096b5bbb3c1141bfc2436b128f937681cec`. This migration has not been merged or deployed, and the live intake issue must not be described as resolved yet.

1. Connect managed PostgreSQL to TEMACORE's Production environment in Vercel, with server-side `DATABASE_URL`.
2. Identify and preserve existing Supabase application records. A decision about existing data is outstanding; no data has been deleted, exported, or transferred.
3. Initialize the new schema and run the runtime connection diagnostic. Reconcile existing records before production switches databases.
4. Merge and push after those checks, verify the production deployment SHA, forms, authenticated dashboards, mobile navigation, and investor presentation.

Do not delete Supabase while admin authentication still depends on it. No real form test or notification email was sent during this work. Follow [the deployment guide](../docs/postgresql-deployment.md) for the connection and migration steps.
