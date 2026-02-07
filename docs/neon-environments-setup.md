# Neon environments: production, preview, local (development branch)

You have three databases:

| Environment | Neon project / branch | Use for |
|-------------|------------------------|--------|
| **Production** | `selfwithin-db` (main) | Live app (Vercel production) |
| **Preview** | `selfwithin-db-preview` (main) | Vercel preview deployments (PRs, etc.) |
| **Local** | `selfwithin-db-preview` → branch **development** | Your machine (`npm run dev`) |

## Same DB structure in all three

All three use the **same migration files** in `prisma/migrations/`. You run **the same command** (`npx prisma migrate deploy`) once per database; each DB gets the same schema.

- **One set of migrations** (in the repo) → applied to **production**, **preview**, and **development** separately.
- No need to “sync” schema by hand: `migrate deploy` applies any pending migrations to whichever DB `DATABASE_URL` points to.

---

## How to run migrate deploy for each environment

Same migrations, same structure. Run deploy **once per database** (point `DATABASE_URL` at that DB when you run):

| Target | Command |
|--------|--------|
| **Local (development branch)** | `DATABASE_URL` in `.env.local` = dev branch URL, then `npm run db:migrate` (or `npx prisma migrate deploy`) |
| **Preview (selfwithin-db-preview main)** | `DATABASE_URL="<preview-main-url>" npm run db:migrate` (or set in `.env.local` temporarily and run) |
| **Production (selfwithin-db)** | `DATABASE_URL="<production-url>" npm run db:migrate` (or set in `.env.local` temporarily and run) |

Prisma reads `prisma/migrations/` and applies any migrations that are not yet in that database’s `_prisma_migrations` table. So production, preview, and development all end up with the same schema.

---

## Step 1: Get the three connection strings

From Neon dashboard:

1. **Production**  
   Open project **selfwithin-db** → **Connection string** (use **pooler**, copy **PostgreSQL** URL).

2. **Preview**  
   Open project **selfwithin-db-preview** → **main** branch → **Connection string** (pooler, PostgreSQL URL).

3. **Local (development branch)**  
   Open **selfwithin-db-preview** → branch **development** → **Connection string** (pooler).  
   Format (no `psql` wrapper):
   ```text
   postgresql://neondb_owner:PASSWORD@ep-nameless-paper-a7qflkg3-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

---

## Step 2: Local development

1. In the project root, create or edit **`.env.local`** (never commit this file):

   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_DEV_BRANCH_PASSWORD@ep-nameless-paper-a7qflkg3-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
   ```

   Use the **development** branch URL (the one from the modal). Replace `YOUR_DEV_BRANCH_PASSWORD` with the real password, or paste the full string from Neon.

2. Apply migrations and generate Prisma client:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

Your local app now uses the **development** branch only; production and preview are untouched.

---

## Step 3: Vercel (production + preview)

1. **Vercel** → your project → **Settings** → **Environment Variables**.

2. **Production**
   - Name: `DATABASE_URL`
   - Value: connection string for **selfwithin-db** (production).
   - Environment: **Production** only.

3. **Preview**
   - Name: `DATABASE_URL`
   - Value: connection string for **selfwithin-db-preview** **main** branch.
   - Environment: **Preview** only.

(If you already have one `DATABASE_URL`, add a second row with the other environment so Production and Preview use different DBs.)

4. **Redeploy** so new env vars are applied:
   - Production: deploy from main (or trigger a production deploy).
   - Preview: push a branch or open a PR to trigger a preview deploy.

---

## Step 4: Run migrations on production and preview (first time)

Each database needs migrations applied once.

**Option A – From your machine (recommended)**

1. **Preview DB (selfwithin-db-preview main)**  
   Temporarily set in `.env.local`:
   ```env
   DATABASE_URL="<preview-main-connection-string>"
   ```
   Then:
   ```bash
   npx prisma migrate deploy
   ```
   Switch `.env.local` back to the **development** branch URL when done.

2. **Production DB (selfwithin-db)**  
   Temporarily set:
   ```env
   DATABASE_URL="<production-connection-string>"
   ```
   Then:
   ```bash
   npx prisma migrate deploy
   ```
   Switch back to the dev branch URL for daily work.

**Option B – From Vercel**

If your build runs `prisma migrate deploy` (e.g. in `package.json` `postbuild`), the first deploy to Production and the first Preview deploy will apply migrations to their respective DBs. Ensure `DATABASE_URL` is set per environment as in Step 3.

---

## Summary

| Where | DATABASE_URL points to | When migrations run |
|-------|------------------------|----------------------|
| Your laptop (`.env.local`) | **development** branch in selfwithin-db-preview | `npx prisma migrate deploy` after you point to dev branch |
| Vercel Production | **selfwithin-db** | Once: run `migrate deploy` with prod URL, or on first prod deploy |
| Vercel Preview | **selfwithin-db-preview** main | Once: run `migrate deploy` with preview URL, or on first preview deploy |

After this, local uses the development branch, preview uses selfwithin-db-preview (main), and production uses selfwithin-db.
