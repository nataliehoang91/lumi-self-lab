# API Reference

This document lists all API routes in the Lumi Self-Lab app. **Keep it updated** when you add, change, or remove routes. Prefer updating the section for the feature or route you touch.

- **Auth** = whether the route requires an authenticated user (Clerk).
- **Permission** = extra rule (e.g. ownership, role). See `src/lib/permissions.ts` and `docs/architecture-snapshot-2025-02-07.md`.

---

## Overview

| Area          | Base path             | Auth                      | Notes                                           |
| ------------- | --------------------- | ------------------------- | ----------------------------------------------- |
| User          | `/api/users/*`        | identity: yes             | Personal data only                              |
| Orgs          | `/api/orgs/*`         | yes                       | List/detail, create, members, invites (Phase 5) |
| Org invites   | `/api/org-invites/*`  | GET: no, POST accept: yes | Token-based invite accept                       |
| Experiments   | `/api/experiments/*`  | yes                       | Owner-only (clerkUserId)                        |
| Chat          | `/api/chat`           | yes                       | Personal AI chat                                |
| Waitlist      | `/api/waitlist`       | no                        | Public signup                                   |
| Webhooks      | `/api/webhooks/clerk` | no (sig)                  | Clerk events                                    |
| Auth (legacy) | `/api/auth/sign-in`   | no                        | Placeholder                                     |

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

## 2. Orgs

Phase 3: list and detail (read-only). Phase 4.1: create organisation (POST). See `docs/phase-3-org-core-readonly-2025-02-07.md` and `docs/phase-4-1-create-organisation-2025-02-07.md`.

### `GET /api/orgs`

**Purpose:** List organisations the current user belongs to.

**Auth:** Required. Returns 401 if not authenticated.

**Permission:** Returns only orgs where the user has an `OrganisationMember` row.

**Response (200):**

```json
{
  "organisations": [
    {
      "id": "<org id>",
      "name": "<string>",
      "description": "<string | null>",
      "role": "member" | "team_manager" | "org_admin",
      "joinedAt": "<ISO date>",
      "memberCount": <number>,
      "templatesCount": <number>,
      "experimentsCount": <number>
    }
  ]
}
```

**Implementation:** `src/app/api/orgs/route.ts`

---

### `POST /api/orgs` (Phase 4.1)

**Purpose:** Create an organisation and make the current user its org_admin.

**Auth:** Required. Returns 401 if not authenticated.

**Permission:** User.accountType MUST be `"organisation"`. If not, 403 with message: "Upgrade required to create an organisation".

**Request body:**

```json
{
  "name": "<string, required>",
  "description": "<string, optional>"
}
```

**Response (201):**

```json
{
  "id": "<org id>",
  "name": "<string>",
  "description": "<string | null>",
  "role": "org_admin"
}
```

**Errors:** 400 (validation), 403 (not upgraded), 500 (unexpected).

**Implementation:** `src/app/api/orgs/route.ts`

---

### `GET /api/orgs/[orgId]`

**Purpose:** Org basic info for a member (read-only). Used by `/org/[orgId]` dashboard.

**Auth:** Required.

**Permission:** `canAccessOrg(clerkUserId, orgId)`. Returns 404 if org does not exist or user is not a member.

**Response (200):**

```json
{
  "id": "<org id>",
  "name": "<string>",
  "description": "<string | null>",
  "role": "member" | "team_manager" | "org_admin",
  "memberCount": <number>,
  "totalTemplates": <number>,
  "activeExperiments": <number>,
  "avgCompletionRate": null
}
```

**Implementation:** `src/app/api/orgs/[orgId]/route.ts`

---

### `GET /api/orgs/[orgId]/members` (Phase 4.2)

**Purpose:** List organisation members (for org admin and any member with access).

**Auth:** Required.

**Permission:** `canAccessOrg(clerkUserId, orgId)`. 404 if org not found or no access.

**Response (200):**

