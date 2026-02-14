# Phase 2A.2 — Insights Trends (READ-ONLY)

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

**Ownership enforced:** Same as Phase 2A.1 (requireExperimentOwner(experimentId, userId)). 401 if not authenticated; 404 if experiment not found or not owned.

---

## API

**GET /api/experiments/[id]/insights/trends**

- **Auth:** 401 if not authenticated. 404 if experiment not found or not owned by the current user.
- **Data load:** Same as summary: experiment with `fields` (order asc), `checkIns` (order by `checkInDate` **asc**), each check-in with `responses` including `field`. Check-in dates are used as-is (UTC-normalized per Phase 1.1).
- **Computation:** Per-field trends from time-ordered check-ins/responses (see below). No AI, no persistence.
- **Response:** JSON validated with Zod before return.

---

## Per-field trend by type

| type       | trend shape                                                 | description                                                                                                                                              |
| ---------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **text**   | `{ countOverTime: Array<{ date: string, count: number }> }` | One entry per check-in date; count of non-empty text responses for that field on that date.                                                              |
| **number** | `{ direction: "increasing" \| "decreasing" \| "flat" }`     | Compare average of first 25% of values vs last 25% (by check-in order). Normalized diff &gt; 5% of range → increasing; &lt; −5% → decreasing; else flat. |
| **emoji**  | `{ moodTrend: "up" \| "down" \| "flat" }`                   | Same logic as number on `responseNumber` (1..emojiCount); mapped to up / down / flat.                                                                    |
| **yesno**  | `{ yesRateTrend: "up" \| "down" \| "flat" }`                | Yes-rate over time: compare yes-rate in first 25% of responses vs last 25%; threshold 5% for flat.                                                       |
| **select** | `{ dominantOverTime?: string[] }`                           | Optional: one entry per check-in date (same order as check-ins); value is `selectedOption` for that day or `""` if none.                                 |

Unknown field types are treated as **text** (countOverTime only).

---

## Response shape (Zod-validated)

```ts
{
  experimentId: string,
  generatedAt: string,  // ISO
  fields: Array<
    | { fieldId: string, label: string, type: "text", trend: { countOverTime: Array<{ date: string, count: number }> } }
    | { fieldId: string, label: string, type: "number", trend: { direction: "increasing" | "decreasing" | "flat" } }
    | { fieldId: string, label: string, type: "yesno", trend: { yesRateTrend: "up" | "down" | "flat" } }
    | { fieldId: string, label: string, type: "emoji", trend: { moodTrend: "up" | "down" | "flat" } }
    | { fieldId: string, label: string, type: "select", trend: { dominantOverTime?: string[] } }
  >
}
```

---

## Assumptions

- **One check-in per day** (Phase 1.1): `checkInDate` is UTC start-of-day; time order is check-in order.
- **Single response per field per check-in** in practice; trends use the value present for that check-in (or empty/missing).
- **Trend thresholds:** 5% of range (number/emoji) or 5% absolute (yesno) used to decide “flat” vs up/down; no config.
- **Quartiles:** First/last 25% of time-ordered points used for comparison; small N uses at least 1 point per half.

---

## Limitations

- **No seasonality or smoothing:** Trends are simple first-quarter vs last-quarter (or first/last value when N is small). No regression, no moving average.
- **Sparse data:** Missing responses for a check-in are skipped for numeric/emoji/yesno; direction is based only on existing values. Text countOverTime includes every check-in date (count may be 0).
- **Select “dominant over time”:** Implemented as the chosen option per check-in date (one value per day), not a single “dominant” label for the whole series.
- **No caching:** Each request recomputes from DB. No TTL or cache headers.
- **Personal experiments only:** No org/team or frequency logic (same as Phase 2A rules).

---

## Implementation notes

- **Route:** `src/app/api/experiments/[id]/insights/trends/route.ts`
- **Zod:** Response is parsed with `insightsTrendsResponseSchema` before sending; 500 if validation fails.
- **Dependency:** Uses existing `zod` (same as Phase 2A.1).

---

## Explicit non-goals (Phase 2A.2)

- No AI (Phase 2A.3).
- No persistence of trends.
- No organisation, team, or frequency logic.
- No schema changes, no writes.
