# Phase 2A.3 — AI Reflection (ephemeral, no storage)

**Date:** 2026-01-29

---

## Overview

This phase adds a **POST** endpoint that takes an experiment’s **insights summary** and **trends** (fetched server-side from the existing 2A.1 and 2A.2 APIs), sends them to an AI model, and returns a short **ephemeral reflection** for the user. Nothing is stored; no Prisma schema changes; no new tables or columns.

---

## Tables / data used

| Source          | Usage                                                                              |
| --------------- | ---------------------------------------------------------------------------------- |
| **Experiment**  | requireExperimentOwner(experimentId, userId) for ownership and experiment title.   |
| **Summary API** | GET `/api/experiments/[id]/insights/summary` called internally (cookie forwarded). |
| **Trends API**  | GET `/api/experiments/[id]/insights/trends` called internally (cookie forwarded).  |

**No writes.** No new tables. No schema changes. Reflection text is **not** persisted anywhere.

**Ownership:** Enforced via requireExperimentOwner(experimentId, userId); summary/trends are then fetched with the same request cookies so those APIs also enforce ownership. 401 if not authenticated; 404 if experiment not found or not owned.

---

## API

**POST /api/experiments/[id]/insights/reflection**

- **Auth:** 401 if not authenticated. 404 if experiment not found or not owned.
- **Input:** No required body. Optional body is ignored; summary and trends are fetched server-side.
- **Behavior:**
  1. requireExperimentOwner(experimentId, userId); return 404 if not found.
  2. If `OPENAI_API_KEY` is missing, return **503** with message that AI reflection is not configured.
  3. Fetch summary and trends from the same app (origin from `request.url`; cookie forwarded). On non-2xx from either, return 401/404 or 502 as appropriate.
  4. Send summary + trends + experiment name to OpenAI (gpt-4o-mini) with a fixed system prompt asking for a short, empathetic reflection.
  5. Return the model’s reply as ephemeral text.
- **Response:** JSON validated with Zod: `{ reflection: string }`.
- **Errors:** 502 if summary/trends fetch or OpenAI call fails; 503 if `OPENAI_API_KEY` is not set.

---

## Response shape (Zod-validated)

```ts
{
  reflection: string; // 2–4 short paragraphs, not stored
}
```

---

## Assumptions

- **OpenAI:** Uses `OPENAI_API_KEY` and `gpt-4o-mini` (same style as existing chat route). No streaming; single completion.
- **Self-call:** Reflection route calls summary and trends using the request’s origin and cookies so that auth and ownership are preserved.
- **Prompt:** System prompt instructs the model to be non-judgmental, to use only the provided data, and to keep the reflection concise.

---

## Limitations

- **Ephemeral only:** Reflection is not saved; repeated calls may produce different text.
- **No rate limiting:** Implemented at app/infra level if needed.
- **Model dependency:** Quality and tone depend on the model and prompt; no fine-tuning.
- **Personal experiments only:** No org/team or frequency logic (Phase 2A rules).

---

## Implementation notes

- **Route:** `src/app/api/experiments/[id]/insights/reflection/route.ts`
- **Zod:** Response is parsed with `reflectionResponseSchema` before return.
- **Duration:** `maxDuration = 30` for the handler (OpenAI may be slow).
- **Env:** `OPENAI_API_KEY` must be set for the endpoint to return a reflection; otherwise 503.

---

## Explicit non-goals (Phase 2A.3)

- No persistence of reflections.
- No organisation, team, or frequency logic.
- No schema changes, no new tables, no writes for reflection content.
