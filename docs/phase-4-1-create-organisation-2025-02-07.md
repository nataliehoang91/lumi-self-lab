# Phase 4.1: Create Organisation (Write) — 2025-02-07

This document describes the Phase 4.1 implementation: API and minimal UI to create an organisation, with the creator automatically becoming org_admin. No database schema changes. No invitations, teams, or experiment assignment.

---

## 1. Purpose of Phase 4.1

Enable a user who has **organisation capability** (User.accountType === "organisation") to:

1. Create an organisation (name, optional description).
2. Automatically become **org_admin** of that organisation.
3. See the new organisation in `/org` (real data from GET /api/orgs).

Nothing else: no member management, no invites, no teams, no analytics.

---

## 2. What changed

### API

- **POST /api/orgs** (new)
  - **Auth:** Required (Clerk). 401 if not authenticated.
  - **Permission:** User.accountType MUST be `"organisation"`. If not, 403 with message: "Upgrade required to create an organisation".
  - **Body:** `{ name: string (required), description?: string }`.
  - **Behaviour:** In a single transaction: create `Organisation` (name, description, createdBy = clerkUserId); create `OrganisationMember` (organisationId, clerkUserId, role = "org_admin", joinedAt = now).
  - **Response 201:** `{ id, name, description, role: "org_admin" }`.
  - **Errors:** 400 (validation), 403 (not upgraded), 500 (unexpected).

### UI

- **Route:** `(org)/org/create/page.tsx` → **/org/create**
  - Simple form: Name (required), Description (optional).
  - Submit → POST /api/orgs. On success → redirect to `/org/[orgId]`.
  - Copy: “Create an organisation”, “An organisation is a workspace for your team.” No “organisation account” or identity wording.
- **/org (org list):** “Create organisation” button added when `userData.accountType === "organisation"`, linking to `/org/create`.

### Permissions (org portal access)

- **canAccessOrgPortal(clerkUserId):** Now returns true if the user has **accountType === "organisation"** (in addition to “at least one org membership” or super_admin). This allows upgraded users with zero orgs to open `/org` and `/org/create` to create their first organisation.

---

## 3. What did NOT change

- **Database:** No Prisma schema changes. No new tables or columns.
- **Auth model:** User remains the only identity; Clerk only. No org login, org email, or org password.
- **Roles:** Admin is role, not account. org_admin is OrganisationMember.role; platform admin remains User.role === "super_admin".
- **GET /api/orgs:** Unchanged; after creation, the new org appears in the list with role org_admin.
- **Invitations, teams, experiment assignment, analytics:** Not in scope; not implemented.

---

## 4. Permissions enforced

| Check | Where | Effect |
|-------|--------|--------|
| Authenticated | POST /api/orgs | 401 if no Clerk user |
| User.accountType === "organisation" | POST /api/orgs | 403 “Upgrade required to create an organisation” if not |
| canAccessOrgPortal | (org) layout | Allows accountType "organisation" users with zero orgs to access /org and /org/create |

---

## 5. Explicit statements

- **User is identity.** Only users (individuals) authenticate. Organisation has no auth.
- **Org is context.** Organisation is a workspace for the team. Creating an org does not create a second identity or “org account.”
- **Admin is role, not account.** The creator gets OrganisationMember.role = "org_admin" for that org; there is no separate “admin account.”

---

## 6. Files touched

| File | Change |
|------|--------|
| `src/app/api/orgs/route.ts` | Added POST handler (create org + member in transaction). |
| `src/lib/permissions.ts` | canAccessOrgPortal: allow accountType "organisation" so upgraded users can access /org and /org/create with zero orgs. |
| `src/app/(org)/org/create/page.tsx` | **New.** Form to create organisation; POST /api/orgs → redirect to /org/[orgId]. |
| `src/app/(org)/org/page.tsx` | “Create organisation” button (when accountType === "organisation") linking to /org/create. |

---

*Phase 4.1 completed 2025-02-07. No schema changes. No Phase 4.2 (members management) in this release.*
