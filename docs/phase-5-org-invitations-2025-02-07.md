# Phase 5: Organisation Invitations — 2025-02-07

This document records scope, decisions, and implementation for Phase 5. Invitations allow org_admin (or super_admin) to invite users by email; invited users accept after signing in; acceptance creates OrganisationMember. **User remains the only identity; org is context; no org login.**

---

## 1. Goal

- Org_admin (or super_admin) can **invite users to an organisation by email**.
- Invited users **accept the invite after signing in** (no pre-auth invite flow).
- On acceptance: **create OrganisationMember**; mark invite as accepted.

---

## 2. Decisions & scope

| Decision       | Choice                                                                              |
| -------------- | ----------------------------------------------------------------------------------- |
| Identity       | User is the only identity (Clerk). One email = one user.                            |
| Org            | Organisation is context/workspace. No org auth.                                     |
| Invite storage | New table `OrganisationInvite` only. No Clerk linkage.                              |
| Token          | Unique string, one-time use. 7-day expiry.                                          |
| Accept         | POST /api/org-invites/[token]/accept; invite.email must match signed-in user email. |
| Revoke         | Optional DELETE invite; can defer. (In scope: list pending, create invite, accept.) |

---

## 3. Step 5.1 — Database

- **New table:** `OrganisationInvite`
  - id (cuid, PK)
  - organisationId (FK → Organisation, onDelete: Cascade)
  - email (string, normalised lowercase)
  - role ("member" \| "team_manager" \| "org_admin")
  - token (string, unique)
  - invitedBy (clerkUserId)
  - expiresAt (DateTime)
  - acceptedAt (DateTime?)
  - createdAt (DateTime)
- **Migration:** Created and run. Documented below.

---

## 4. Step 5.2 — API

| Method | Endpoint                        | Permission       | Purpose                                                                                                                             |
| ------ | ------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/orgs/[orgId]/invites       | canActAsOrgAdmin | Create invite (email + role, 7-day expiry). 409 if already member or active invite.                                                 |
| GET    | /api/orgs/[orgId]/invites       | canActAsOrgAdmin | List pending (not accepted, not expired).                                                                                           |
| POST   | /api/org-invites/[token]/accept | auth required    | Accept invite: email match, create OrganisationMember, set acceptedAt. 404 invalid/expired; 403 email mismatch; 409 already member. |

---

## 5. Step 5.3 — UI (org admin)

- **Route:** /org/[orgId]/admin/members (extend existing).
- **Add:** "Invite a teammate" form (email + role, default member).
- **Add:** "Pending invites" section (email, role, expiry, optional revoke).
- **Copy:** "organisation workspace", "invite a teammate"; never "org account", "org login", "organisation identity".

---

## 6. Step 5.4 — UI (accept)

- **Route:** /org/invites/[token].
- **Behaviour:** Not signed in → redirect to /sign-in?redirect=/org/invites/[token]. Signed in → show org name + role, CTA "Accept invitation"; on success redirect to /org/[orgId].
- **Copy:** "You're joining {Org Name} as a {role}." Joining a workspace, not creating an account.

---

## 7. Step 5.5 — Safety & UX

- Disable accept button while submitting.
- Clear errors: expired invite, email mismatch, already a member.
- No silent failures.

---

## 8. What did NOT change

- No org authentication.
- No auto-creation of users.
- No team logic or experiment assignment.
- Existing permissions (canActAsOrgAdmin, canAccessOrg) unchanged except where new routes use them.
- Phases 1–4.3 behaviour unchanged.

---

## 9. Files touched

| File                                                                   | Change                                                                                       |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| prisma/schema.prisma                                                   | Add OrganisationInvite model + relation on Organisation.                                     |
| prisma/migrations/20250207120000_add_organisation_invite/migration.sql | Migration for OrganisationInvite table.                                                      |
| src/app/api/orgs/[orgId]/invites/route.ts                              | **New.** POST create invite, GET list pending.                                               |
| src/app/api/org-invites/[token]/route.ts                               | **New.** GET invite details (no auth).                                                       |
| src/app/api/org-invites/[token]/accept/route.ts                        | **New.** POST accept (auth; email match; create member + set acceptedAt).                    |
| src/app/(org)/org/[orgId]/admin/members/OrgMembersClient.tsx           | Invite-a-teammate form, pending invites table, show invite link after send.                  |
| src/app/(org)/org/invites/[token]/page.tsx                             | **New.** Accept page: sign-in redirect, org name + role, CTA, clear errors.                  |
| src/proxy.ts                                                           | /org/invites/\* unauthenticated → redirect to sign-in?redirect_url=…; set x-pathname header. |
| src/app/(org)/layout.tsx                                               | Allow /org/invites/\* for any authenticated user (skip canAccessOrgPortal).                  |
| src/app/(auth)/sign-in/[[...sign-in]]/page.tsx                         | Use redirect_url query for post–sign-in redirect.                                            |
| docs/API.md                                                            | Document Phase 5 endpoints.                                                                  |

---

## 10. Final checklist

- [x] Prisma migration created (run `npx prisma migrate deploy` or `npx prisma migrate dev` to apply).
- [x] All APIs permission-guarded (canActAsOrgAdmin for invites; auth for accept).
- [x] No org identity language (copy: organisation workspace, invite a teammate, joining with existing sign-in).
- [x] docs/phase-5-org-invitations-2025-02-07.md updated.
- [x] No breaking changes to Phases 1–4 (additive only; existing members flow unchanged).

---

_Phase 5 completed 2025-02-07._
