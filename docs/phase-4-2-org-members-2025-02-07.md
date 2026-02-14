# Phase 4.2: Organisation Members Management — 2025-02-07

This document describes the Phase 4.2 implementation: API and minimal admin UI for listing, adding, updating roles, and removing organisation members. No database schema changes. No invitations, teams, or experiment assignment.

---

## 1. Purpose of Phase 4.2

Enable **org_admin** (or **super_admin**) to:

1. View members of an organisation
2. Add an existing user to the organisation (by email)
3. Change a member’s role (member | team_manager | org_admin)
4. Remove a member from the organisation

Organisations become real for multi-user use while staying simple and safe.

---

## 2. APIs added

| Method | Endpoint                               | Permission       | Brief                                                                                               |
| ------ | -------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| GET    | `/api/orgs/[orgId]/members`            | canAccessOrg     | List members (id, clerkUserId, email, role, joinedAt). Email from User.                             |
| POST   | `/api/orgs/[orgId]/members`            | canActAsOrgAdmin | Add member by email + optional role (default member). 400 if user not found; 409 if already member. |
| PATCH  | `/api/orgs/[orgId]/members/[memberId]` | canActAsOrgAdmin | Update role. Cannot demote last org_admin (super_admin bypasses).                                   |
| DELETE | `/api/orgs/[orgId]/members/[memberId]` | canActAsOrgAdmin | Remove member. Cannot remove last org_admin (super_admin bypasses).                                 |

---

## 3. Permissions enforced

| Check                                | Where                         | Effect                              |
| ------------------------------------ | ----------------------------- | ----------------------------------- |
| Authenticated                        | All four endpoints            | 401 if no Clerk user                |
| canAccessOrg(clerkUserId, orgId)     | GET members                   | 404 if not member / org missing     |
| canActAsOrgAdmin(clerkUserId, orgId) | POST / PATCH / DELETE members | 403 if not org_admin or super_admin |
| Last org_admin                       | PATCH (demote) / DELETE       | 400 unless caller is super_admin    |

---

## 4. What is intentionally NOT implemented

- **Invitations / invite tokens:** Add member requires an existing user (by email). “User not found” returns a clear message; invitation flow is out of scope.
- **Team logic:** teamId / teamName are unused. No team UI or team-based permissions in this phase.
- **Experiment assignment:** No linking of experiments to members or teams.
- **New roles:** Only existing OrganisationMember roles: member, team_manager, org_admin.
- **Creating users:** POST members does not create users or send emails.
- **Auto-upgrade accountType:** Adding a user to an org does not change their User.accountType.

---

## 5. Explicit statements

- **User is identity.** Only users (individuals) authenticate. Organisation has no separate identity.
- **Org is context.** Organisation is a workspace. Managing members does not create “org accounts” or org sign-in.
- **Admin is role, not account.** org_admin is OrganisationMember.role; platform admin is User.role === "super_admin". There is no separate “admin account” type.

---

## 6. UI

- **Route:** `(org)/org/[orgId]/admin/members` → **/org/[orgId]/admin/members**
- **Access:** Guarded by canActAsOrgAdmin in `(org)/org/[orgId]/admin/layout.tsx`.
- **Content:** Table (Email, Role, Joined); per-row role select and remove button; “Add member” form (email + role, default member). No team UI, no invitation UI. Copy does not imply org is identity.

---

## 7. Files touched

| File                                                           | Change                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------- |
| `src/app/api/orgs/[orgId]/members/route.ts`                    | **New.** GET (list), POST (add by email).                      |
| `src/app/api/orgs/[orgId]/members/[memberId]/route.ts`         | **New.** PATCH (role), DELETE (remove).                        |
| `src/app/(org)/org/[orgId]/admin/members/page.tsx`             | Implemented with OrgMembersClient (table + add form).          |
| `src/app/(org)/org/[orgId]/admin/members/OrgMembersClient.tsx` | **New.** Client UI for members list, add, role change, remove. |

---

_Phase 4.2 completed 2025-02-07. No Prisma schema changes. No Phase 4.3 or invites in this release._
