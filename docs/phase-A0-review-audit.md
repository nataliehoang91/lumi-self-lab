# Phase A.0 — Review & Results Audit (DOC ONLY)

**Date:** 2026-01-29  
**Mode:** Investigation and documentation only. No code changes. No schema changes.

---

## Purpose

Before implementing Phase A (Review & Results), this document:

1. Confirms **which tables** are read for the review flow  
2. Notes **which routes already exist** that touch the same data  
3. Confirms that **existing schema is sufficient** for read-only review (summary, trends, reflection)  
4. States explicitly: **No schema changes required**

---

## 1. Tables Read for Review (Read-Only)

Phase A is **read-only** on the database. The following tables are used as-is.

| Table | Role in review | Key columns used |
|-------|----------------|------------------|
| **Experiment** | Metadata and ownership | id, clerkUserId, title, hypothesis, whyMatters, status, startedAt, completedAt |
| **ExperimentField** | Field definitions (type, label, order) | id, experimentId, label, type, order, minValue, maxValue, emojiCount, selectOptions, textType |
| **ExperimentCheckIn** | One row per UTC day per experiment | id, experimentId, checkInDate, notes; ordered by checkInDate for time series |
| **ExperimentFieldResponse** | One value per field per check-in | checkInId, fieldId, responseText, responseNumber, responseBool, selectedOption |

**Relations:** Experiment → fields (1:n), Experiment → checkIns (1:n), ExperimentCheckIn → responses (1:n), ExperimentFieldResponse → field (n:1). Each response links one check-in and one field.

**No schema changes are required.** The current schema fully supports computing per-field summaries, per-field trends over time, and feeding that data into an ephemeral AI reflection.

---

## 2. How This Data Supports Review

### Experiment

- **Ownership:** `clerkUserId` identifies the owner; review APIs enforce access via `requireExperimentOwner(experimentId, userId)`.
- **Metadata:** `title`, `hypothesis`, `whyMatters` can be shown in the review UI; `title` is used in the AI reflection prompt.
- **Lifecycle:** `status`, `startedAt`, `completedAt` are already enforced by Phase 1; review does not change them.

### ExperimentField

- **Order:** `order` (asc) gives a stable field order for summary and trends.
- **Type:** `type` (text | number | select | emoji | yesno) determines how we aggregate and trend.
- **Constraints:** `minValue`, `maxValue`, `emojiCount`, `selectOptions` inform interpretation only; no schema change needed.

### ExperimentCheckIn

- **One per UTC day** (Phase 1.1); `checkInDate` is start-of-day UTC.
- **Ordering:** `orderBy: { checkInDate: "asc" }` gives a deterministic time order for trends (first 25% vs last 25%, etc.).
- Check-ins exist only when experiment is active + started (Phase 1); review simply reads what exists.

### ExperimentFieldResponse

- **One row per field per check-in**; value columns depend on `field.type`:
  - text → responseText  
  - number → responseNumber  
  - yesno → responseBool  
  - emoji → responseNumber (1..emojiCount)  
  - select → selectedOption  
- All values are stored; no precomputed aggregates. Review APIs will compute summaries and trends at read time.

---

## 3. Existing Routes (Relevant to Review)

| Route | Purpose | Relevant to review |
|-------|---------|--------------------|
| **GET /api/experiments/[id]** | Load experiment with fields, checkIns, responses | Same include graph can be used for review summary/trends (fields order asc, checkIns order by checkInDate asc). |
| **GET /api/experiments/[id]/checkins** | List check-ins (with responses) | Alternative read path; a single “experiment + fields + checkIns + responses” query in a dedicated review route is sufficient. |
| **GET /api/experiments/[id]/fields** | List fields only | No check-in data; not sufficient alone for summary/trends. |
| **GET /api/experiments/[id]/insights/summary** | Computed per-field summary (Phase 2A.1) | Same semantics as planned A.1 review/summary; different path. |
| **GET /api/experiments/[id]/insights/trends** | Per-field trends (Phase 2A.2) | Same semantics as planned A.2 review/trends; different path. |
| **POST /api/experiments/[id]/insights/reflection** | Ephemeral AI reflection (Phase 2A.3) | Same semantics as planned A.3 review/reflection; different path. |

Phase A will implement the **review** namespace (`/api/experiments/[id]/review/summary`, `review/trends`, `review/reflection`) with the same ownership and data rules; existing **insights** routes are noted for consistency but are out of scope for this audit.

---

## 4. Sufficiency for Phase A Steps

### A.1 — Review Summary (GET …/review/summary)

- **Need:** Experiment + fields (order asc) + checkIns (checkInDate asc) + responses with field.
- **Available:** Yes. Single `prisma.experiment.findFirst({ where: { id, clerkUserId }, include: { fields, checkIns, responses } })` with correct ordering.
- **Per-field summaries:** From responses grouped by fieldId and field.type: text → responseCount; number → count, min, max, avg; yesno → count, yesCount, noCount, yesPercentage; emoji → count, avgScore, distribution; select → count, optionCounts. All derivable from existing columns.

### A.2 — Review Trends (GET …/review/trends)

- **Need:** Same load as A.1; checkInDate ordering for time series.
- **Available:** Yes. Same include; order checkIns by checkInDate asc.
- **Trends:** number → direction (increasing/decreasing/flat); emoji → up/down/flat; yesno → yes-rate trend; text → countOverTime; select → selected option per day. All computable from existing response and check-in data.

### A.3 — Review Reflection (POST …/review/reflection)

- **Need:** Summary + trends (fetched internally or from A.1/A.2) + experiment title; send to AI; return ephemeral text. No persistence.
- **Available:** Yes. No new tables or columns; optional dependency on OPENAI_API_KEY (return 503 if missing).

---

## 5. Explicit Confirmation

- **No schema changes required.**  
  Experiment, ExperimentField, ExperimentCheckIn, and ExperimentFieldResponse are sufficient for the full review flow (summary, trends, reflection).

- **Read-only.**  
  Phase A does not write to the database; reflection output is ephemeral and not stored.

- **Personal experiments only.**  
  Ownership is enforced via `requireExperimentOwner(experimentId, userId)`; no organisation, team, or frequency scheduling logic.

- **Lifecycle unchanged.**  
  Phase 1.0–1.4 rules (check-in date integrity, field validation, structure lock, status transitions) remain as-is; review only reads existing data.

---

## 6. Next Steps

- **Step A.1:** Implement GET `/api/experiments/[id]/review/summary`, Zod schema, and `docs/phase-A1-review-summary.md`.  
- **Step A.2:** Implement GET `/api/experiments/[id]/review/trends`, Zod schema, and `docs/phase-A2-review-trends.md`.  
- **Step A.3:** Implement POST `/api/experiments/[id]/review/reflection`, Zod response schema, and `docs/phase-A3-review-reflection.md`.

**STOP after writing this doc.** Proceed to Step A.1 only when instructed.
