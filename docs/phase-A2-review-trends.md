# Phase A.2 — Review Trends (READ-ONLY)

**Date:** 2026-01-29

---

## Tables used (read-only)

| Table                       | Usage                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| **Experiment**              | Loaded by id + clerkUserId (ownership).                            |
| **ExperimentField**         | Loaded via experiment include; ordered by `order` asc.             |
| **ExperimentCheckIn**       | Loaded via experiment include; ordered by `checkInDate` asc (UTC). |
| **ExperimentFieldResponse** | Loaded via checkIns include; each response includes `field`.       |

**No Prisma schema changes.** No migrations. No new tables or columns.

**No writes.** This API only reads data and returns computed trends.

**Ownership:** Access only if `requireExperimentOwner(experimentId, userId)`. 401 if not authenticated; 404 if experiment not found or not owned. Personal experiments only.

---

## API

**GET /api/experiments/[id]/review/trends**

- **Auth:** Require authenticated user. Use `requireExperimentOwner(experimentId, userId)`. 404 if experiment not found or not owned.
- **Data load:** Same as A.1. One experiment by id + clerkUserId. Include: `fields` (orderBy order asc), `checkIns` (orderBy checkInDate asc), each check-in with `responses` including `field`. No additional queries. checkInDate is UTC start-of-day (Phase 1.1).
- **Computation:** Responses ordered by checkInDate asc. Per-field trend by type (see below). No AI; no persistence.
- **Response:** JSON validated with Zod before return. 500 if validation fails.

---

## Per-field trend by type

| type       | trend shape                                                 | logic                                                                                                                                           |
| ---------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **text**   | `{ countOverTime: Array<{ date: string, count: number }> }` | One entry per check-in date; count = non-empty responseText for that date. Count may be 0.                                                      |
| **number** | `{ direction: "increasing" \| "decreasing" \| "flat" }`     | responseNumber in time order. Compare avg of first 25% vs last 25%. If (last − first) / range > 5% → increasing; < −5% → decreasing; else flat. |
| **emoji**  | `{ moodTrend: "up" \| "down" \| "flat" }`                   | Same as number (responseNumber 1..emojiCount); map increasing→up, decreasing→down, flat→flat.                                                   |
| **yesno**  | `{ yesRateTrend: "up" \| "down" \| "flat" }`                | Yes-rate over time. Compare yes-rate in first 25% vs last 25%. If diff > 5% → up/down; else flat.                                               |
| **select** | `{ dominantOverTime?: string[] }`                           | One entry per check-in date: selectedOption for that date, or "" if no response.                                                                |

**Unknown field type:** Treated as text (countOverTime, non-empty responseText count per date).

---

## Response shape (Zod-validated)

```ts
{
  experimentId: string,
  generatedAt: string,  // ISO
  fields: Array<
    | { fieldId: string, label: string, type: "text", trend: { countOverTime: Array<{ date: string, count: number }> } }
    | { fieldId: string, label: string, type: "number", trend: { direction: "increasing" | "decreasing" | "flat" } }
    | { fieldId: string, label: string, type: "emoji", trend: { moodTrend: "up" | "down" | "flat" } }
    | { fieldId: string, label: string, type: "yesno", trend: { yesRateTrend: "up" | "down" | "flat" } }
    | { fieldId: string, label: string, type: "select", trend: { dominantOverTime?: string[] } }
  >
}
```

---

## Implementation notes

- **Route:** `src/app/api/experiments/[id]/review/trends/route.ts`
- **Zod schema:** `src/lib/review-trends-schema.ts` — `reviewTrendsResponseSchema`, `fieldTrendItemSchema`, etc.
- **Threshold:** 5% for flat vs up/down (TREND_FLAT_THRESHOLD = 0.05). First 25% vs last 25% of time-ordered values.
- **Date in countOverTime:** Date string (YYYY-MM-DD) from checkInDate for each check-in.

---

## Explicit non-goals (Phase A.2)

- No AI reflection (Phase A.3).
- No refactor of A.1.
- No organisation, team, or frequency logic.
- No schema changes, no writes.
