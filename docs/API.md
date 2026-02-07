# API Reference

This document lists all API routes in the Lumi Self-Lab app. **Keep it updated** when you add, change, or remove routes. Prefer updating the section for the feature or route you touch.

- **Auth** = whether the route requires an authenticated user (Clerk).
- **Permission** = extra rule (e.g. ownership, role). See `src/lib/permissions.ts` and `docs/architecture-snapshot-2025-02-07.md`.

---

## Overview

| Area           | Base path              | Auth    | Notes                    |
|----------------|------------------------|---------|---------------------------|
| User           | `/api/users/*`         | identity: yes | Personal data only       |
| Experiments    | `/api/experiments/*`   | yes     | Owner-only (clerkUserId) |
| Chat           | `/api/chat`            | yes     | Personal AI chat         |
| Waitlist       | `/api/waitlist`        | no      | Public signup            |
| Webhooks       | `/api/webhooks/clerk`  | no (sig)| Clerk events             |
| Auth (legacy)  | `/api/auth/sign-in`    | no      | Placeholder              |

---

## 1. User

### `GET /api/users/identity`

**Purpose:** Return the current user and their org memberships (for nav and role-based UI).

**Auth:** Required. Returns 401 if not authenticated.

**Permission:** Personal only. No admin override to fetch another user.

**Response (200):**
```json
{
  "id": "<db user id>",
  "clerkUserId": "<clerk id>",
  "email": "<string | null>",
  "accountType": "individual" | "organisation",
  "role": "user" | "super_admin",
  "upgradedAt": "<iso date | null>",
  "organisations": [{ "id", "name", "description", "role", "teamId?", "teamName?", "joinedAt" }],
  "isParticipant": true | false
}
```

**Implementation:** `src/app/api/users/identity/route.ts`

---

### `POST /api/users/upgrade`

**Purpose:** Self-upgrade to organisation account type (sets `accountType: "organisation"`, `upgradedAt`).

**Auth:** Required.

**Permission:** Personal only. Caller may only upgrade their own account. Future “admin upgrades another user” must be a separate endpoint guarded by `requireSuperAdmin()`.

**Request body:** None.

**Response (200):**
```json
{
  "success": true,
  "user": { "id", "accountType", "upgradedAt" }
}
```

**Errors:** 400 if already organisation account.

**Implementation:** `src/app/api/users/upgrade/route.ts`

---

## 2. Experiments

All experiment routes enforce **ownership**: only the experiment owner (`clerkUserId`) may access. No org or manager role grants access. See `requireExperimentOwner()` in `src/lib/permissions.ts`.

### `GET /api/experiments`

**Purpose:** List experiments owned by the current user.

**Auth:** Required.

**Query params:**
- `status` (optional): `draft` \| `active` \| `completed`
- `search` (optional): search in title, whyMatters, hypothesis

**Response (200):** Array of experiments (with `fields`, latest check-in).

**Implementation:** `src/app/api/experiments/route.ts`

---

### `POST /api/experiments`

**Purpose:** Create a new experiment owned by the current user. `organisationId` is not set (future link API).

**Auth:** Required.

**Request body:**
- `title` (string, required)
- `whyMatters`, `hypothesis` (string, optional)
- `durationDays` (number, required)
- `frequency` (string, required): e.g. `daily` \| `every-2-days` \| `weekly`
- `faithEnabled` (boolean, optional)
- `scriptureNotes` (string, optional)
- `status` (string, optional, default `draft`)
- `fields` (array, optional): `[{ label, type, required?, order, textType?, minValue?, maxValue?, emojiCount?, selectOptions? }]`

**Response (201):** Created experiment (with `fields`).

**Implementation:** `src/app/api/experiments/route.ts`

---

### `GET /api/experiments/[id]`

**Purpose:** Get one experiment by ID with fields and check-ins. Owner only.

**Auth:** Required.

**Permission:** `requireExperimentOwner(id, userId)`.

**Response (200):** Experiment with `fields` and `checkIns` (with `responses`, `field`).

**Errors:** 404 if not found or not owner.

**Implementation:** `src/app/api/experiments/[id]/route.ts`

---

### `PATCH /api/experiments/[id]`

**Purpose:** Update experiment. Ownership (`clerkUserId`) is immutable. `organisationId` is not accepted here (future link/unlink API).

**Auth:** Required.

**Permission:** Owner only.

**Request body (all optional):** `title`, `whyMatters`, `hypothesis`, `durationDays`, `frequency`, `faithEnabled`, `scriptureNotes`, `status`, `startedAt`, `completedAt`, `fields` (upsert logic).

**Response (200):** Updated experiment with `fields`.

**Implementation:** `src/app/api/experiments/[id]/route.ts`

---

### `DELETE /api/experiments/[id]`

**Purpose:** Delete experiment (cascade: fields, check-ins).

**Auth:** Required.

**Permission:** Owner only.

**Response (200):** `{ "success": true }`.

**Implementation:** `src/app/api/experiments/[id]/route.ts`

---

### `GET /api/experiments/[id]/checkins`

**Purpose:** List check-ins for an experiment. Owner only.

**Auth:** Required.

**Query params:** `date` (optional, YYYY-MM-DD) to filter by day.

**Response (200):** Array of check-ins with `responses` and `field`.

