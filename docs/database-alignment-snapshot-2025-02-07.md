# Database Alignment Snapshot — 2025-02-07

This document is a **checkpoint** before Phase 4. It verifies that the current Prisma schema aligns with the architectural decisions: org as **context** (not identity), one email = one user, auth personal only, org membership and roles in our DB. **No schema changes were made in this phase.**

---

## 1. Current schema summary

### Tables and key fields

| Model                         | Key fields                                                                        | Purpose                                                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **User**                      | `id`, `clerkUserId` (unique), `email`, `accountType`, `role`, `upgradedAt`        | Single identity; linked to Clerk via `clerkUserId`. `accountType`: "individual" \| "organisation". `role`: "user" \| "super_admin".          |
| **Organisation**              | `id`, `name`, `description`, `createdBy` (clerkUserId)                            | Workspace/context. No email, password, or auth fields. Creator is a user.                                                                    |
| **OrganisationMember**        | `organisationId`, `clerkUserId`, `role`, `teamId?`, `teamName?`, `joinedAt`       | Many-to-many: user belongs to org with a role. `role`: "member" \| "team_manager" \| "org_admin". Unique on `(organisationId, clerkUserId)`. |
| **OrganisationTemplate**      | `organisationId`, `title`, `description`, `category`, `durationDays`, `frequency` | Org-scoped template (no auth).                                                                                                               |
| **OrganisationTemplateField** | `templateId`, `label`, `type`, `required`, `order`, …                             | Fields for a template.                                                                                                                       |
| **Experiment**                | `id`, `clerkUserId`, `title`, … , `organisationId?`                               | User-owned; optional link to org. Owner is always `clerkUserId`.                                                                             |
| **ExperimentField**           | `experimentId`, `label`, `type`, …                                                | Field definitions for an experiment.                                                                                                         |
| **ExperimentCheckIn**         | `experimentId`, `clerkUserId`, `checkInDate`, …                                   | One check-in per day per experiment.                                                                                                         |
| **ExperimentFieldResponse**   | `checkInId`, `fieldId`, response values                                           | Responses per field per check-in.                                                                                                            |

### Role and type conventions (in comments only; no Prisma enums)

- **User:** `accountType` = "individual" | "organisation"; `role` = "user" | "super_admin".
- **OrganisationMember:** `role` = "member" | "team_manager" | "org_admin".
- **Experiment:** `status` = "draft" | "active" | "completed"; `frequency` = "daily" | "every-2-days" | "weekly".

---

## 2. How the schema maps to the current auth + org model

| Decision                                                 | Schema support                                                                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **One email = one user; auth is personal only**          | `User` is the only table with identity linkage: `clerkUserId` (Clerk). No `Organisation.clerkUserId` as “org login”; no org email/password. |
| **Org is context, not identity**                         | `Organisation` has `name`, `description`, `createdBy`. No auth fields. Membership is via `OrganisationMember` (user + org + role).          |
| **Org roles are per-organisation**                       | `OrganisationMember.role` is per (organisationId, clerkUserId). One user can be org_admin in one org and member in another.                 |
| **Experiments are user-owned, optionally linked to org** | `Experiment.clerkUserId` is the owner; `Experiment.organisationId` is optional. Ownership is never transferred to org.                      |
| **Global admin vs org admin**                            | `User.role` = "super_admin" is global; `OrganisationMember.role` = "org_admin" is per-org. No overlap in tables.                            |
| **Creator of an org is a user**                          | `Organisation.createdBy` stores `clerkUserId`; relation to `User` via `creator`.                                                            |

---

## 3. Mismatches or risks (wording, structure, assumptions)

### 3.1 Wording that can imply “org as identity”

- **User.accountType "organisation"**  
  The value `"organisation"` can be read as “this is an organisation account” (second identity). In our design it means “this user has the **capability** to create/manage organisations” (e.g. after upgrade). The schema does not store a separate org identity; the wording is just easy to misinterpret in docs and UI.

- **User relation comment:** `createdOrganisations … // Organisations this user created (if org account)`  
  The phrase **“org account”** suggests organisation as a type of account/identity. Conceptually it means “if user has accountType === 'organisation'” (capability). Consider avoiding “org account” in future docs and comments in favour of “user with organisation capability” or “upgraded user.”

- **No schema change recommended here:** Only alignment and documentation; renames would be a separate, deliberate change.

### 3.2 Structure and assumptions

- **accountType is capability, not identity**  
  The schema already supports this: `accountType` lives on `User` only. There is no separate “OrganisationAccount” or org-level auth. The only risk is naming/convention; the structure is correct.

- **Team is not a first-class entity**  
  `OrganisationMember` has `teamId?` and `teamName?` (optional). There is no `Team` table. Team-scoped behaviour (e.g. for `team_manager`) is deferred; the schema does not contradict “org as context.”

- **No invitation or assignment tables yet**  
  Invites and experiment-assignment are out of scope for this snapshot. When added later, they should still treat org as context and user as the only identity.

### 3.3 Good alignment (no change needed)

- `User.clerkUserId` as single auth link; no org-level Clerk linkage.
- `Organisation` without email/password/login fields.
- `OrganisationMember` with per-org role; unique on (organisationId, clerkUserId).
- `Experiment.clerkUserId` as owner; `organisationId` optional.
- `Organisation.createdBy` as clerkUserId (user created the org).

---

## 4. Missing pieces for later (do not add in this phase)

- **Invitations:** No `Invitation` (or similar) table; needed for “invite user to org” flows later.
- **Assignments:** No explicit “experiment assigned to member” table; needed for org/team assignment flows later.
- **Team entity:** No `Team` table; only `teamId`/`teamName` on `OrganisationMember`. May be added later if team becomes first-class.

These are noted for future phases only; no schema changes in this checkpoint.

---

## 5. Explicit statement

**No schema changes were made in this phase.**  
This document only records how the current database aligns with the auth and org model (org as context, user as sole identity, org roles per-org, experiments user-owned with optional org link) and where naming or comments could be clarified later. Routes, permissions, and database are intended to point in the same direction before Phase 4 (org creation, invites, assignments, team-scoped experiments).

---

_Database alignment snapshot completed 2025-02-07. Checkpoint only._
