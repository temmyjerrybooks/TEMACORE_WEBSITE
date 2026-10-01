# PostgreSQL on Vercel

Application data uses PostgreSQL through server-side `pg` connections. The schema and versioned migrations are in `src/lib/db/migrations`. The database itself is a persistent managed service connected to Vercel, not a file inside a deployment.

## Create and connect the database

1. Open the TEMACORE project in Vercel, then **Storage → Create Database**. Select **Neon** from the Marketplace. Alternatively, open the [Neon Marketplace integration](https://vercel.com/marketplace/neon/neon).
2. Review the provider's current price, usage limits, backup retention, region, and inactivity policy. Choose a region near the application's Vercel functions. Name the database `temacore-production`.
3. Select **Connect Project**, choose TEMACORE, and enable **Production**. Keep Preview and Development on separate databases or isolated database branches, not on production data.
4. Keep the default environment-variable names. Check **Project Settings → Environment Variables** for server-side `DATABASE_URL`. `POSTGRES_URL` is also supported. Never use a `NEXT_PUBLIC_` prefix for database credentials.
5. Keep credentials in Vercel. For local migration work, put the connection string privately in ignored `.env.local`. Do not paste it into chat, reports, commits, screenshots, or command arguments. `DATABASE_MIGRATION_URL` can optionally supply a direct connection for migrations. The migration runner also recognizes Neon's `DATABASE_URL_UNPOOLED`; otherwise it uses `DATABASE_URL` or `POSTGRES_URL`. The `db:check` command always tests the runtime connection.

Vercel's [native integration documentation](https://vercel.com/docs/integrations/install-an-integration/product-integration) describes project connections and environment targets. New variables take effect in a new deployment. Connection alone does not create the application's tables or update already deployed code.

## Initialize and verify

From the repository, using Node 22 or newer and privately configured credentials:

```powershell
npm ci
npm run db:migrate
npm run db:check
```

The migration runner locks and applies migrations in one transaction, records checksums, and rejects edits to previously applied migrations. The initial migration is for a new database. It deliberately fails on existing application tables rather than replacing or deleting them. Never run it against the old Supabase database.

`db:check` verifies migration checksums and a synthetic lead/intake write and read within a transaction, then rolls it back and confirms no lead remains. It does not call form endpoints or send emails. This checks connectivity and constraints; a production form acceptance test remains a separate verification step.

Migrations are explicit; the ordinary Vercel build does not modify database schema. The runtime pool is capped at five connections per instance and uses the Vercel pool lifecycle helper. Keep the provider's TLS connection settings intact.

## Preserve existing records before switching

Keep the Supabase project, its backups, and its current deployment configuration. First determine whether it contains client submissions, applications, analytics, or audit records. If records exist, export and restore the 13 application tables into the new schema through a private, controlled PostgreSQL data migration, preserving UUIDs, foreign keys, timestamps, and arrays. Do not move Supabase's internal `auth` or `storage` schemas into this application schema.

Pause writes for the final transfer window or reconcile a final delta before switching production. Compare source and destination row counts per table and validate representative relationships. Keep personal data and exports outside Git. Do not replace a populated destination with an empty database or merge duplicate submissions blindly.

Admin sign-in still uses **Supabase Auth**, independently of application data. Keep `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `ADMIN_EMAIL` for authentication. This change does not migrate passwords, sessions, or the identity provider. The application no longer needs `SUPABASE_SERVICE_ROLE_KEY` for data storage; retain the old configuration privately for recovery until migration is verified. Do not delete Supabase while authentication depends on it.

## Deploy and verify

After schema checks and any required data transfer pass, merge the tested branch into current `main` without a force push. Vercel's normal Git integration deploys the commit using Production environment variables.

Verify the deployment SHA, client-intake page on desktop and mobile, safe feedback when unavailable, an authorized form submission and saved records, protected dashboards, and all 15 approved investor slides. A valid public form submission sends a real notification email; obtain authorization for that test or test with notifications disabled in an isolated Preview environment.

If rollback is needed, retain both databases and identify which received writes after cutover before switching a deployment back. Redeploying old code can point it back at Supabase; it does not automatically reconcile newly collected PostgreSQL records.

## Operational limits

A managed PostgreSQL provider still has plan limits and availability policies. Neon can suspend idle compute and wake it on access; review its current [scale-to-zero policy](https://neon.com/docs/introduction/scale-to-zero) and the selected plan before relying on it for production. Enable suitable backups and restore testing, usage alerts, and billing notifications. This migration does not guarantee that a third-party service can never be paused.
