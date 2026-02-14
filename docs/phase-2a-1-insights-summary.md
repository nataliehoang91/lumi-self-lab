# Phase 2A.1 — Insights Summary (READ-ONLY)

**Date:** 2026-02-07

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

**Ownership enforced:** Access is allowed only if `requireExperimentOwner(experimentId, userId)` (i.e. experiment exists and `clerkUserId === userId`). Same rule as GET /api/experiments/[id].

---

## API

**GET /api/experiments/[id]/insights/summary**

- **Auth:** 401 if not authenticated. 404 if experiment not found or not owned by the current user.
- **Data load:** Same ownership as GET experiment. Include: `fields` (order asc), `checkIns` (order by checkInDate **asc**), each check-in with `responses` including `field`.
- **Computation:** Responses are grouped by fieldId. For each field, a summary is computed from its `type` (see below). No trends; no persistence.
- **Response:** JSON validated with Zod before return.

---

## Per-field summary by type

| type       | summary shape                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------- |
| **text**   | `{ responseCount: number }`                                                                     |
| **number** | `{ count, min, max, avg: number }`                                                              |
| **yesno**  | `{ count, yesCount, noCount: number; yesPercentage: number }`                                   |
| **emoji**  | `{ count, avgScore: number; distribution: Record<string, number> }` (key = value 1..emojiCount) |
| **select** | `{ count: number; optionCounts: Record<string, number> }`                                       |

Fields with no responses: number/emoji get count 0 and min/max/avg 0 or avgScore 0; yesno get count 0, yesPercentage 0; text/select get count 0 or responseCount 0.

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
    summary: { ... }  // type-specific as above
  }>
}
```

---

## Implementation notes

- **Route:** `src/app/api/experiments/[id]/insights/summary/route.ts`
- **Zod:** Response is parsed with `insightsSummaryResponseSchema` before sending; 500 if validation fails (should not happen for correct computation).
- **Unknown field type:** If a field has a type not in the five above, it is treated as text and `summary.responseCount` is returned.
- **Dependency:** `zod` was added to `package.json`; run `npm install` if needed.

---

## Explicit non-goals (Phase 2A.1)

- No trends (Phase 2A.2).
- No AI (Phase 2A.3).
- No organisation, team, or frequency logic.
- No schema changes, no writes, no caching.