```json
{
  "members": [
    {
      "id": "<organisationMemberId>",
      "clerkUserId": "<clerkUserId>",
      "email": "<string | null>",
      "role": "member" | "team_manager" | "org_admin",
      "joinedAt": "<ISO date>"
    }
  ]
}
```

Email comes from User (join). No team data.

**Implementation:** `src/app/api/orgs/[orgId]/members/route.ts`

---

### `POST /api/orgs/[orgId]/members` (Phase 4.2)

**Purpose:** Add an existing user to the organisation by email.

**Auth:** Required.

**Permission:** `canActAsOrgAdmin(clerkUserId, orgId)`. 403 if not org_admin/super_admin.

**Request body:**

```json
{
  "email": "<string, required>",
  "role": "member" | "team_manager" | "org_admin (optional, default: member)"
}
```

**Behaviour:** Look up User by email. If not found → 400 "User not found. Invitation flow not implemented yet." If already member → 409. Else create OrganisationMember.

**Response (201):** `{ "id", "email", "role" }`

**Implementation:** `src/app/api/orgs/[orgId]/members/route.ts`

---

### `PATCH /api/orgs/[orgId]/members/[memberId]` (Phase 4.2)

**Purpose:** Update a member’s role.

**Auth:** Required.

**Permission:** `canActAsOrgAdmin(clerkUserId, orgId)`.

**Request body:** `{ "role": "member" | "team_manager" | "org_admin" }`

**Rules:** Cannot demote the last org_admin; super_admin bypasses.

**Response (200):** `{ "id", "role" }`

**Implementation:** `src/app/api/orgs/[orgId]/members/[memberId]/route.ts`

---

### `DELETE /api/orgs/[orgId]/members/[memberId]` (Phase 4.2)

**Purpose:** Remove a member from the organisation.

**Auth:** Required.

**Permission:** `canActAsOrgAdmin(clerkUserId, orgId)`.

**Rules:** Cannot remove the last org_admin; super_admin bypasses.

**Response (200):** `{ "success": true }`

**Implementation:** `src/app/api/orgs/[orgId]/members/[memberId]/route.ts`

---

### `POST /api/orgs/[orgId]/invites` (Phase 5)

**Purpose:** Create an organisation invite by email (token-based, 7-day expiry).

**Auth:** Required.

**Permission:** `canActAsOrgAdmin(clerkUserId, orgId)`.

**Request body:** `{ "email": "<string, required>", "role": "member" | "team_manager" | "org_admin (optional, default: member)" }`

**Validation:** Email not already a member; no active (unexpired) invite for same email.

**Response (201):** `{ "id", "email", "role", "expiresAt", "token" }`

**Errors:** 409 already member or active invite.

**Implementation:** `src/app/api/orgs/[orgId]/invites/route.ts`

---

### `GET /api/orgs/[orgId]/invites` (Phase 5)

**Purpose:** List pending invites (not accepted, not expired).

**Auth:** Required.

**Permission:** `canActAsOrgAdmin(clerkUserId, orgId)`.

**Response (200):** `{ "invites": [{ "id", "email", "role", "expiresAt", "createdAt" }] }`

**Implementation:** `src/app/api/orgs/[orgId]/invites/route.ts`

---

### `GET /api/org-invites/[token]` (Phase 5)

**Purpose:** Get invite details for display (org name, role). No auth required.

**Response (200):** `{ "organisationId", "organisationName", "email", "role", "expiresAt" }`

**Errors:** 404 invalid, expired, or already accepted.

**Implementation:** `src/app/api/org-invites/[token]/route.ts`

---

### `POST /api/org-invites/[token]/accept` (Phase 5)

**Purpose:** Accept invite: create OrganisationMember, set invite acceptedAt. Invite email must match signed-in user email.

**Auth:** Required.

**Validation:** Token valid and not expired; invite.email matches current user email; user not already a member.

**Response (200):** `{ "success": true, "organisationId", "organisationName", "role" }`

**Errors:** 404 invalid/expired; 403 email mismatch; 409 already member.

**Implementation:** `src/app/api/org-invites/[token]/accept/route.ts`

---

## 3. Experiments

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
