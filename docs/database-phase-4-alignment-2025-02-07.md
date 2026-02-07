# Database Phase 4 Alignment — 2025-02-07

This document validates the current Prisma schema against Phase 1–2–3 decisions and Phase 4 requirements (create organisation, manage members, assign org-level roles). **No schema changes were made.** No APIs were implemented.

---

## 1. Current schema summary

### User
| Field | Type | Notes |
|-------|------|--------|
| id | String (cuid) | Primary key |
| clerkUserId | String (unique) | Clerk identity; only auth link |
| email | String? | Synced from Clerk |
| accountType | String | "individual" \| "organisation" (capability) |
| role | String | "user" \| "super_admin" (global only) |
| upgradedAt | DateTime? | |
| createdAt, updatedAt | DateTime | |
| **Relations** | experiments, organisationMemberships, createdOrganisations | |

### Organisation
| Field | Type | Notes |
|-------|------|--------|
| id | String (cuid) | Primary key |
| name | String | |
| description | String? | |
| createdBy | String | clerkUserId of creator (user, not org) |
| createdAt, updatedAt | DateTime | |
| **Relations** | members, templates, experiments | No email, password, or Clerk. |

### OrganisationMember
| Field | Type | Notes |
|-------|------|--------|
| id | String (cuid) | Primary key |
| organisationId | String | FK → Organisation |
| clerkUserId | String | FK → User |
| role | String | "member" \| "team_manager" \| "org_admin" |
| teamId, teamName | String? | Optional; no Team table |
| joinedAt | DateTime | |
| **Unique** | (organisationId, clerkUserId) | One membership per user per org |

### Experiment
| Field | Type | Notes |
|-------|------|--------|
| id | String (cuid) | Primary key |
| clerkUserId | String | Owner (required) |
| organisationId | String? | Optional link to org (context only) |
| title, whyMatters, hypothesis, durationDays, frequency, status, … | | |
| **Relations** | user?, organisation?, fields, checkIns | |

### OrganisationTemplate / OrganisationTemplateField
- **OrganisationTemplate:** organisationId, title, description, category, durationDays, frequency; relation to Organisation and OrganisationTemplateField.
- **OrganisationTemplateField:** templateId, label, type, required, order, field config. No auth.

---

## 2. Phase 1–2–3 rules (short)

- **User is the only identity.** Auth via Clerk only; one email = one user. No org login, org email, or org password.
- **Organisation is context/workspace, not identity.** It never authenticates; no email, password, or Clerk linkage.
- **Admin is role, not account.** Platform admin = User.role === "super_admin". Org admin = OrganisationMember.role === "org_admin". Team manager = OrganisationMember.role === "team_manager".
- **Experiments are always user-owned.** Experiment.clerkUserId = owner; Experiment.organisationId is optional and contextual only.

---

## 3. Phase 4 requirements

Phase 4 scope (DB perspective):

- **Create organisation:** Insert Organisation (name, description, createdBy = clerkUserId); optionally add creator as first member with role org_admin.
- **Add/remove members:** Insert/delete OrganisationMember rows (organisationId, clerkUserId, role).
- **Assign org-level roles:** Update OrganisationMember.role (member | team_manager | org_admin).

Out of scope for Phase 4 (no schema for these yet):

- NO teams CRUD
- NO experiment assignment
- NO analytics
- NO invitations (noted as future)

---

## 4. Schema verdict

### 4.1 Per-model validation

| Model | Matches Phase 1–2–3? | Org as identity? | Admin as account? | Misleading name but correct structure? |
|-------|----------------------|-------------------|-------------------|----------------------------------------|
| **User** | Yes. Single identity via clerkUserId. | No. accountType "organisation" is capability (can create orgs), not a second identity. | No. role "super_admin" is a role on User, not a separate account. | accountType "organisation" can sound like “org account”; meaning is “user with org capability.” |
| **Organisation** | Yes. Workspace only; no auth fields. | No. No email, password, or Clerk. | N/A. | None. |
| **OrganisationMember** | Yes. Links user to org with per-org role. | No. | No. org_admin / team_manager are roles on membership. | None. |
| **Experiment** | Yes. clerkUserId owner; organisationId optional. | No. | N/A. | None. |
| **OrganisationTemplate** | Yes. Org-scoped content. | No. | N/A. | None. |

### 4.2 Phase 4 capability check

- **Create organisation:** Supported. Organisation has id, name, description, createdBy. Creator is a user (clerkUserId). No new fields needed.
- **Add member:** Supported. Insert OrganisationMember(organisationId, clerkUserId, role). Unique on (organisationId, clerkUserId) prevents duplicates.
- **Remove member:** Supported. Delete OrganisationMember by id or (organisationId, clerkUserId).
- **Assign role:** Supported. Update OrganisationMember.role to member | team_manager | org_admin.

### 4.3 Verdict

**Phase 4 requires NO Prisma schema changes.**

The existing schema already supports creating organisations, adding/removing members, and assigning org-level roles. No new tables, no new columns, and no migrations are required for Phase 4 as scoped above.

---

## 5. Explicit statements

- **User is identity.** The only authenticated identity in the system is User, linked to Clerk via User.clerkUserId. Organisation has no auth.
- **Org is context.** Organisation is a workspace/context. It has no email, password, or Clerk linkage. Membership and roles are expressed via OrganisationMember.
- **Admin is role, not account.** Platform admin is User.role === "super_admin". Org admin and team manager are OrganisationMember.role values ("org_admin", "team_manager"). There is no separate “admin account” type.

---

*Database Phase 4 alignment completed 2025-02-07. No schema changes. No APIs implemented. Proceed to Phase 4 implementation only after approval.*
