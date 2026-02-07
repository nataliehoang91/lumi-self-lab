# Phase 3: Org Core Data (Read-Only) — 2025-02-07

This document describes the read-only organisation APIs and the switch from mock to real DB-backed data for the org switcher and org dashboard. It should be read with `docs/phase-2-permissions-2025-02-07.md` and `docs/phase-org-admin-routing-2025-02-07.md`.

---

## 1. Org data flow (DB → API → page)

```
┌─────────────────────┐     ┌─────────────────────────────┐     ┌──────────────────┐
│  Organisation       │     │  GET /api/orgs              │     │  /org             │
│  OrganisationMember │ ──► │  GET /api/orgs/[orgId]      │ ──► │  /org/[orgId]     │
│  (Prisma)           │     │  (permission helpers used)  │     │  (consumes API)   │
└─────────────────────┘     └─────────────────────────────┘     └──────────────────┘
```

- **DB:** `Organisation` (id, name, description, …) and `OrganisationMember` (organisationId, clerkUserId, role, joinedAt). No schema changes in Phase 3.
- **API:** Authenticated user only. List endpoint returns orgs where the user has a membership; detail endpoint returns one org if `canAccessOrg(userId, orgId)`.
- **Pages:** `/org` fetches `GET /api/orgs` (client-side) and renders the list. `/org/[orgId]` fetches `GET /api/orgs/[orgId]` (server-side, same-origin with cookie forwarding) and renders the dashboard; non-members are already blocked by the layout guard and receive 404 from the API if they hit it directly.

---

## 2. API contracts

### GET /api/orgs

**Purpose:** Return organisations the current user belongs to (read-only).

**Auth:** Required. Returns 401 if not authenticated.

**Permission:** Returns only orgs where the user has an `OrganisationMember` row (or super_admin is handled by existing helpers if we ever add “list all orgs” for admin). Current implementation: list is membership-based only.

**Response (200):**
```json
{
  "organisations": [
    {
      "id": "<org id>",
      "name": "<string>",
      "description": "<string | null>",
      "role": "member" | "team_manager" | "org_admin",
      "joinedAt": "<ISO date string>",
      "memberCount": <number>,
      "templatesCount": <number>,
      "experimentsCount": <number>
    }
  ]
}
```

**Implementation:** `src/app/api/orgs/route.ts`. Uses `getAuthenticatedUserId()`, then Prisma `organisationMember.findMany({ where: { clerkUserId } })` with `organisation` and `_count` for members, templates, experiments.

---

### GET /api/orgs/[orgId]

**Purpose:** Return org basic info for a member (read-only). Used by `/org/[orgId]` dashboard.

**Auth:** Required. Returns 401 if not authenticated.

**Permission:** `canAccessOrg(clerkUserId, orgId)`. Returns 404 if the org does not exist or the user is not a member (or not super_admin with access).

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

**Note:** `avgCompletionRate` is intentionally `null` in Phase 3 (no aggregation). Front end may show "—" or similar.

**Implementation:** `src/app/api/orgs/[orgId]/route.ts`. Uses `getAuthenticatedUserId()`, `canAccessOrg()`, `getOrgMembership()`, and `prisma.organisation.findUnique` with `_count`.

---

## 3. Which org pages use real data vs mock

| Page | Data source | Status |
|------|-------------|--------|
| **/org** (org switcher) | `GET /api/orgs` | **Real.** Replaces mock list of orgs. Pending assignments section remains mock (not org core data). |
| **/org/[orgId]** (org dashboard) | `GET /api/orgs/[orgId]` | **Real.** Replaces mock `getOrgData(orgId)`. Header and stats (name, description, memberCount, totalTemplates, activeExperiments, avgCompletionRate) use API response. |
| **/org/[orgId]/teams** | — | Placeholder (unchanged). |
| **/org/[orgId]/experiments** | — | Placeholder (unchanged). |
| **/org/[orgId]/templates** | — | Placeholder / mock (unchanged). |
| **/org/[orgId]/insights** | — | Placeholder / mock (unchanged). |
| **/org/[orgId]/admin*** | — | Placeholder (unchanged). |

---

## 4. Explicit statement: Org is read-only in Phase 3

- **Org is read-only in Phase 3.** There are no POST, PATCH, or DELETE endpoints for organisations. No new database tables were added; the `Organisation` and `OrganisationMember` schema are unchanged. No UI for creating or editing organisations was added.
- Direct access to `/org/[orgId]` for non-members is blocked by the existing layout guard (`canAccessOrg` in `(org)/org/[orgId]/layout.tsx`). The API also enforces `canAccessOrg` and returns 404 for non-members.
- Invites, teams, assignments, and analytics are out of scope and unchanged.

---

## 5. Files added or changed (Phase 3)

| File | Change |
|------|--------|
| `src/app/api/orgs/route.ts` | **New.** GET /api/orgs — list orgs for current user. |
| `src/app/api/orgs/[orgId]/route.ts` | **New.** GET /api/orgs/[orgId] — org detail for member. |
| `src/app/(org)/org/page.tsx` | Replaced mock org list with fetch to GET /api/orgs; loading and error states. |
| `src/app/(org)/org/[orgId]/page.tsx` | Replaced mock `getOrgData()` with server-side fetch to GET /api/orgs/[orgId]; 404 when not found. |

---

*Phase 3 completed 2025-02-07. Read-only org core data only.*
