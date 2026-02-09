# Phase 1.1 — Check-in date integrity (backend)

**Date:** 2026-02-07  
**Scope:** Backend only. No UI changes. No schema changes.

---

## What changed

### 1. Date normalization helper

**File:** `src/lib/date-utils.ts` (new)

- **`toStartOfDayUTC(input: string | Date): Date`**  
  Normalizes any date to **00:00:00.000 UTC** for that calendar day (using UTC year, month, date). Used for storing check-in dates and for all duplicate-check and filter logic.

- **`startOfNextDayUTC(startOfDay: Date): Date`**  
  Returns the start of the next UTC day (midnight). Used as the exclusive end of a day range for queries.

### 2. POST /api/experiments/[id]/checkins (create)

**File:** `src/app/api/experiments/[id]/checkins/route.ts`

- Incoming **`checkInDate`** is normalized with `toStartOfDayUTC(checkInDate)` before any use.
- **Duplicate check:** A check-in is considered to exist for “this date” if any row has `checkInDate` in the range `[normalizedDate, startOfNextDayUTC(normalizedDate))`. If one exists → **409** with message `"A check-in already exists for this date."`
- The check-in is **stored** with `checkInDate: normalizedDate` (start-of-day UTC).

### 3. GET /api/experiments/[id]/checkins (list with date filter)

**File:** `src/app/api/experiments/[id]/checkins/route.ts`

- When query param **`date`** is present, the filter uses normalized bounds:
  - `startOfDay = toStartOfDayUTC(dateFilter)`
  - `endExclusive = startOfNextDayUTC(startOfDay)`
  - `where.checkInDate = { gte: startOfDay, lt: endExclusive }`
- So “filter by date” means “all check-ins whose stored date falls in that UTC calendar day.” Existing rows stored with non-midnight times still match if they fall in that day.

### 4. PATCH /api/experiments/[id]/checkins/[checkInId] (update)

**File:** `src/app/api/experiments/[id]/checkins/[checkInId]/route.ts`

- When **`body.checkInDate`** is present:
  - It is normalized: `normalizedDate = toStartOfDayUTC(body.checkInDate)`.
  - The API looks for **another** check-in (same experiment, `id !== checkInId`) with `checkInDate` in `[normalizedDate, startOfNextDayUTC(normalizedDate))`.
  - If found → **409** with message `"A check-in already exists for this date."`
  - If not found, the check-in is updated with `checkInDate: normalizedDate`.

---

## Date normalization strategy

- **Canonical day:** One check-in per experiment per **UTC calendar day**.
- **Storage:** New and updated check-in dates are stored as **start of that day in UTC** (00:00:00.000).
- **Comparisons:** Duplicate checks and date filters use a half-open range `[startOfDayUTC, startOfNextDayUTC)` so that:
  - Any existing row whose timestamp falls in that UTC day is treated as “that day.”
  - Behavior is deterministic and timezone-safe: the server does not depend on client or server local time for the boundary.
- **Client:** The client can send any ISO date or datetime; the server reduces it to the UTC calendar day and stores/computes from that.

---

## Known limitations (no DB constraint yet)

- **No unique constraint:** Uniqueness is enforced only in application code (query before create/update). A concurrent request could still insert a second check-in for the same day before the first commit; a DB unique index on `(experimentId, date)` or similar would require a schema change and is out of scope for this phase.
- **Existing data:** Rows created before this change may have `checkInDate` at non-midnight (e.g. client’s local noon). They continue to work: duplicate check and date filter use a day range, so all such rows still match the correct UTC day.
- **No per-user timezone:** The “day” is defined in UTC only. We do not store or interpret the user’s timezone for check-in dates in this phase.

---

## Explicit non-goals

- No UI changes.
- No organisation logic.
- No per-field or per-experiment frequency rules.
- No analytics or summaries.
- No schema or migration.

---

## Summary

- Create and update check-in flows normalize `checkInDate` to start-of-day UTC and enforce one check-in per experiment per (UTC) calendar day via range checks; duplicate or conflicting update returns 409.
- GET check-ins date filter uses the same normalized day range.
- New and updated check-ins are stored with a normalized date; existing data remains valid and continues to work with range-based logic.
