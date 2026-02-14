# Phase A.3 — Review Result (READ-ONLY, NON-AI)

**Date:** 2026-01-29

---

## Purpose

Single API that aggregates **experiment metadata**, **review summary**, and **review trends** into one deterministic response for the Review screen. No AI. No writes. No schema changes.

---

## Tables used (read-only)

| Table                       | Usage                                                                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Experiment**              | Loaded by id + clerkUserId (ownership); metadata (id, title, hypothesis, whyMatters, status, startedAt, completedAt, durationDays). |
| **ExperimentField**         | Via experiment include; order asc.                                                                                                  |
| **ExperimentCheckIn**       | Via experiment include; checkInDate asc (for stats and trends).                                                                     |
| **ExperimentFieldResponse** | Via checkIns include; for summary and trends.                                                                                       |

**No Prisma schema changes.** No migrations. No writes.

**Ownership:** `requireExperimentOwner(experimentId, userId)`. 401 if not authenticated; 404 if experiment not found or not owned. Personal experiments only.

---

## API

**GET /api/experiments/[id]/review/result**

- **Auth:** Require authenticated user. Use `requireExperimentOwner(experimentId, userId)`. 404 if not found or not owned.
- **Data load:** One experiment by id + clerkUserId. Include: `fields` (orderBy order asc), `checkIns` (orderBy checkInDate asc), each check-in with `responses` including `field`. No additional queries.
- **Reuse:** Summary and trends are computed via shared helpers (`computeReviewSummaryFields`, `computeReviewTrendsFields`) from `@/lib/review-summary` and `@/lib/review-trends`. No duplicated aggregation logic.
- **Response:** Zod-validated. 500 if validation fails.

---

## Response shape

```ts
{
  experiment: {
    id: string,
    title: string,
    hypothesis: string | null,
    whyMatters: string | null,
    status: string,
    startedAt: string | null,   // ISO
    completedAt: string | null  // ISO
  },
  stats: {
    totalCheckIns: number,
    daysCovered: number,
    completionRate?: number     // optional; omitted if durationDays missing or 0
  },
  summary: {
    experimentId: string,
    generatedAt: string,
    fields: Array<...>         // same as GET .../review/summary
  },
  trends: {
    experimentId: string,
    generatedAt: string,
    fields: Array<...>          // same as GET .../review/trends
  },
  generatedAt: string          // ISO
}
```

---

## Stats computation

- **totalCheckIns:** `experiment.checkIns.length`.
- **daysCovered:** Number of calendar days from first to last check-in (inclusive). 0 if no check-ins. Formula: `1 + floor((lastCheckInDate - firstCheckInDate) / MS_PER_DAY)`.
- **completionRate:** If `durationDays` is present and > 0: `min(1, totalCheckIns / durationDays)`. Otherwise omitted (safe default).

---

## Implementation notes

- **Route:** `src/app/api/experiments/[id]/review/result/route.ts`
- **Zod schema:** `src/lib/review-result-schema.ts` — `reviewResultResponseSchema`, `experimentMetaSchema`, `reviewResultStatsSchema`. Reuses `reviewSummaryResponseSchema` and `reviewTrendsResponseSchema` for nested summary/trends.
- **Shared helpers:** Summary and trends come from `computeReviewSummaryFields(experiment)` and `computeReviewTrendsFields(experiment)`. Summary and trends routes use the same helpers (no duplicated logic).

---

## Explicit non-goals (Phase A.3)

- No AI.
- No new tables or schema changes.
- No writes.
- No organisation or team logic.
