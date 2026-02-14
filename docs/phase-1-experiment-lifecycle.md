# Phase 1 — Experiment status & lifecycle (backend)

**Date:** 2026-02-07  
**Scope:** Server-side rules only. No schema changes. No UI changes in this step.

---

## What changed

### 1. Check-ins allowed only when experiment is active and started

**File:** `src/app/api/experiments/[id]/checkins/route.ts`

- **POST** (create check-in) now checks before creating:
  - `experiment.status === "active"`  
    If not → **400** with message:  
    `"You can only add check-ins when the experiment is active. Start the experiment first."`
  - `experiment.startedAt` is not null  
    If null → **400** with message:  
    `"The experiment has not been started yet. Use Start experiment to set the start date."`

- These checks run after ownership and after `checkInDate` required check.
- No change to GET (listing check-ins); listing is still allowed for any status.

### 2. Status transitions enforced in PATCH experiment

**File:** `src/app/api/experiments/[id]/route.ts`

- **PATCH** `/api/experiments/[id]` now validates `body.status` when present.

**Allowed transitions:**

| From      | To        | Notes                                                                                   |
| --------- | --------- | --------------------------------------------------------------------------------------- |
| draft     | active    | Allowed. `startedAt` is set to `body.startedAt` or `new Date()` when transitioning.     |
| active    | completed | Allowed. `completedAt` is set to `body.completedAt` or `new Date()` when transitioning. |
| draft     | draft     | No-op (allowed).                                                                        |
| active    | active    | No-op (allowed).                                                                        |
| completed | completed | No-op (allowed).                                                                        |

**Disallowed transitions (400):**

- completed → active
- completed → draft
- active → draft

Response body:

```json
{
  "error": "Invalid status transition",
  "detail": "Cannot change status from <current> to <requested>. Allowed: draft→active, active→completed."
}
```

- When transitioning **draft → active**, the API sets `startedAt` if not already set (uses `body.startedAt` if provided, otherwise `new Date()`).
- When transitioning **active → completed**, the API sets `completedAt` if not already set (uses `body.completedAt` if provided, otherwise `new Date()`).
- If `body.status` is omitted, no transition check runs; other fields (including `startedAt` / `completedAt`) can still be updated as before.

---

## What is intentionally NOT handled (this step)

- **PATCH check-in:** Editing an existing check-in is not gated by experiment status. Only **creating** a new check-in requires active + startedAt.
- **GET check-ins:** Still allowed for any experiment status (owner only).
- **Schema:** No new columns, no unique constraints, no migrations.
- **UI:** No changes to forms, buttons, or redirects. Frontend can still send invalid transitions and will receive 400; UI updates (e.g. disabling invalid status options) can be done in a later step.
- **Organisation / teams / invites:** Not touched.

---

## Summary

- Check-ins can only be **created** when the experiment is **active** and **started** (status + startedAt enforced in POST checkins).
- Experiment status can only move **draft → active** or **active → completed**; reversing (e.g. completed → active) or going back to draft is rejected with 400.
- `startedAt` is set when moving to active; `completedAt` is set when moving to completed.