**Implementation:** `src/app/api/experiments/[id]/checkins/route.ts`

---

### `POST /api/experiments/[id]/checkins`

**Purpose:** Create a check-in for a given date. Owner only.

**Auth:** Required.

**Request body:**
- `checkInDate` (string, ISO, required)
- `notes`, `aiSummary` (optional)
- `responses` (array): `[{ fieldId, responseText?, responseNumber?, responseBool?, selectedOption?, aiFeedback? }]`

**Response (201):** Created check-in with `responses` and `field`.

**Errors:** 409 if check-in already exists for that date.

**Implementation:** `src/app/api/experiments/[id]/checkins/route.ts`

---

### `GET /api/experiments/[id]/checkins/[checkInId]`

**Purpose:** Get one check-in. Owner only.

**Auth:** Required.

**Response (200):** Check-in with `responses` and `field`.

**Implementation:** `src/app/api/experiments/[id]/checkins/[checkInId]/route.ts`

---

### `PATCH /api/experiments/[id]/checkins/[checkInId]`

**Purpose:** Update a check-in (date, notes, aiSummary, responses). Owner only.

**Auth:** Required.

**Implementation:** `src/app/api/experiments/[id]/checkins/[checkInId]/route.ts`

---

### `DELETE /api/experiments/[id]/checkins/[checkInId]`

**Purpose:** Delete a check-in (cascade: responses). Owner only.

**Auth:** Required.

**Implementation:** `src/app/api/experiments/[id]/checkins/[checkInId]/route.ts`

---

### `GET /api/experiments/[id]/fields`

**Purpose:** List fields for an experiment. Owner only.

**Auth:** Required.

**Response (200):** Array of `ExperimentField`.

**Implementation:** `src/app/api/experiments/[id]/fields/route.ts`

---

### `POST /api/experiments/[id]/fields`

**Purpose:** Create a field. Owner only.

**Auth:** Required.

**Request body:** `label`, `type`, `required?`, `order`, `textType?`, `minValue?`, `maxValue?`, `emojiCount?`, `selectOptions?`.

**Response (201):** Created field.

**Implementation:** `src/app/api/experiments/[id]/fields/route.ts`

---

### `GET /api/experiments/[id]/fields/[fieldId]`

**Purpose:** Get one field. Owner only.

**Auth:** Required.

**Implementation:** `src/app/api/experiments/[id]/fields/[fieldId]/route.ts`

---

### `PATCH /api/experiments/[id]/fields/[fieldId]`

**Purpose:** Update field definition. Owner only.

**Auth:** Required.

**Implementation:** `src/app/api/experiments/[id]/fields/[fieldId]/route.ts`

---

### `DELETE /api/experiments/[id]/fields/[fieldId]`

**Purpose:** Delete field (cascade: responses). Owner only.

**Auth:** Required.

**Implementation:** `src/app/api/experiments/[id]/fields/[fieldId]/route.ts`

---

## 3. Chat

### `POST /api/chat`

**Purpose:** AI chat (streaming). Personal action; no role or org checks.

**Auth:** Required. Returns 401 if not authenticated.

**Request body:** `{ "messages": [...] }` (OpenAI-style messages).

**Response:** Streaming response (content type and format as in implementation).

**Implementation:** `src/app/api/chat/route.ts`

---

## 4. Waitlist

### `POST /api/waitlist`

**Purpose:** Add email to Clerk waitlist. Public (unauthenticated).

**Auth:** None. Route is public in middleware.

**Request body:** `{ "email": "<string>" }`.

**Response (200):** `{ "ok": true }`.

**Errors:** 400 if email missing; 500 on Clerk error.

**Implementation:** `src/app/api/waitlist/route.ts`

---

## 5. Webhooks

### `POST /api/webhooks/clerk`

**Purpose:** Handle Clerk webhook events (user lifecycle). Verified via Svix signature.

**Auth:** None (public path). Verification via `CLERK_WEBHOOK_SECRET` and Svix headers.

**Events handled:**
- `user.created` – create `User` with `clerkUserId`, `email`, `accountType: "individual"`.
- `user.updated` – sync email.
- `user.deleted` – delete user (cascade).

**Response:** 200 with `{ success, message }` or 400/500 on error.

**Implementation:** `src/app/api/webhooks/clerk/route.ts`

---

## 6. Auth (legacy / placeholder)

### `POST /api/auth/sign-in`

**Purpose:** Placeholder. Sign-in is handled by Clerk (client-side / Clerk components).

**Request body:** `{ "email", "password" }`.

**Response (200):** `{ "success": true }`.

**Implementation:** `src/app/api/auth/sign-in/route.ts`

---

## How to keep this doc updated

1. **Add a new route** – Add a row to the overview table and a subsection under the right area (User, Experiments, Chat, etc.). Include: method/path, purpose, auth, permission, request/response, implementation path.
2. **Change a route** – Update the corresponding subsection (params, body, behaviour, errors).
3. **Remove a route** – Delete its subsection and remove from the overview table.
4. **New feature area** – Add a new numbered section (e.g. “7. Organisations”) and list routes there; update the overview table.

Permission helpers and boundaries are documented in `src/lib/permissions.ts` and `docs/architecture-snapshot-2025-02-07.md`.
