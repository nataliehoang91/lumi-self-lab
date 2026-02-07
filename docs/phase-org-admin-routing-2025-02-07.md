# Phase: Org Admin Routing & Structure — 2025-02-07

This document describes the routing refactor that nests org-admin under the org context and adds layout guards. Read with `docs/architecture-snapshot-2025-02-07.md`, `docs/phase-1-auth-boundary-2025-02-07.md`, and `docs/phase-2-permissions-2025-02-07.md`.

---

## 1. Old route → new route mapping

The app already had a single org portal under `(org)/org/`. There was **no** standalone org-admin portal; manager-style content lived under `/org/[orgId]` as member-facing pages (teams, experiments, templates, insights). This refactor **adds** the admin subtree and guards; it does not remove or rename existing member-facing routes.

| Previous state | Current state |
|----------------|---------------|
| `/org` | `/org` (unchanged) |
| `/org/[orgId]` (no per-org guard) | `/org/[orgId]` — **layout guard:** user must belong to this org (`canAccessOrg`) |
| `/org/[orgId]/teams` | `/org/[orgId]/teams` (unchanged; member view) |
| `/org/[orgId]/experiments` | `/org/[orgId]/experiments` (unchanged; member view) |
| `/org/[orgId]/templates` | `/org/[orgId]/templates` (unchanged; member view) |
| `/org/[orgId]/insights` | `/org/[orgId]/insights` (unchanged; member view) |
| *(no admin under org)* | `/org/[orgId]/admin` — **new** (org-admin hub) |
| *(none)* | `/org/[orgId]/admin/teams` — **new** (placeholder) |
| *(none)* | `/org/[orgId]/admin/experiments` — **new** (placeholder) |
| *(none)* | `/org/[orgId]/admin/members` — **new** (placeholder) |

**Note:** Routes like `/manager/*`, `/organisations/*`, and `/joined-experiments/*` from the Phase 1 doc were already refactored in this codebase to the `(org)/org/*` structure; this phase does not touch those names.

---

## 2. Why org-admin is nested under org

- **Org Admin is a role, not a separate portal.** Access is scoped to a specific org: the user must be `OrganisationMember.role === "org_admin"` for that org (or `super_admin`). Putting admin at `/org/[orgId]/admin/*` makes the org context explicit in the URL and allows a single layout to enforce “user is org_admin for this org.”
- **One org portal.** All org-related routes live under `/org` and `/org/[orgId]`, so there is a single entry point and a clear hierarchy: org list → org dashboard → (member views) or (admin views).
- **Guards are simple.** The `[orgId]` layout ensures the user is a member of the org; the `admin` layout ensures the user is org_admin (or super_admin). No separate “org-admin portal” layout or host is required.

---

## 3. Which layouts enforce which guards

| Layout | Path | Guard | Redirect if denied |
|--------|------|--------|---------------------|
| `(org)/layout.tsx` | All `/org/*` and `/org/invites/*` | Authenticated + `canAccessOrgPortal(userId)` | `/waitlist` (no auth), `/dashboard` (no org access) |
| `(org)/org/[orgId]/layout.tsx` | All `/org/[orgId]/*` | `canAccessOrg(userId, orgId)` | `/waitlist` (no auth), `/org` (not member of this org) |
| `(org)/org/[orgId]/admin/layout.tsx` | All `/org/[orgId]/admin/*` | `canActAsOrgAdmin(userId, orgId)` | `/waitlist` (no auth), `/org/[orgId]` (not org_admin for this org) |

- **Org members** (any role) can access `/org/[orgId]`, `/org/[orgId]/teams`, `/org/[orgId]/experiments`, `/org/[orgId]/templates`, `/org/[orgId]/insights` as long as they belong to that org.
- **Only org_admin (or super_admin)** can access `/org/[orgId]/admin`, `/org/[orgId]/admin/teams`, `/org/[orgId]/admin/experiments`, `/org/[orgId]/admin/members`.
- Super-admin access behaviour is unchanged: `requireSuperAdmin` is used in the super-admin portal; `canActAsOrgAdmin` returns true for super_admin, so they can open any org’s admin section.

---

## 4. What is still mock or deferred

- **Org list and org dashboard:** `/org` and `/org/[orgId]` (and their child pages) still use mock data where applicable; no new APIs or DB usage was added.
- **Admin pages:** `/org/[orgId]/admin`, `admin/teams`, `admin/experiments`, and `admin/members` are placeholders (copy only; “Deferred to a later phase”). No team/experiment/member CRUD or APIs.
- **Navigation:** The org dashboard does not yet link to “Org admin”; users can reach admin via direct URL. Adding a nav link for org_admin users can be done in a later phase.
- **Invites:** `/org/invites/[inviteId]` remains behind the org portal layout only; no change to invite logic or guards.

---

## 5. Files added or changed (this refactor)

| File | Change |
|------|--------|
| `src/app/(org)/org/[orgId]/layout.tsx` | **New.** Server layout: redirect if not authenticated or not member of this org (`canAccessOrg`). |
| `src/app/(org)/org/[orgId]/admin/layout.tsx` | **New.** Server layout: redirect if not authenticated or not org_admin for this org (`canActAsOrgAdmin`). |
| `src/app/(org)/org/[orgId]/admin/page.tsx` | **New.** Org-admin hub with links to teams, experiments, members. |
| `src/app/(org)/org/[orgId]/admin/teams/page.tsx` | **New.** Placeholder: “Manage teams”. |
| `src/app/(org)/org/[orgId]/admin/experiments/page.tsx` | **New.** Placeholder: “Manage experiments”. |
| `src/app/(org)/org/[orgId]/admin/members/page.tsx` | **New.** Placeholder: “Manage members”. |

No existing pages or UI were removed. No API or database behaviour was changed. Org `[orgId]` and `[orgId]/admin` pages are **server components** (async, `await params`); no `"use client"` unless a page needs client interactivity.

---

*Routing refactor completed 2025-02-07. Routing, layouts, and guards only.*
