# Phase 1.4 — Experiment data safety & immutability (field structure lock)

**Date:** 2026-02-07  
**Scope:** Backend only. No UI changes. No schema changes.

---

## What changed

### Rule: Lock field structure once check-ins exist

If an experiment has **at least one check-in**, its **field definitions** are treated as read-only. Any attempt to add, remove, or change fields returns **400** with:

```json
{
  "error": "Experiment structure is locked",
  "detail": "You cannot modify fields after check-ins have been recorded."
}
```

### Where the lock is enforced

1. **PATCH /api/experiments/[id]**  
   If `body.fields` is present and the experiment has any check-ins, the request is rejected with 400. Other updates (title, whyMatters, hypothesis, durationDays, frequency, faithEnabled, scriptureNotes, status) are still allowed.

2. **POST /api/experiments/[id]/fields**  
   If the experiment has any check-ins, creating a new field is rejected with 400.

3. **PATCH /api/experiments/[id]/fields/[fieldId]**  
   If the experiment has any check-ins, updating the field (label, type, required, order, constraints, etc.) is rejected with 400.

4. **DELETE /api/experiments/[id]/fields/[fieldId]**  
   If the experiment has any check-ins, deleting the field is rejected with 400.

### Helper

**File:** `src/lib/permissions.ts`

- **`experimentHasCheckIns(experimentId: string): Promise<boolean>`**  
  Returns true if the experiment has at least one check-in (count > 0). Used by the four routes above before performing any field add/update/delete.

---

## Allowed when lock is active

- **Experiment metadata** (PATCH experiment): title, whyMatters, hypothesis, durationDays, frequency, faithEnabled, scriptureNotes, status (via existing lifecycle rules), startedAt/completedAt as set by lifecycle.
- **Reading** fields and check-ins: GET experiment, GET fields, GET check-ins unchanged.
- **Creating/updating/deleting check-ins**: Unchanged; only field _definitions_ are locked.

---

## Rationale

- Prevents accidental data loss (e.g. deleting a field that has responses).
- Keeps stored responses consistent with field types and constraints (no changing type or options after data exists).
- Simple rule: “has check-ins ⇒ no field structure changes.”

---

## Explicit non-goals

- No UI changes (e.g. hiding or disabling field edit/delete when lock applies).
- No schema changes.
- No organisation logic.
