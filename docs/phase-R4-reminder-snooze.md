# Phase R.4 — Snooze Check-in Reminder (minimal, per-experiment)

**Date:** 2026-01-29

---

## Goal

Add **temporary snooze** for daily check-in reminders. Snooze applies to the in-app banner (R.2) and the daily email cron (R.1).

- **Pause** (R.3) = indefinite; user manually resumes.
- **Snooze** (R.4) = temporary; auto-resumes after a given date/time.

---

## Schema (minimal)

**Extend `ExperimentReminder`:**

| Column       | Type      | Notes                                                                                                                      |
| ------------ | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| snoozedUntil | DateTime? | When set, reminders (banner + email) are suppressed until this time. After this time, reminder is effectively not snoozed. |

**Migration:** `prisma/migrations/20260129130000_add_reminder_snoozed_until/migration.sql`

Run: `npx prisma migrate deploy` (or `npx prisma migrate dev`).

---

## API

### GET /api/experiments/[id]/reminder (updated)

- **Response** now includes:
  - `paused`, `pausedAt` (unchanged)
  - `snoozed: boolean` — `true` when `snoozedUntil != null` and current time &lt; `snoozedUntil`
  - `snoozedUntil: string | null` — ISO datetime when snooze ends

### POST /api/experiments/[id]/reminder/snooze

- **Auth:** Required. `requireExperimentOwner(experimentId, userId)`. 404 if not found or not owned.
- **Body:** `{ until: string }` — ISO date or datetime (e.g. `"2026-01-30T14:00:00.000Z"`).
- **Effect:** Upsert `ExperimentReminder`; set `snoozedUntil = new Date(until)`, `updatedAt = now()`.
- **Validation:** 400 if `until` missing or not a valid date/datetime.
- **Response:** `{ snoozed: true, snoozedUntil: string }` (ISO).

---

## Cron (R.1)

In **GET /api/cron/checkin-reminders**:

- Load `reminder` with `snoozedUntil` in the select.
- Skip sending email if **paused** (unchanged) or if **snoozed:** `snoozedUntil != null && now < snoozedUntil`.

---

## In-app banner (R.2)

In **CheckInReminderBanner**:

- **ReminderState** extended with optional `snoozed` and `snoozedUntil`.
- Banner is **hidden** when:
  - `reminder.snoozed === true`, or
  - `reminder.snoozedUntil` is set and `new Date(reminder.snoozedUntil) > new Date()`.

GET /reminder returns `snoozed` and `snoozedUntil`; the experiment detail client passes them through so the banner respects snooze.

---

## Files

| File                                                                        | Change                                                |
| --------------------------------------------------------------------------- | ----------------------------------------------------- |
| `prisma/schema.prisma`                                                      | Add `snoozedUntil DateTime?` to `ExperimentReminder`. |
| `prisma/migrations/20260129130000_add_reminder_snoozed_until/migration.sql` | Add column.                                           |
| `src/app/api/experiments/[id]/reminder/route.ts`                            | GET returns `snoozed`, `snoozedUntil`.                |
| `src/app/api/experiments/[id]/reminder/snooze/route.ts`                     | **New.** POST snooze with `until`.                    |
| `src/app/api/cron/checkin-reminders/route.ts`                               | Skip when snoozed.                                    |
| `src/components/Experiment/CheckInReminderBanner.tsx`                       | Hide when snoozed.                                    |
| `src/app/(individual)/experiments/[id]/ExperimentDetailClient.tsx`          | Pass `snoozed` / `snoozedUntil` from GET reminder.    |

---

## Out of scope (Phase R.4)

- UI for “Snooze until…” (call POST /snooze from UI when implemented).
- Changing pause/resume behavior.
- Per-field or custom reminder times.
