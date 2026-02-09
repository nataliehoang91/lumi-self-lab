# Phase 1.3 — Experiment creation & start semantics (backend)

**Date:** 2026-02-07  
**Scope:** Backend only. No UI changes. No schema changes.

---

## Why experiments start as draft

In research and behavioral-tracking workflows, **defining** an experiment and **running** it are separate steps:

- **Definition:** Title, hypothesis, duration, frequency, and field design. The user can edit these without affecting data collection.
- **Running:** The decision to start collecting check-ins on a given date. From that point, the experiment is “active” and `startedAt` is fixed.

Creating an experiment with `status: "active"` blurs this distinction and can imply that collection has started before the user explicitly starts it. By making all new experiments **draft**, the backend enforces:

1. Creation = definition only (draft, no start date).
2. Becoming active = explicit start action (draft → active, with `startedAt` set).

---

## Difference between defining and running

| Step        | Meaning                    | Backend behavior                                  |
|------------|----------------------------|---------------------------------------------------|
| **Create** | Define the experiment      | Always `status: "draft"`, `startedAt: null`, `completedAt: null`. |
| **Start**  | Begin data collection      | PATCH with `status: "active"` (from draft only). Sets `startedAt`. |
| **Complete** | End data collection     | PATCH with `status: "completed"` (from active only). Sets `completedAt`. |

Check-ins are only allowed when the experiment is **active** and **started** (Phase 1 lifecycle). So no check-ins can be recorded until the user has started the experiment.

---

## How startedAt is determined

**On create (POST /api/experiments):**

- `status` from the client is **ignored**. The experiment is always created with:
  - `status: "draft"`
  - `startedAt: null`
  - `completedAt: null`

**On start (PATCH /api/experiments/[id]):**

- Starting is the transition **draft → active** (already enforced in Phase 1).
- When that transition occurs:
  - `startedAt` is set to:
    - `body.startedAt` (as a date) if the client sends it, or
    - `new Date()` (server “now”) if not.
- So the client can pass a start date (e.g. “I started yesterday”) or omit it to use the current time.

`completedAt` is set only when transitioning **active → completed**, as in Phase 1.

---

## Explicit non-goals

- No UI changes (wording of “Start” / “Publish” unchanged).
- No scheduling or frequency enforcement.
- No organisation logic.
- No analytics or summaries.

---

## Summary

- **POST /api/experiments:** Always creates with `status: "draft"`, `startedAt: null`, `completedAt: null`. Client `status` is ignored.
- **PATCH (draft → active):** Sets `startedAt` from `body.startedAt` or `new Date()`. This matches existing Phase 1 lifecycle rules.
