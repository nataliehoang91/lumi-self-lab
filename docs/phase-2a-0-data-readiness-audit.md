# Phase 2A.0 — Data Readiness Audit (READ-ONLY)

**Date:** 2026-02-07  
**Mode:** Investigation and documentation only. No code changes. No schema changes.

---

## Purpose

Before implementing Phase 2A (Insights Summary, Trends, AI Reflection), this document audits:

1. What data exists and how it is structured  
2. Existing read paths and ownership rules  
3. Whether the current schema and APIs are **sufficient** for read-only insights  
4. Constraints and assumptions that Phase 2A must respect  

---

## 1. Tables Touched (Read-Only for Phase 2A)

All Phase 2A work is **read-only**. The following tables are used as-is.

| Table | Role in Phase 2A | Key columns |
|-------|-------------------|--------------|
| **Experiment** | Experiment metadata and ownership | id, clerkUserId, title, hypothesis, whyMatters, durationDays, frequency, status, startedAt, completedAt |
| **ExperimentField** | Field definitions (type, label, constraints) | id, experimentId, label, type, required, order, minValue, maxValue, emojiCount, selectOptions, textType |
| **ExperimentCheckIn** | One row per day per experiment | id, experimentId, clerkUserId, checkInDate, notes, aiSummary, createdAt |
| **ExperimentFieldResponse** | One row per field per check-in | id, checkInId, fieldId, responseText, responseNumber, responseBool, selectedOption, aiFeedback |

**Relations:** Experiment → fields (1:n), Experiment → checkIns (1:n), ExperimentCheckIn → responses (1:n), ExperimentFieldResponse → field (n:1). Each response is tied to one field and one check-in.

**No Prisma schema changes are required for Phase 2A.**

---

## 2. Field Types and Response Value Columns

Phase 1.2 enforces that responses match field definitions. For aggregation we have:

| field.type | Value column(s) | Aggregation use |
|------------|------------------|------------------|
| text | responseText | Count, sample, word/sentiment (if needed later); no numeric series |
| number | responseNumber | Min, max, avg, count; trend over time |
| yesno | responseBool | Yes % / No %; trend (e.g. yes rate over time) |
| emoji | responseNumber (1..emojiCount) | Average “mood” score; trend over time |
| select | selectedOption | Distribution (count per option); optional trend by option over time |

All response values are stored; no derived or cached aggregates exist. Phase 2A will compute summaries and trends at read time.

---

## 3. Check-In Date Semantics (Phase 1.1)

- **checkInDate** is stored as **start-of-day UTC** (00:00:00.000).  
- One check-in per experiment per UTC calendar day is enforced.  
- **Ordering:** `orderBy: { checkInDate: "asc" }` or `"desc" }` gives a deterministic time order for trends.  
- No timezone or “user local day” column; Phase 2A uses UTC ordering only.

---

## 4. Existing Read Paths (No Changes Required)

### GET /api/experiments/[id]

- **Auth:** requireExperimentOwner (clerkUserId).  
- **Load:** Experiment with `include: { fields: orderBy order asc, checkIns: orderBy checkInDate desc, include: { responses: include: { field: true } } }`.  
- **Result:** One experiment with all fields, all check-ins, and every response with its field definition.  
- This shape is **sufficient** to compute per-field summaries and per-field trends in memory (no extra queries required for 2A.1/2A.2 if we load the same graph in a dedicated insights route).

### GET /api/experiments/[id]/checkins

- **Auth:** requireExperimentOwner.  
- **Load:** Check-ins for experiment (optional date filter), each with responses and field.  
- **Result:** List of check-ins with full response + field detail.  
- Can be used to build time-ordered series; for consistency with GET experiment, a single “experiment + fields + checkIns + responses” query in an insights route is enough.

### GET /api/experiments/[id]/fields

- **Auth:** requireExperimentOwner.  
- **Load:** Fields only (no check-ins/responses).  
- Useful if an insights route ever needed only field definitions; for summary/trends we need responses, so the full experiment include above is the main path.

---

## 5. Sufficiency for Phase 2A Stages

### 2A.1 — Insights Summary (read-only)

- **Need:** Experiment + fields + all check-ins + all responses.  
- **Available:** Yes. Same include as GET experiment (fields, checkIns, responses with field).  
- **Per-field summaries:** From responses grouped by fieldId, with field.type and field constraints (min/max, emojiCount, selectOptions) we can compute:  
  - number: count, min, max, avg  
  - emoji: count, avg (1..n), distribution  
  - yesno: count, yes %, no %  
  - select: count per option  
  - text: count, optional sample (no schema change).  
- **Conclusion:** Schema and existing read path are sufficient. No new columns or tables.

### 2A.2 — Insights Trends (read-only)

- **Need:** Time-ordered check-ins with responses per field.  
- **Available:** Yes. checkInDate is UTC-normalized; ordering by checkInDate gives chronological order.  
- **Per-field trends:** From ordered check-ins and responses: number → simple trend (e.g. increasing/decreasing/flat); emoji → mood trend; yesno → yes % over time.  
- **Conclusion:** Schema is sufficient. No new columns or tables.

### 2A.3 — AI Reflection (derived, stateless)

- **Need:** Input = summaries + trends (outputs of 2A.1 and 2A.2). No storage of AI output.  
- **Available:** Summaries and trends are computed from the same read-only data; no schema required for reflection.  
- **Conclusion:** No schema changes. AI consumes already-computed structures.

---

## 6. Constraints Phase 2A Must Respect

- **Ownership:** All insights are personal. Use the same rule as existing experiment routes: requireExperimentOwner(experimentId, userId). No org/team/assignment.  
- **Read-only:** No writes to Experiment, ExperimentField, ExperimentCheckIn, ExperimentFieldResponse. No new analytics or summary tables.  
- **No schema evolution:** Do not add columns, indexes, or migrations for Phase 2A.  
- **Field structure lock (Phase 1.4):** Once check-ins exist, field definitions are immutable. Insights only read data; they do not modify fields, so the lock does not block 2A.  
- **Lifecycle:** Insights can be exposed for any status (draft/active/completed); typically useful for active or completed experiments that have check-ins. No need to restrict by status unless product rules say otherwise.

---

## 7. What Is Not in Scope (Audit Only)

- No organisation or team access.  
- No frequency enforcement or per-field scheduling.  
- No background jobs or cached aggregates.  
- No denormalization or new tables.  
- No UI; this audit covers backend data readiness only.

---

## 8. Checkpoint Summary

| Question | Answer |
|----------|--------|
| Are Experiment, ExperimentField, ExperimentCheckIn, ExperimentFieldResponse sufficient for 2A.1 summary? | Yes. |
| Are they sufficient for 2A.2 trends (time-ordered)? | Yes (checkInDate UTC, ordered). |
| Are they sufficient for 2A.3 reflection input? | Yes (summaries + trends only). |
| Are any Prisma schema changes required for Phase 2A? | No. |
| Do existing read paths (GET experiment with full include) need to change for Phase 2A? | No; a new read-only route can use the same ownership and a similar include. |

**Stage 2A.0 — Data Readiness Audit: complete. Ready to implement Phase 2A.1 when instructed.**
