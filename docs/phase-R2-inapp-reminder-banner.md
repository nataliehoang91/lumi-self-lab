# Phase R.2 — In-app Check-in Reminder (UI only)

**Date:** 2026-01-29

---

## Goal

Show an **in-app reminder banner** on the experiment detail page when the user should check in today (UTC). UI only; no schema changes, no new APIs, no email logic, no AI.

---

## Rules

- **UI only.** No Prisma changes, no migrations, no new backend APIs, no email, no AI.
- **Same UTC logic as Phase 1.1.** Use `toStartOfDayUTC` from `@/lib/date-utils`; “today” = start-of-day UTC; check-in is “today” if its date string equals today’s UTC date string.

---

## When the banner is shown

The banner is shown **IFF all** of the following are true:

1. `experiment.status === "active"`
2. `experiment.startedAt != null` (in UI: `experiment.startDate != null`)
3. There is **no check-in for today (UTC)** — i.e. no check-in whose `checkInDate` (as YYYY-MM-DD) equals today’s UTC date.
4. Reminder is **not paused** — `reminder.pausedAt === null` (i.e. `reminder.paused === false`).

**Not considered in R.2:** `snoozedUntil` (handled in R.4).

---

## Data sources

- **Experiment + check-ins:** From the existing experiment detail page (server-loaded experiment with `checkIns[]`). No new API.
- **Reminder state:** `GET /api/experiments/[id]/reminder` → `{ paused: boolean, pausedAt: string | null }`. Fetched client-side by the detail page when rendering the banner.

---

## Component

**`src/components/Experiment/CheckInReminderBanner.tsx`**

- **Props:**
  - `experiment: ExperimentWithCheckIns` — at least `id`, `status`, `startDate`, `checkIns[]` with `checkInDate`.
  - `reminder: { paused: boolean, pausedAt: string | null }`.
  - `children?` — optional CTA (e.g. “Check in” button) rendered inside the banner.
- **Logic:** Compute today UTC date string; check no check-in has that date; check active, started, not paused; if all pass, render banner; otherwise return `null`.

---

## Integration

- **Experiment detail client:** `ExperimentDetailClient` in `src/app/(individual)/experiments/[id]/ExperimentDetailClient.tsx`:
  - On mount, fetches `GET /api/experiments/[id]/reminder` and stores `reminder` in state.
  - Renders `CheckInReminderBanner` with `experiment` (from props) and `reminder` (from state) only when `reminder !== null`.
  - Passes a “Check in now” button as `children` that opens the existing check-in dialog.

---

## Out of scope (Phase R.2)

- Snooze / `snoozedUntil` (R.4)
- Custom reminder times
- Push notifications
- Backend or schema changes
