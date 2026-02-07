# Migration order fix (Organisation before OrganisationInvite)

## What was wrong

- `20250207120000_add_organisation_invite` ran **before** `20260117095614_add_user_and_organisation_models` (because Prisma sorts by folder name).
- The invite migration adds a foreign key to `Organisation`, so it failed with "relation Organisation does not exist" on a fresh DB.
- That left the DB in a failed state (P3009: "failed migrations in the target database").

## What we changed

- Renamed the migration folder so it runs **after** the one that creates `Organisation`:
  - **From:** `20250207120000_add_organisation_invite`
  - **To:** `20260117100000_add_organisation_invite`

Apply order is now: init → … → add_user_and_organisation_models (creates Organisation) → … → **add_organisation_invite**.

## What you need to run (development branch only)

Because the dev DB has a failed migration recorded, the cleanest fix is to **reset** and re-apply everything (dev branch only; do not run reset on production).

```bash
# 1. Ensure DATABASE_URL in .env points to the development branch
# 2. Reset the dev DB and apply all migrations from scratch
npx prisma migrate reset
```

Confirm when prompted (or use `--force` to skip). This will:

- Drop all tables in the current DB (development branch).
- Re-apply all migrations in the correct order.
- Run seed if you have one (optional).

**Do not run `migrate reset`** on production or preview; use it only for the development branch DB.

## If you cannot use reset (e.g. production)

1. Mark the failed migration as rolled back:
   ```bash
   npx prisma migrate resolve --rolled-back "20250207120000_add_organisation_invite"
   ```
2. Then run:
   ```bash
   npx prisma migrate deploy
   ```
   (Only do this if the DB already has the `Organisation` table from an earlier successful run; otherwise reset is safer for dev.)
