# Phase 1: Auth Boundary & Portal Guards — 2025-02-07

This document describes the portal access model and server-side guards added in Phase 1. It should be read together with `docs/architecture-snapshot-2025-02-07.md`.

---

## 1. Portals and route categories

All routes under `/(protected)/` require an authenticated user (enforced in middleware). Within that, routes are grouped into four portal categories:

| Portal                  | Paths                                                                                                                                         | Purpose                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Personal**            | `/create`, `/dashboard`, `/experiments/*`, `/insights`, `/onboarding/*`, `/templates`, `/upgrade`, `/(protected)/page.tsx`, `/test-scenarios` | App for the signed-in user: experiments, dashboard, templates, upgrade.                                                              |
| **Org**                 | `/org`, `/org/[orgId]/*`, `/org/invites/[inviteId]`                                                                                           | Org portal: org switcher, org dashboard, member views (teams, experiments, templates, insights), org-admin (`/org/[orgId]/admin/*`). |
| **Admin (super-admin)** | `/super-admin`                                                                                                                                | Global app admin (non-Clerk); DB role only.                                                                                          |
| **Admin (Clerk)**       | _(none)_                                                                                                                                      | No Clerk-based admin portal in this app.                                                                                             |

There is no separate “Admin portal” besides the super-admin portal; access to super-admin is determined only by the database role `User.role === "super_admin"`, not by Clerk.

---

## 2. Who can access each portal

### Personal portal

- **Who:** Any Clerk-authenticated user.
- **Enforcement:** Middleware ensures the user is signed in; otherwise redirect to `/waitlist` (or 401 for API). No extra DB or role check for personal routes.

### Org portal

- **Who:** Users who have at least one org membership (`OrganisationMember`), or users with global role `super_admin`.
- **Enforcement:** Server-side layout guard in `(org)/layout.tsx` for all `/org/*` and `/org/invites/*`. It uses `canAccessOrgPortal(clerkUserId)` (see `src/lib/permissions.ts`), which is true if the user has any `organisationMemberships` or `User.role === "super_admin"`. If not allowed, redirect to `/dashboard`. Per-org and org-admin guards live in `(org)/org/[orgId]/layout.tsx` and `(org)/org/[orgId]/admin/layout.tsx` (see `docs/phase-org-admin-routing-2025-02-07.md`).
- **Note:** Nav still shows/hides Org links based on `userData` (e.g. `hasManagerRole`, `isOrgAdmin`, `isParticipant`). The layout guards enforce access at the server so that direct URL access is also protected.

### Super-admin portal

- **Who:** Only users with `User.role === "super_admin"` in the database.
- **Enforcement:** Server-side layout guard in `(protected)/super-admin/layout.tsx` using `requireSuperAdmin(clerkUserId)`. Clerk authentication alone does **not** grant access; only the DB role does. If not super_admin, redirect to `/dashboard`.
- **Note:** Super-admin is intentionally not tied to Clerk roles; it is app-defined and stored in the DB.

### Admin portal (Clerk)

- **Who:** N/A — there is no Clerk-based admin portal in this codebase.

---

## 3. How access is enforced

### Unauthenticated users

- **Where:** Middleware (`src/proxy.ts`).
- **How:** `clerkMiddleware` + `isPublicRoute`. If the route is not public and the user is not authenticated, pages redirect to `/waitlist` and API requests get 401.
- **Public routes:** `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/forgot-password(.*)`, `/reset-password(.*)`, `/waitlist(.*)`, `/api/waitlist`.

### Personal portal

- **Where:** Middleware only.
- **How:** No additional guard. Any authenticated user can access personal routes.

### Org portal

- **Where:** Server layout `src/app/(org)/layout.tsx` (covers `/org`, `/org/[orgId]/*`, `/org/invites/*`).
- **How:** Layout runs on the server, calls `getAuthenticatedUserId()` then `canAccessOrgPortal(userId)`. If the user is not authenticated, redirect to `/waitlist`. If the user cannot access the org portal (no org membership and not super_admin), redirect to `/dashboard`. Otherwise render children.
- **Data:** `canAccessOrgPortal` uses the database (Prisma): `User` and `organisationMemberships` (and `User.role` for super_admin).

### Super-admin portal

- **Where:** Server layout `src/app/(invisible-admin)/super-admin/layout.tsx`.
- **How:** Layout runs on the server, calls `getAuthenticatedUserId()` then `requireSuperAdmin(userId)`. If not authenticated, redirect to `/waitlist`. If not super_admin, redirect to `/dashboard`. Otherwise render children.
- **Data:** `requireSuperAdmin` uses the database: `User.role === "super_admin"`.

---

## 4. What is intentionally not enforced yet

- **Per-org or per-role within Org portal:** Access to the org portal is “has any membership or super_admin”. Per-org access is enforced in `(org)/org/[orgId]/layout.tsx` with `canAccessOrg(clerkUserId, orgId)`; org-admin-only routes in `(org)/org/[orgId]/admin/layout.tsx` with `canActAsOrgAdmin(clerkUserId, orgId)` (see `docs/phase-org-admin-routing-2025-02-07.md`).
- **Invite accept URL:** `/org/invites/[inviteId]` is behind the same org-portal guard as the rest of `/org`. A user with **no** org membership cannot open that URL and would be redirected to `/dashboard`. When a real invite flow exists, consider allowing access for users with a valid invite even if they have no org yet (e.g. exclude this path from the org-portal guard or add a separate invite-based check).
- **API routes for org or super-admin:** Phase 1 adds page/layout guards only. Org-scoped APIs and super-admin APIs (when added) must enforce access in the route handler (e.g. `getOrgMembership`, `requireSuperAdmin`) as in Phase 0 and `src/lib/permissions.ts`.

---

## 5. Files added or changed (Phase 1)

| File                                               | Change                                                                                                                                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/permissions.ts`                           | Added `canAccessOrgPortal(clerkUserId)` for org-portal access.                                                                                                                                                                       |
| `src/app/(invisible-admin)/super-admin/layout.tsx` | Server layout: redirect if not authenticated or not `super_admin`.                                                                                                                                                                   |
| `src/app/(org)/layout.tsx`                         | Server layout: redirect if not authenticated or cannot access org portal (`canAccessOrgPortal`). Per-org and org-admin guards are in `(org)/org/[orgId]/layout.tsx` and `(org)/org/[orgId]/admin/layout.tsx` (added in later phase). |

---

_Phase 1 completed 2025-02-07. No new features; access control and routing safety only._
