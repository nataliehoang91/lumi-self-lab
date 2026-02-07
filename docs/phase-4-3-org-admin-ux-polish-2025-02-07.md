# Phase 4.3: Org Admin UX & Safety Polish — 2025-02-07

This document describes the Phase 4.3 implementation: UI/UX and copy improvements for Organisation Admin flows. **No backend logic changes. No database or API changes.**

---

## 1. Purpose of Phase 4.3

Improve usability, clarity, and safety of Organisation Admin flows:

- Prevent unsafe actions in the members UI (last org admin protection, clear identity/role badges).
- Clear confirmation and error copy.
- Copy cleanup so wording does not imply organisation is an identity.
- Better empty states and guidance.

---

## 2. What changed (UX-only)

### Org members UI safety (`/org/[orgId]/admin/members`)

- **Current user:** Fetches current user from `/api/users/identity`; shows **“You”** badge on the row that is the signed-in user.
- **Last org admin:** Detects when there is only one org_admin in the org.
  - For that row: role dropdown is **disabled** (cannot demote); remove button is **disabled**.
  - Inline helper text: **“At least one organisation admin is required.”**
  - super_admin can still change role/remove (backend already allows; frontend does not block super_admin).
- **Badges:** **“You”** (current user), **“Org admin”** (role), **“Platform admin”** (current user is super_admin). No new backend; display only.

### Confirmation & error UX

- **Remove member:** Confirmation dialog text: **“Remove this member from the organisation?”** (already present; unchanged).
- **Error copy (client-side mapping only):**
  - User not found → **“No user with this email exists yet.”**
  - Already member → **“This user is already a member of the organisation.”**
  - Last org admin (demote/remove) → **“You must keep at least one organisation admin.”**

### Copy cleanup (no logic change)

- **Upgrade page (`/upgrade`):**
  - Heading: “Upgrade to Organisation” → **“Unlock team & organisation features”.**
  - Button: “Upgrade to Organisation” → **“Unlock team & organisation features”.**
  - Body: “Create organizations” → **“Create organisation workspaces”**; “Invitation flow” / “Invite” → **“Add & manage members”** where appropriate.
  - Privacy blurb: “Organisation access” → **“team & organisation features”.**
- **Org create page (`/org/create`):**
  - “You will be the org admin” → **“You will have the organisation admin role.”**
- **Org members page:** “Manage who has access to this organisation” → **“Manage who has access to this organisation workspace.”**
- **Navigation bar:** Reviewed; no identity-implying copy changed (no “organisation account” or “org login” found).

### Empty states & guidance

- **Org with only 1 member:** On members page, show guidance: **“You can add teammates by email once they’ve signed up.”**
- **Members list:** Clear loading indicator (“Loading members…”); error state shows “Couldn’t load members” + message; empty state “No members yet” / “Add a member using the form above.”

---

## 3. What did NOT change

- **Database:** No Prisma or schema changes.
- **APIs:** No new endpoints; no changes to request/response or permission logic.
- **Permissions:** No new helpers; backend last-org-admin rules unchanged.
- **Auth:** No changes to Clerk or auth flow.

---

## 4. Explicit restatement

- **User = identity.** Only users (individuals) sign in. Organisation does not have its own login or account.
- **Org = context.** Organisation is a workspace for the team. Copy uses “organisation workspace” / “team & organisation features,” not “organisation account.”
- **Admin = role.** org_admin is a role on the membership; platform admin is User.role. Copy uses “organisation admin role” where relevant.

---

## 5. Files touched

| File | Change |
|------|--------|
| `src/app/(org)/org/[orgId]/admin/members/OrgMembersClient.tsx` | Current user + last-org-admin detection; badges; disabled role/remove; friendly error copy; single-member guidance; empty/error copy. |
| `src/app/(individual)/upgrade/page.tsx` | Copy only: “Unlock team & organisation features,” “organisation workspaces,” “Add & manage members,” privacy blurb. |
| `src/app/(org)/org/create/page.tsx` | Copy only: “You will have the organisation admin role.” |

---

*Phase 4.3 completed 2025-02-07. UX and copy only. No schema or API changes. Phase 5 not started.*
