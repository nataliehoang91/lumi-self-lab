# Recovering production database after accidental full seed

**Do not run `npx prisma db seed` on production.** The full seed is for local/dev and can overwrite or change data.

## If you use Neon (PostgreSQL)

1. Open [Neon Console](https://console.neon.tech) and select your project.
2. Go to **Backups** or **Restore** (or **Branches** → your branch → **Restore**).
3. Use **Point-in-time restore** and pick a time **before** you ran the seed.
4. Restore to a **new branch** (do not overwrite main if unsure), then:
   - Either switch your app to the new branch’s connection string to verify, then promote/merge if needed, or
   - Export data from the restored branch and re-import into main if your provider supports it.

Neon keeps point-in-time history (exact retention depends on your plan). Restoring creates a new branch at that point; your current branch is not modified until you change connection strings or merge.

## If you use another host (e.g. Supabase, Railway, Vercel Postgres)

- Use that provider’s **backup / point-in-time restore** from the dashboard (choose a time before the seed).
- If you have no backups, recovery is only possible from your own exports or replicas.

## Going forward: only seed search keys on production

To update **only** Bible search keys (e.g. after adding new books or keys):

```bash
npm run db:seed-search-keys
```

Or:

```bash
npx tsx prisma/seed/run-bible-search-keys-only.ts
```

This script **only**:

- Deletes and repopulates `BibleBookSearchKey`
- Does **not** touch `BibleBook`, `FlashVerse`, `BibleVerseContent`, or any other table

Use this on production when you need to refresh search keys. Never run `npx prisma db seed` on production.
