# Auth & organisation alignment checkpoint (2025-02-07)

This document records the **current state** of the codebase against the canonical auth/org model. It is a read-and-confirm checkpoint only.

---

## 1. How Clerk is used (identity only)

- **Authentication:** `auth()` and `clerkClient()` from `@clerk/nextjs/server` are used only to obtain the current user’s `userId` (and optionally email). All protected routes and API handlers rely on this single identity.
- **Webhooks:** `src/app/api/webhooks/clerk/route.ts` handles `user.created`, `user.updated`, and `user.deleted`. It **only** creates, updates, or deletes rows in the **User** table (by `clerkUserId` and email). There is no organisation or membership logic in the webhook handler.
- **No Clerk Organizations:** There are no references to Clerk’s organization APIs (e.g. `clerk.organizations`, `createOrganization`) in the app code. Organisation data lives entirely in the app database (`Organisation`, `OrganisationMember`).

**Conclusion:** Clerk is used only for user authentication and identity. One email = one user in Clerk and in our `User` table.

---

## 2. Organisation is context, not identity

- **Organisation model:** Has `id`, `name`, `description`, `createdBy` (stores `clerkUserId` of the creating user). It has **no** email, password, or Clerk linkage. It is a workspace/context.
- **OrganisationMember:** Links a **user** (`clerkUserId`) to an **organisation** (`organisationId`) with a **role** (`member` | `team_manager` | `org_admin`). Membership and roles are entirely app-managed.
- **Upgrade:** The upgrade flow (`POST /api/users/upgrade`) only updates **User** in the database: it sets `accountType` to `"organisation"` and `upgradedAt`. It does not create or use any Clerk organisation; it only unlocks the capability to create organisations in our app.
- **Switching org:** Changing the selected organisation in the UI is changing **context** (which workspace the user is viewing), not switching account or identity. The same user (same Clerk session) can be a member of multiple organisations with different roles.

**Conclusion:** Organisation is an internal workspace/context. It is not an identity; it has no auth and no Clerk linkage.

---

## 3. Prisma schema alignment

| Area | Status |
|------|--------|
| **User** | Has `clerkUserId` (unique), `email`, `accountType` (default `"individual"`), `role`, `upgradedAt`. Single identity linked to Clerk. |
| **Organisation** | No auth-related fields; only `name`, `description`, `createdBy` (clerkUserId of creator). |
| **OrganisationMember** | Links `organisationId` + `clerkUserId` with `role`. Unique on `(organisationId, clerkUserId)`. |
| **Clerk webhook** | Only touches `User` (create/update/delete by `clerkUserId`). No writes to `Organisation` or `OrganisationMember`. |
| **User creation** | Webhook and identity route create users with `accountType: "individual"` by default. |

The current Prisma schema matches the intended model: User = identity (Clerk-linked); Organisation = context (app-only); OrganisationMember = membership/roles.

---

## 4. Risky or misleading wording (for later alignment)

The following locations use phrasing that can imply “organisation as account/identity”. They are **noted only**; no changes were made in this step.

| File | Line | Wording / context |
|------|------|-------------------|
| `src/hooks/user-context.tsx` | 75 | Comment: “organisation accountType” — could be read as “org account”. |
| `src/components/Navigation/navigation-bar.tsx` | 90 | Comment: “Organisation accounts see …” |
| `src/components/Navigation/navigation-bar.tsx` | 170 | Comment: “Organisation accounts (always)” |
| `src/components/Navigation/navigation-bar.tsx` | 325 | Comment: “Organisation accounts (always)” (mobile nav) |
| `src/app/api/users/upgrade/route.ts` | 6 | JSDoc: “organisation account type” |
| `src/app/api/users/upgrade/route.ts` | 48 | Error message: “User is already an organisation account” |
| `src/app/api/users/upgrade/route.ts` | 53 | Comment: “Upgrade to organisation account” |
| `src/app/api/users/upgrade/route.ts` | 62 | Comment: “create with organisation account type” |
| `prisma/schema.prisma` | 27 | Comment on `createdOrganisations`: “if org account” |
| `docs/API.md` | 55 | “organisation account type”; 71: “already organisation account” |
| `docs/DOCUMENTATION.md` | 158 | “Upgrade to organisation account”; 223: “organisation accounts only”; 776: “organisation accounts” |
| `docs/MIGRATION_GUIDE.md` | 100, 105 | “accountType: organisation”, “organisation accounts” |
| `docs/ROLE_LOGIC_EXPLANATION.md` | 43, 52, 123 | “Organisation Account” |
| `docs/ROLE_STRUCTURE_ANALYSIS.md` | 20, 65, 76 | “Org Account-Admin”, “Org Account” |

Existing phase docs (`phase-4-1`, `phase-4-2`, `phase-4-3`, `phase-5`, `database-phase-4-alignment`, `database-alignment-snapshot`, `auth-identity-decision`) already state that org is context and that we avoid “org account” / “org login” in user-facing copy; they are consistent with the canonical model.

---

## 5. Explicit statement

**No code changes were made in this step.** This checkpoint is documentation only: verify Clerk usage, confirm organisation-as-context, confirm schema alignment, and list wording to align later.
