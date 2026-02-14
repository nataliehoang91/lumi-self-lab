# Phase 2: Role & Permission Model — 2025-02-07

This document defines the centralized role and permission model added in Phase 2. It should be read with `docs/architecture-snapshot-2025-02-07.md` and `docs/phase-1-auth-boundary-2025-02-07.md`.

---

## 1. Role definitions

### Global (user-level)

Defined on `User.role` (database).

| Role            | Description                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **user**        | Default. Can use personal portal; org access depends on `OrganisationMember` rows.                                 |
| **super_admin** | Global app admin. Bypasses org membership checks; can access super-admin portal and (when implemented) admin APIs. |

### Org-level

Defined on `OrganisationMember.role` (per organisation).

| Role             | Description                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| **member**       | Can access org context and view aggregate insights; cannot manage org (templates, members, experiments).        |
| **team_manager** | Same as member plus manage org within team scope (team scoping deferred to later phases).                       |
| **org_admin**    | Full org management for this org; only role that may access `/org/[orgId]/admin/*` (with super_admin override). |

---

## 2. Permission matrix (who can do what)

| Permission                                                                       | user (no org)   | member          | team_manager    | org_admin       | super_admin     |
| -------------------------------------------------------------------------------- | --------------- | --------------- | --------------- | --------------- | --------------- |
| Access own personal data (profile, experiments, check-ins)                       | ✅              | ✅              | ✅              | ✅              | ✅              |
| Manage own experiment (CRUD, fields, check-ins)                                  | ✅ (owner only) | ✅ (owner only) | ✅ (owner only) | ✅ (owner only) | ✅ (owner only) |
| Access org portal (see org list / enter an org)                                  | ❌              | ✅              | ✅              | ✅              | ✅              |
| Access a specific org (view org context, non-admin pages)                        | ❌              | ✅              | ✅              | ✅              | ✅              |
| View aggregate insights for an org                                               | ❌              | ✅              | ✅              | ✅              | ✅              |
| Manage org (templates, experiments, members; team-scoped for team_manager later) | ❌              | ❌              | ✅              | ✅              | ✅              |
| Act as org admin (access `/org/[orgId]/admin/*`)                                 | ❌              | ❌              | ❌              | ✅              | ✅              |
| Super-admin portal and future admin APIs                                         | ❌              | ❌              | ❌              | ❌              | ✅              |

**Note:** Experiment “manage” is ownership-based only. No org or manager role grants access to another user’s experiment.

---

## 3. Centralized helpers (`src/lib/permissions.ts`)

| Helper                                              | Purpose                                                           | Used by                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| `getAuthenticatedUserId()`                          | Current Clerk ID or null; caller returns 401 if null.             | All protected APIs, layout guards                                     |
| `canAccessPersonalData(clerkUserId)`                | True if authenticated (for self-only APIs).                       | Documented for GET /api/users/identity, POST /api/users/upgrade       |
| `canManageExperiment(experimentId, clerkUserId)`    | True if user owns the experiment.                                 | Alternative to `requireExperimentOwner` when only a boolean is needed |
| `requireExperimentOwner(experimentId, clerkUserId)` | Returns experiment if owned, else null.                           | All experiment and check-in/field APIs                                |
| `requireSuperAdmin(clerkUserId)`                    | True if `User.role === "super_admin"`.                            | Super-admin layout; future admin APIs                                 |
| `getOrgMembership(clerkUserId, orgId)`              | Returns `OrganisationMember` or null.                             | `canAccessOrg`, `canManageOrg`, `canActAsOrgAdmin`, layout guards     |
| `canAccessOrg(clerkUserId, orgId)`                  | True if member of org (any role) or super_admin.                  | Org-scoped read; org layout guard                                     |
| `canManageOrg(clerkUserId, orgId)`                  | True if role in [team_manager, org_admin] or super_admin.         | Future org management APIs                                            |
| `canViewAggregateInsights(clerkUserId, orgId)`      | Same as `canAccessOrg` (aggregate only).                          | Future org insights APIs                                              |
| `canActAsOrgAdmin(clerkUserId, orgId)`              | True if `OrganisationMember.role === "org_admin"` or super_admin. | `/org/[orgId]/admin` layout guard                                     |

---

## 4. What is enforced today

- **Personal data:** APIs that serve only the current user (e.g. `GET /api/users/identity`, `POST /api/users/upgrade`) require an authenticated user; no role check. Documented as `canAccessPersonalData`.
- **Experiments:** All experiment and sub-resource APIs enforce **ownership** via `requireExperimentOwner` (or equivalent). Non-owners get 404. No org or manager role grants access.
- **Super-admin portal:** Layout uses `requireSuperAdmin(clerkUserId)`; non–super-admins are redirected.
- **Org portal:** Layout uses `canAccessOrgPortal(clerkUserId)` (at least one org membership or super_admin). Per-org and org-admin guards use `canAccessOrg` / `canActAsOrgAdmin` where the new org route structure is in place.

---

## 5. What is intentionally deferred

- **Org-scoped APIs:** No real org list, org detail, org templates, or org insights APIs yet. When added, they must use `canAccessOrg`, `canManageOrg`, or `canViewAggregateInsights` as appropriate; no new permission logic beyond these helpers.
- **Team-scoped behaviour:** `canManageOrg` includes `team_manager`; enforcement of “only within this team” is deferred to a later phase.
- **Super-admin APIs:** No global admin APIs yet; when added, they must use `requireSuperAdmin()` in the route handler.
- **Experiment–org link/unlink:** Not implemented; when implemented, “who can link” should use ownership for the experiment and `canManageOrg` or org_admin for the org side as decided by product.

---

## 6. Mapping of permissions to API routes

| Route                                    | Permission                                             | Enforcement                                               |
| ---------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| `GET /api/users/identity`                | canAccessPersonalData                                  | auth(); 401 if no userId                                  |
| `POST /api/users/upgrade`                | canAccessPersonalData                                  | auth(); 401 if no userId                                  |
| `GET/POST /api/experiments`              | Authenticated; list/create scoped to clerkUserId       | getAuthenticatedUserId(); filter/create by userId         |
| `GET/PATCH/DELETE /api/experiments/[id]` | canManageExperiment (ownership)                        | requireExperimentOwner(id, userId); 404 if null           |
| `* /api/experiments/[id]/checkins/*`     | canManageExperiment                                    | requireExperimentOwner(experimentId, userId); 404 if null |
| `* /api/experiments/[id]/fields/*`       | canManageExperiment                                    | requireExperimentOwner(experimentId, userId); 404 if null |
| `POST /api/chat`                         | Authenticated (personal)                               | getAuthenticatedUserId(); 401 if null                     |
| Org-scoped APIs (future)                 | canAccessOrg / canManageOrg / canViewAggregateInsights | To be added when org APIs exist                           |
| Super-admin APIs (future)                | requireSuperAdmin                                      | To be added when admin APIs exist                         |

---

_Phase 2 completed 2025-02-07. Logic and permissions only; no new features, DB tables, or UI changes._
