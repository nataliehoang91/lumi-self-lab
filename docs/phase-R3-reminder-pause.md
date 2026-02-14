# Phase R.3 — Pause Check-in Reminder (minimal schema)

**Date:** 2026-01-29

---

## Goal

Let users **pause** and **resume** daily check-in email reminders per experiment. Minimal schema change; no change to experiment lifecycle, check-in, or review logic. Reminder is notification-only.

---

## Schema (minimal)

**New model: `ExperimentReminder`**

| Column       | Type      | Notes                              |
| ------------ | --------- | ---------------------------------- |
| experimentId | String    | PK, FK → Experiment.id, CASCADE    |
| pausedAt     | DateTime? | Set when paused; null when resumed |
| createdAt    | DateTime  | @default(now())                    |
| updatedAt    | DateTime  | Required                           |

- One row per experiment (experimentId is PK).
- When an experiment is deleted, its reminder row is deleted (onDelete: Cascade).

**Migration:** `prisma/migrations/20260129120000_add_experiment_reminder/migration.sql`

Run: `npx prisma migrate deploy` (or `npx prisma migrate dev`).

---

## API

### GET /api/experiments/[id]/reminder

- **Auth:** Required. `requireExperimentOwner(experimentId, userId)`. 404 if not found or not owned.
- **Response:** `{ paused: boolean, pausedAt: string | null }` (pausedAt ISO when paused, else null).

### POST /api/experiments/[id]/reminder/pause

- **Auth:** Required. `requireExperimentOwner(experimentId, userId)`. 404 if not found or not owned.
- **Effect:** Upsert `ExperimentReminder` for this experiment; set `pausedAt = now()`, `updatedAt = now()`.
- **Response:** `{ paused: true, pausedAt: string }` (ISO).

### POST /api/experiments/[id]/reminder/resume

- **Auth:** Required. `requireExperimentOwner(experimentId, userId)`. 404 if not found or not owned.
- **Effect:** Upsert `ExperimentReminder`; set `pausedAt = null`, `updatedAt = now()`.
- **Response:** `{ paused: false, pausedAt: null }`.

---

## Cron update (Phase R.1)

In **GET /api/cron/checkin-reminders**:

- Load active experiments **including** `reminder: { select: { pausedAt: true } }`.
- When building the “needs reminder” list, **skip** any experiment where `reminder?.pausedAt != null`.
- No other cron logic changed.

---

## Out of scope (Phase R.3)

- UI changes
- Custom reminder times
- Snooze logic
- Push notifications
- AI
