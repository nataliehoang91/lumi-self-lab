# App route structure

This document describes the current app directory structure and URL mapping.

## Route groups and URLs

| Group                 | Purpose                                                           | Example URLs                                                                                                                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **(auth)**            | Sign-in, sign-up, forgot/reset password                           | `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`                                                                                                                                                                                                            |
| **(public)**          | Landing and waitlist (no auth)                                    | `/`, `/waitlist`                                                                                                                                                                                                                                                         |
| **(individual)**      | Personal portal (dashboard, experiments, templates, etc.)         | `/dashboard`, `/create`, `/experiments`, `/templates`, `/insights`, `/onboarding`, `/upgrade`                                                                                                                                                                            |
| **(org)**             | Org portal (org switcher, org dashboard, member views, org-admin) | `/org`, `/org/[orgId]`, `/org/[orgId]/teams`, `/org/[orgId]/experiments`, `/org/[orgId]/templates`, `/org/[orgId]/insights`, `/org/[orgId]/admin`, `/org/[orgId]/admin/teams`, `/org/[orgId]/admin/experiments`, `/org/[orgId]/admin/members`, `/org/invites/[inviteId]` |
| **(admin)**           | Platform admin (Clerk). Placeholder.                              | `/admin`, `/admin/users`, `/admin/orgs`, `/admin/billing`                                                                                                                                                                                                                |
| **(invisible-admin)** | Internal / root admin (super-admin, no Clerk in layout).          | `/super-admin`, `/super-admin/login`, `/super-admin/system`                                                                                                                                                                                                              |

## Directory layout

```
app/
├── (auth)/
│   ├── layout.tsx
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   ├── forgot-password/page.tsx, sent/page.tsx
│   └── reset-password/page.tsx
│
├── (public)/
│   ├── page.tsx                    # landing: /
│   └── waitlist/[[...waitlist]]/page.tsx   # /waitlist
│
├── (individual)/                   # Personal portal
│   ├── layout.tsx                  # UserProvider + NavigationBar
│   ├── dashboard/page.tsx         # /dashboard
│   ├── create/
│   ├── experiments/
│   ├── templates/
│   ├── insights/
│   ├── onboarding/
│   └── upgrade/
│
├── (org)/                          # Org portal
│   ├── layout.tsx                  # canAccessOrgPortal + UserProvider + Nav
│   ├── org/
│   │   ├── page.tsx                # /org (org switcher)
│   │   └── [orgId]/
│   │       ├── layout.tsx          # canAccessOrg(orgId) guard
│   │       ├── page.tsx            # /org/[orgId] (org dashboard)
│   │       ├── teams/
│   │       ├── experiments/
│   │       ├── templates/
│   │       ├── insights/
│   │       └── admin/              # org_admin (or super_admin) only
│   │           ├── layout.tsx      # canActAsOrgAdmin(orgId) guard
│   │           ├── page.tsx        # /org/[orgId]/admin
│   │           ├── teams/
│   │           ├── experiments/
│   │           └── members/
│   └── invites/[inviteId]/page.tsx   # /org/invites/[inviteId]
│
├── (admin)/                        # Platform admin (Clerk). Placeholder.
│   ├── layout.tsx
│   └── admin/
│       ├── page.tsx                # /admin
│       ├── users/
│       ├── orgs/
│       └── billing/
│
├── (invisible-admin)/              # Internal / super-admin
│   ├── layout.tsx
│   └── super-admin/
│       ├── layout.tsx              # requireSuperAdmin guard
│       ├── page.tsx                # /super-admin
│       ├── login/page.tsx         # /super-admin/login
│       └── system/page.tsx        # /super-admin/system
│
├── api/
├── layout.tsx
└── globals.css
```

## Notes

- **Landing** is `(public)/page.tsx` at `/`. In production it redirects to `/waitlist`.
- **Personal dashboard** is at `/dashboard`; there is no `/` under (individual) to avoid conflicting with (public).
- **Org** entry is `/org` (switcher); org detail is `/org/[orgId]` with sub-routes for teams, experiments, templates, insights. Org-admin (role) lives under `/org/[orgId]/admin/*`; guarded by `canActAsOrgAdmin`. User identity for nav/roles: `GET /api/users/identity`.
- **Admin** and **invisible-admin** use path segments `admin` and `super-admin` so their roots are `/admin` and `/super-admin`.
- Middleware (`proxy.ts`) keeps `/`, `/waitlist`, `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password` public; all other routes require Clerk auth unless excluded.
