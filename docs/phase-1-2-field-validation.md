# Phase 1.2 — Experiment field & response validation (backend)

**Date:** 2026-02-07  
**Scope:** Backend only. No UI changes. No schema changes.

---

## What changed

### 1. Shared validation module

**File:** `src/lib/checkin-response-validation.ts` (new)

- **`validateCheckInResponses(fields, responses): ValidationError | null`**  
  Accepts the experiment’s field definitions and the request’s response array. Returns the first validation error (with `error`, `fieldId`, `reason`) or `null` if all responses are valid.

- **Required fields:** For each field with `required === true`, a response for that `fieldId` must be present and pass the type-specific rules below. Otherwise validation fails with a message like “Required … field is missing” or “Required … field is empty.”

- **Unknown fieldId:** If a response’s `fieldId` is not in the experiment’s fields, validation fails with “Field does not belong to this experiment.”

### 2. Validation rules per field type

| Type   | Value source     | Rules |
|--------|------------------|--------|
| **text**   | `responseText`   | Must be a string. If `required`, value must be present and non-empty (after trim). |
| **number** | `responseNumber` | Must be a number (reject NaN). If `minValue` is set, value ≥ minValue. If `maxValue` is set, value ≤ maxValue. If `required`, value must be present. |
| **yesno**  | `responseBool`   | Must be a boolean. If `required`, value must be present. |
| **emoji**  | `responseNumber` | Must be an integer in [1, emojiCount] (inclusive). `emojiCount` must be > 0. If `required`, value must be present. |
| **select** | `selectedOption` | Must be a string that appears in `selectOptions`. If `required`, value must be present and non-empty. |

### 3. POST /api/experiments/[id]/checkins

**File:** `src/app/api/experiments/[id]/checkins/route.ts`

- Before creating the check-in, the route loads the experiment’s fields and runs `validateCheckInResponses(fields, body.responses)`.
- If validation returns an error, the route responds with **400** and the error object:
  ```json
  {
    "error": "Invalid field response",
    "fieldId": "<id>",
    "reason": "<human readable message>"
  }
  ```
- Only if validation passes does the check-in (and its responses) get created.

### 4. PATCH /api/experiments/[id]/checkins/[checkInId]

**File:** `src/app/api/experiments/[id]/checkins/[checkInId]/route.ts`

- When `body.responses` is present, the route loads the experiment’s fields and runs `validateCheckInResponses(fields, body.responses)`.
- If validation returns an error, the route responds with **400** and the same error shape as above.
- Only if validation passes does the route proceed to delete/upsert responses and update the check-in.

---

## API error behavior

- **Status code:** 400 Bad Request when validation fails.
- **Body:** Exactly the object returned by the validator: `{ error: "Invalid field response", fieldId, reason }`.
- **First error only:** Validation stops at the first failing field (required-field check first, then each response in order).
- No partial persist: invalid payloads are rejected entirely; no responses are created or updated.

---

## Known limitations

- **Client can still send invalid input:** The UI is unchanged. Clients may submit missing required fields, out-of-range numbers, or invalid select options. The server now rejects such payloads with 400, so invalid data is not stored. Improving client-side validation or UX (e.g. inline errors) is out of scope for this phase.
- **No schema change:** Field definitions and response columns are unchanged. Validation is logic-only in the API layer.
- **Single error:** Only one error is returned per request. A payload with multiple invalid fields will still result in one 400 with the first error. Returning a list of all errors could be added later.

---

## Explicit non-goals

- No UI validation changes.
- No frequency or analytics logic.
- No organisation or team logic.
- No schema or migration.

---

## Summary

- All check-in responses (create and update) are validated against the experiment’s field definitions before any write.
- Invalid or inconsistent data is rejected with 400 and a structured error; the backend is the single source of truth for what is allowed.
