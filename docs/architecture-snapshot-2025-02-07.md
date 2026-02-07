# Architecture Snapshot — 2025-02-07

## 1. Purpose of This Document

This document is a **point-in-time snapshot** of the Lumi Self-Lab codebase. It describes the current state of the application as of 2025-02-07: what exists, what is partially implemented, and what is not implemented. **No code or logic was changed** to produce this snapshot; it is documentation only.

---

## 2. Current Portal Structure

**Current route structure (as of this refactor):** See `docs/APP-ROUTE-STRUCTURE.md` for the authoritative list. Routes use groups `(individual)`, `(org)`, `(admin)`, `(invisible-admin)`; org portal is `/org` and `/org/[orgId]/*` with `/org/[orgId]/admin/*` for org-admin. User identity: `GET /api/users/identity`.

The following subsection describes portal *categories*; path prefixes may differ from the current app directory (e.g. no `(protected)`; personal is `(individual)`, org is `(org)`). For current URLs and layout paths see `docs/APP-ROUTE-STRUCTURE.md`. There is no separate “portal” routing; visibility is controlled by nav links and page-level checks.

### Personal / Individual

- **Landing (protected home):** `/` (public), `/create` (protected entry), and `/(protected)/page.tsx` — “Welcome to Self-Lab” with Start New Experiment / View Past Reflections.
- **Dashboard:** `/(protected)/dashboard/page.tsx` — Role-based sections (individual, participant, team manager, org admin) using **mock data**.
- **Experiments:** `/(protected)/experiments` — List, detail, new, from-template; experiment detail has an **org-linking** sub-page (UI only; link/unlink APIs not implemented).
- **Create flow:** `/(protected)/create`, `/(protected)/experiments/new`, `/(protected)/experiments/new/create`, `/(protected)/experiments/new/from-template`.
- **Templates (personal):** `/(protected)/templates` — Browse templates (mock).
- **Insights:** `/(protected)/insights/page.tsx`.
- **Upgrade:** `/(protected)/upgrade/page.tsx`.
- **Onboarding:** `/(protected)/onboarding`, `/(protected)/onboarding/guided`, `/(protected)/onboarding/preview`.
- **Test scenarios:** `/(protected)/test-scenarios/page.tsx` — Scenario switcher for testing (does not change real `userData`).

### Org-Related Pages

- **Organisations list:** `/(protected)/organisations/page.tsx` — “Your Organisations” and “Pending Invitations” using **mock data**. Links to “Join Organisation” point to `/organisations/join`, which **does not exist**.
- **Organisation dashboard:** `/(protected)/organisations/[orgId]/page.tsx` — Org overview with mock data; links to templates, insights, and `organisations/[orgId]/members` (members route not present).
- **Organisation templates:** `/(protected)/organisations/[orgId]/templates/page.tsx` — Mock data.
- **Organisation insights:** `/(protected)/organisations/[orgId]/insights/page.tsx` — Mock data.
- **Invite accept:** `/(protected)/organisations/invites/[inviteId]/page.tsx` — Mock data; TODO for decline API.

### Manager (Org / Team Management)

- **Manager home:** `/(protected)/manager/page.tsx` — “My Organizations” and “Aggregate Insights” tabs; **mock** org list and aggregate data. Link to Manager templates.
- **Manager org detail:** `/(protected)/manager/orgs/[orgId]/page.tsx` — Tabs: Experiments, Templates, Invitations, Insights; all **mock** data.
- **Manager templates:** `/(protected)/manager/templates/page.tsx`, `/(protected)/manager/templates/create/page.tsx` — Template list and create UI; **mock** templates in list.
- **Old manager:** `/(protected)/old-manager/` — Legacy manager and templates (still in tree).

### Super Admin

- **Super Admin:** `/(protected)/super-admin/page.tsx` — Shown only when `userData.isSuperAdmin` (i.e. `User.role === "super_admin"`). Client-side guard only; no server-side enforcement. Placeholder copy for global admin tools.

### Joined Experiments (Participant)

- **Joined experiments list:** `/(protected)/joined-experiments/page.tsx` — Lists orgs and “Pending Assignments”; **mock** orgs and assignments. Routes managers to `/manager/orgs/[orgId]`, members to `/joined-experiments/[orgId]`.
- **Joined experiments by org:** `/(protected)/joined-experiments/[orgId]/page.tsx` — Org-specific participant view; **mock** org, teams, and experiments.

---

## 3. Authentication & User Model

### Clerk

