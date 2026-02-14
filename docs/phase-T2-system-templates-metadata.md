# Phase T.2 — System Templates: Category, Featured, Metadata (Schema + API)

**Date:** 2026-02-01

---

## Goal

Upgrade system experiment templates so the UI can consume **real metadata** from the database:

- **Categories** (e.g. "Wellness & Health", "Focus & Productivity")
- **Featured** templates
- **Difficulty** ("Easy" | "Medium" | "Hard")
- **Tags** (e.g. "Energy", "Morning Routine")
- **Estimated duration** display (already had `durationDays`)
- **Static rating & usage count** (display-only, no logic)

Templates remain **system-owned** and **read-only**. No user-created or editable templates.

---

## Hard rules

- Users cannot create templates
- Users cannot edit templates
- No AI
- No org/team logic
- No breaking changes to existing experiment creation flow
- Templates remain system-owned
- UI `/templates` must read from DB, not mock (API supports it; UI wiring may follow separately)

---

## Prisma schema changes

**Extend `ExperimentTemplate`** (add columns only; no new models):

| Column     | Type     | Notes                        |
| ---------- | -------- | ---------------------------- |
| categories | String[] | @default([])                 |
| tags       | String[] | @default([])                 |
| featured   | Boolean  | @default(false)              |
| difficulty | String?  | "Easy" \| "Medium" \| "Hard" |
| rating     | Float?   | Display-only                 |
| usageCount | Int?     | Display-only                 |

No relation to User or Organisation. `ExperimentTemplateField` unchanged.

---

## Migration

**File:** `prisma/migrations/20260201100000_add_template_metadata/migration.sql`

- Adds: `categories` (TEXT[]), `tags` (TEXT[]), `featured` (BOOLEAN), `difficulty` (TEXT), `rating` (DOUBLE PRECISION), `usageCount` (INTEGER).
- Run: `npx prisma migrate deploy` or `npx prisma migrate dev` when DB is available.

---

## Seed updates

**File:** `prisma/seed/experiment-templates.ts`

- All 5 templates now include metadata: `categories`, `tags`, `featured`, `difficulty`, `rating`, `usageCount`, and filled `description`.
- **Featured:** daily_energy, mood_awareness, habit_consistency.
- **Idempotent:** Upsert by `key`; delete and recreate fields; metadata in both `create` and `update` so re-seed keeps data in sync.

---

## API

### GET /api/experiment-templates

- **Auth:** Authenticated users only (401 if not).
- **Order:** `featured` DESC, then `createdAt` DESC.
- **Response:** All templates with `fields` (order ASC) and new metadata:
  - `id`, `key`, `title`, `description`, `durationDays`, `frequency`
  - `categories`, `tags`, `featured`, `difficulty`, `rating`, `usageCount`
  - `fields[]`

### POST /api/experiment-templates/[templateId]/create

- **No change.** Metadata is **not** copied when creating an experiment. Only title, durationDays, frequency, and fields are used.

---

## Frontend expectations (API supports; UI may wire later)

- Featured section (templates with `featured === true`)
- Category chips and filter by category (counts derived from DB)
- Tag display per template
- Difficulty badge
- Rating and usage count display

---

## Files

| File                                                                   | Purpose                                                                |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `prisma/schema.prisma`                                                 | New columns on ExperimentTemplate.                                     |
| `prisma/migrations/20260201100000_add_template_metadata/migration.sql` | Add metadata columns.                                                  |
| `prisma/seed/experiment-templates.ts`                                  | Seed 5 templates with full metadata.                                   |
| `src/app/api/experiment-templates/route.ts`                            | GET orderBy featured desc, createdAt desc; response includes metadata. |

---

## Explicit non-goals (Phase T.2)

- Admin CRUD for templates
- User-created templates
- Analytics tracking
- AI template generation
- Org templates
- UI implementation (this phase is schema + API only; UI can consume API next)
