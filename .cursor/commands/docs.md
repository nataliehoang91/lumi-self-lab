# Project docs

Key docs live in **`docs/`**:

- **`docs/APP-ROUTE-STRUCTURE.md`** — Route groups and URLs (auth, individual, org, admin).
- **`docs/API.md`** — API reference (users/identity, experiments, etc.).
- **`docs/architecture-snapshot-2025-02-07.md`** — Snapshot of portals, auth, and what’s implemented.
- **`docs/auth-identity-decision-2025-02-07.md`** — Auth & identity: one sign-in flow, org as context not identity, no org chooser at sign-in, redirect to /dashboard.
- **`docs/phase-1-auth-boundary-2025-02-07.md`** — Portal guards and who can access what.
- **`docs/phase-2-permissions-2025-02-07.md`** — Role and permission model (global vs org-level).
- **`docs/phase-org-admin-routing-2025-02-07.md`** — Org-admin nested under /org/[orgId]/admin/* and layout guards.

When changing auth, routing, or permissions, update the relevant doc and keep this list in sync.