- **Middleware:** `src/proxy.ts` uses `clerkMiddleware`. Non-public routes require auth; unauthenticated users are redirected to `/waitlist` (pages) or get 401 (API). Public: `/`, `/sign-in(.*)`, `/sign-up(.*)`, `/forgot-password(.*)`, `/reset-password(.*)`, `/waitlist(.*)`, `/api/waitlist`.
- **Webhook:** `src/app/api/webhooks/clerk/route.ts` handles `user.created`, `user.deleted`, `user.updated`. On create: inserts `User` with `clerkUserId`, `email` (from primary email), `accountType: "individual"`. No `role` or `accountType` change in webhook.
- **User resolution:** `GET /api/users/identity` uses `auth()` for `userId`, optionally syncs email from Clerk, and get-or-creates a `User` with `accountType: "individual"` if missing. Returns user plus `organisationMemberships` (with `organisation`) and a count of experiments where `organisationId` is set; `isParticipant` is derived from memberships or that count.

### Internal User Model (Prisma)

- **User:** `id`, `clerkUserId` (unique), `email`, `accountType` (`"individual"` \| `"organisation"`), `role` (`"user"` \| `"super_admin"`), `upgradedAt`, timestamps. Relations: `experiments`, `organisationMemberships`, `createdOrganisations`.
- **Roles/flags in code:**  
  - **Global:** `User.role` — `user` (default) or `super_admin` (full access; `upgradedAt` treated as set in API).  
  - **Per-org:** `OrganisationMember.role` — `member`, `team_manager`, `org_admin`.  
  - **Account type:** `User.accountType` — `individual` (default) or `organisation` (can create orgs; used for nav and “Organisations” link).

---

## 4. Organization / Team / Experiment State

### Organisation Model

- **Organisation:** `id`, `name`, `description`, `createdBy` (clerkUserId of creator), timestamps. Relations: `members` (OrganisationMember), `templates` (OrganisationTemplate), `experiments` (experiments linked to org).
- **OrganisationMember:** `organisationId`, `clerkUserId`, `role` (member \| team_manager \| org_admin), optional `teamId`, `teamName`, `joinedAt`. Unique on `(organisationId, clerkUserId)`.

### Team Logic

- **Schema:** Teams are represented only as optional fields on `OrganisationMember`: `teamId` and `teamName`. There is **no** separate `Team` table.
- **Usage:** `team_manager` is scoped to a team via `teamId`/`teamName`; `org_admin` has no team restriction. The app uses these for display and routing (e.g. “teams” in joined-experiments and manager UIs); no team CRUD or team-scoped APIs were found.

### Experiment Scoping

- **Experiment model:** `clerkUserId` (owner), optional `organisationId`. Experiments are **always user-owned**; linking to an org is optional.
- **APIs:**  
  - `GET/POST /api/experiments` — Filter/create by `clerkUserId` only; **organisationId is not set or read** in the experiments API.  
  - `GET/PATCH/DELETE /api/experiments/[id]` — Ownership enforced by `clerkUserId` only; no org or membership check.  
  - Check-ins and fields APIs also gate by experiment ownership via `clerkUserId`.
- **UI:** Org-linking page exists (`experiments/[id]/org-linking`) but link/unlink are TODOs (no `/api/experiments/[id]/link` or `unlink`). Creation flow does not set `organisationId` in the API.

---

## 5. Permissions & Access Control

### Middleware

- **Clerk only:** No role or org checks in middleware; only “authenticated vs not” and public-route list.

### Page-Level Guards

- **Super Admin:** `(invisible-admin)/super-admin/layout.tsx` runs `requireSuperAdmin(clerkUserId)`; redirect to `/dashboard` if not super_admin. Page may show “You don’t have access” otherwise for loading/UX.
- **Org portal:** `(org)/layout.tsx` runs `canAccessOrgPortal(clerkUserId)`; redirect to `/dashboard` if no org membership and not super_admin. **Org-scoped:** `(org)/org/[orgId]/layout.tsx` runs `canAccessOrg(clerkUserId, orgId)`; redirect to `/org` if not a member. `(org)/org/[orgId]/admin/layout.tsx` runs `canActAsOrgAdmin(clerkUserId, orgId)`; redirect to `/org/[orgId]` if not org_admin (super_admin allowed). Nav uses `userData` from `GET /api/users/identity`.

### API Permissions

