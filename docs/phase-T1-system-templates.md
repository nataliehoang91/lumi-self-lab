# Phase T.1 — System Experiment Templates (Seeded, Read-only)

**Date:** 2026-01-29

---

## Goal

Inject **exactly 5 system-defined** experiment templates. Users can create experiments from these templates. Templates are **read-only** and **system-owned** (no userId). No user-created or editable templates in this phase.

---

## Hard rules

- No user-created templates
- No editing templates
- No AI
- No org/team logic
- No reminder logic changes
- No breaking changes to existing experiment APIs
- Templates are system-owned (no userId)

---

## Prisma schema

**New models:**

### ExperimentTemplate

| Column       | Type     | Notes                |
| ------------ | -------- | -------------------- |
| id           | String   | @id @default(cuid()) |
| key          | String   | @unique              |
| title        | String   |                      |
| description  | String?  |                      |
| durationDays | Int?     |                      |
| frequency    | String?  |                      |
| createdAt    | DateTime |                      |
| updatedAt    | DateTime |                      |

### ExperimentTemplateField

| Column        | Type     | Notes                                      |
| ------------- | -------- | ------------------------------------------ |
| id            | String   | @id @default(cuid())                       |
| templateId    | String   | FK → ExperimentTemplate.id, CASCADE        |
| label         | String   |                                            |
| type          | String   | text \| number \| select \| emoji \| yesno |
| required      | Boolean  | @default(false)                            |
| order         | Int      |                                            |
| textType      | String?  |                                            |
| minValue      | Int?     |                                            |
| maxValue      | Int?     |                                            |
| emojiCount    | Int?     |                                            |
| selectOptions | String[] |                                            |

Field types and constraints match **ExperimentField** (Phase 1.2). No new validation logic.

---

## Seeding

**File:** `prisma/seed/experiment-templates.ts`

- **Idempotent:** Upsert template by `key`; delete existing fields for that template; re-insert fields in order.
- **Entry:** `prisma/seed.ts` calls `seedExperimentTemplates()`.
- **Run:** `npm run db:seed` or `npx prisma db seed` (requires `tsx` and migration applied).

**Templates seeded (exactly 5):**

1. **daily_energy** — Daily Energy Check-in, 14 days. Fields: Emoji (1–5), Number (1–10), Text.
2. **mood_awareness** — Mood & Mental Health Awareness, 30 days. Fields: Emoji (1–5), Yes/No, Text.
3. **habit_consistency** — Habit Consistency Tracker, 21 days. Fields: Yes/No, Number (1–10), Text.
4. **sleep_quality** — Sleep Quality Experiment, 14 days. Fields: Number (1–10), Number (0–12), Emoji (1–5), Text.
5. **focus_sprint** — Productivity Focus Sprint, 7 days. Fields: Number (1–10), Select (Social media, Notifications, Meetings, Fatigue, None), Text.

---

## API

### GET /api/experiment-templates

- **Auth:** Authenticated users only (401 if not).
- **Response:** All templates with `fields` ordered by `order` ASC. Read-only.

### POST /api/experiment-templates/[templateId]/create

- **Auth:** Required. 404 if template not found.
- **Behavior:** Create a new **Experiment** for the current user:
  - `clerkUserId` = current user
  - `status` = `"draft"`
  - `startedAt` = null, `completedAt` = null
  - `title`, `durationDays`, `frequency` from template (defaults: durationDays 14, frequency `"daily"` if null)
  - Copy template fields → experiment fields (label, type, required, order, textType, minValue, maxValue, emojiCount, selectOptions)
- **Response:** Created experiment (with fields). **Do not** start the experiment automatically.

---

## Consistency

- Field types and constraints map to existing **ExperimentField** and check-in validation (Phase 1.2).
- Field immutability after first check-in still applies (Phase 1.4).
- Review, reminder, and check-in flows work without modification.

---

## Files

| File                                                                      | Purpose                                             |
| ------------------------------------------------------------------------- | --------------------------------------------------- |
| `prisma/schema.prisma`                                                    | ExperimentTemplate, ExperimentTemplateField models. |
| `prisma/migrations/20260129140000_add_experiment_templates/migration.sql` | Create tables.                                      |
| `prisma/seed/experiment-templates.ts`                                     | Seed the 5 templates (idempotent).                  |
| `prisma/seed.ts`                                                          | Seed entry; runs `seedExperimentTemplates`.         |
| `src/app/api/experiment-templates/route.ts`                               | GET all templates.                                  |
| `src/app/api/experiment-templates/[templateId]/create/route.ts`           | POST create experiment from template.               |

---

## Explicit non-goals (Phase T.1)

- User-created templates
- Editing templates
- UI work
- AI
- Org/team logic
