# Phase A.1 — Review Summary (READ-ONLY)

**Date:** 2026-01-29

---

## Tables used (read-only)

| Table                       | Usage                                                        |
| --------------------------- | ------------------------------------------------------------ |
| **Experiment**              | Loaded by id + clerkUserId (ownership).                      |
| **ExperimentField**         | Loaded via experiment include; ordered by `order` asc.       |
| **ExperimentCheckIn**       | Loaded via experiment include; ordered by `checkInDate` asc. |
| **ExperimentFieldResponse** | Loaded via checkIns include; each response includes `field`. |

**No Prisma schema changes.** No migrations. No new tables or columns.

**No writes.** This API only reads data and returns a computed summary.

**Ownership:** Access only if `requireExperimentOwner(experimentId, userId)`. 401 if not authenticated; 404 if experiment not found or not owned. Personal experiments only.

---

## API

**GET /api/experiments/[id]/review/summary**

- **Auth:** Require authenticated user. Use `requireExperimentOwner(experimentId, userId)`. 404 if experiment not found or not owned.
- **Data load:** One experiment by id + clerkUserId. Include: `fields` (orderBy order asc), `checkIns` (orderBy checkInDate asc), each check-in with `responses` including `field`. No additional queries.
- **Computation:** Responses grouped by fieldId. Per-field summary by type (see below). No trends; no persistence.
- **Response:** JSON validated with Zod before return. 500 if validation fails.

---

## Per-field summary by type

| type       | summary shape                                                                              |
| ---------- | ------------------------------------------------------------------------------------------ |
| **text**   | `{ responseCount: number }` — count of non-empty responseText                              |
| **number** | `{ count, min, max, avg: number }`                                                         |
| **yesno**  | `{ count, yesCount, noCount: number; yesPercentage: number }` (0–100)                      |
| **emoji**  | `{ count, avgScore: number; distribution: Record<string, number> }` (keys "1"..emojiCount) |
| **select** | `{ count: number; optionCounts: Record<string, number> }` (key = option string)            |

**Fields with no responses:** count/counts = 0; averages = 0; yesPercentage = 0; distributions/optionCounts empty or zeroed.

**Unknown field type:** Treated as text (responseCount of non-empty responseText).

---

## Response shape (Zod-validated)

```ts
{
  experimentId: string,
  generatedAt: string,  // ISO
  fields: Array<{
    fieldId: string,
    label: string,
    type: "text" | "number" | "yesno" | "emoji" | "select",
    summary: object   // type-specific as above
  }>
}
```

---

## Implementation notes

- **Route:** `src/app/api/experiments/[id]/review/summary/route.ts`
- **Zod:** Response is parsed with `reviewSummaryResponseSchema` before sending; 500 if validation fails.
- **Text responseCount:** Only responses with non-null, non-empty (after trim) responseText are counted.

---

## Explicit non-goals (Phase A.1)

- No trends (Phase A.2).
- No AI reflection (Phase A.3).
- No organisation, team, or frequency logic.
- No schema changes, no writes, no caching.