- **Experiments:** All experiment and check-in APIs enforce **ownership by `clerkUserId`** only. No checks for org membership, team_manager, or org_admin; no org-scoped experiment listing.
- **Users/identity:** Returns the current user and their organisation memberships; no admin-only branch.
- **No server-side role checks** were found for manager, org admin, or super_admin in API routes.

### Assumptions in Code

- **Nav and dashboards** assume `userData` (from `/api/users/identity`) is the source of truth for `hasManagerRole`, `isOrgAdmin`, `isSuperAdmin`, `isParticipant`, and per-org role.
- **Routing from joined-experiments** uses `userData.orgs` to choose between manager view (`/manager/orgs/[orgId]`) and participant view (`/joined-experiments/[orgId]`).
- **Super admin** is treated as upgraded and with full access in the users/identity response (`upgradedAt` derived from role).

---

## 6. What Is Explicitly NOT Implemented

- **Organisation CRUD:** No API or real flows to create, update, or delete organisations. No “Create Organization” or “Join Organisation” backend; `/organisations/join` route does not exist.
- **Organisation membership:** No API to add/remove members, invite by link/email, or accept/decline invites (invite accept page has mock data and TODO for decline API).
- **Team entity:** No Team model or team CRUD; only `teamId`/`teamName` on OrganisationMember.
- **Experiment–org linking API:** Schema supports `Experiment.organisationId`; no PATCH or dedicated endpoint to set/clear it. Org-linking page has TODOs for link/unlink API calls.
- **Experiment creation with org:** POST `/api/experiments` does not accept or set `organisationId`.
- **Manager/org data:** Manager dashboard and manager org detail use **mock** orgs, templates, invitations, insights, and members. No API to list orgs the user manages or org-scoped analytics.
- **Organisations list/detail:** Organisations page and `organisations/[orgId]` (and templates/insights) use **mock** data; no API to list user’s orgs or org details.
- **Joined experiments data:** Joined-experiments list and `joined-experiments/[orgId]` use **mock** orgs and assignments; no API for “my orgs” or “assignments” or org-scoped experiments.
- **Pending assignments:** `pendingAssignments` in user context is hardcoded to `0` (TODO: implement assignment tracking).
- **Super Admin backend:** No API or server-side checks for super_admin; no global admin tools beyond the placeholder page.
- **Old manager:** Still in codebase; relationship to current manager and deprecation not documented in this snapshot.

---

## 7. Architectural Decisions (As of Today)

These are stated as **current decisions** reflected or implied by the codebase and docs (e.g. DATABASE_ROLE_STRUCTURE.md, ROLE_LOGIC_EXPLANATION.md). They are **not** implementation tasks.

- **Personal, org, and admin surfaces** are separated in the UI (dashboard vs organisations/manager vs super-admin) but share one protected layout and one auth model; there is no separate “portal” router or host.
- **Roles are not mixed across portals** in the data model: global `User.role` (user \| super_admin) is distinct from per-org `OrganisationMember.role` (member \| team_manager \| org_admin).
- **Orgs do not directly interact with other orgs** in the current design; there is no org-to-org relationship or shared-org concept in schema or APIs.
- **Future org-to-org interaction** is not implemented; any such design (e.g. shared experiments) would be a future extension.
- **Experiments are always user-owned** (`clerkUserId`); optional `organisationId` only links an experiment to an org for aggregation/context, not for ownership transfer.
- **Orgs see aggregated data only** in the intended design (stated in manager/org UI copy and docs); there is no implementation yet for org-scoped aggregate APIs.

---

## 8. Open Questions / Follow-ups

- **Organisations join flow:** Where should “Join Organisation” lead (invite link, code, search)? No route or API exists today.
- **Super admin assignment:** How is `User.role` set to `super_admin`? (e.g. scripts/set-super-admin.sql or manual DB; no in-app flow found.)
- **Account type “organisation”:** How does a user get `accountType === "organisation"`? Webhook and users/identity only create/update with `individual`; no upgrade or admin flow observed for accountType.
- **Manager and org list APIs:** What should the contracts be for “orgs I manage” and “orgs I belong to” and for org-scoped templates/experiments/insights?
- **Assignment model:** How are “pending assignments” and “joined experiments” represented (e.g. invitations, experiment copies, or linking existing experiments to org/team)?
- **Team model:** Is a first-class Team entity planned, or will teamId/teamName on OrganisationMember remain the only representation?
- **Old manager vs manager:** When will old-manager be removed or consolidated, and which URLs should be canonical?

---

*Snapshot generated 2025-02-07. No code changes were made.*
