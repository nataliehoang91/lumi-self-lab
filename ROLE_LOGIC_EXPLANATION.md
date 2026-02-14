# Role Logic Explanation

## Simple Concept: 2 Account Types + Nested Per-Org Roles

### 1. Account Type (User Level - Global)

**Only 2 types:**

- `individual` - Default, can't create orgs
- `organisation` - Upgraded, can create orgs **and assign individual members**

**What it controls:**

- Can you create new organisations? (`accountType === "organisation"`)
- Can you assign individual members to orgs? (`accountType === "organisation"`)
- Can you see "Create Organisation" button?

### 2. Role in Organisation (Nested Per-Org - Different for Each Org)

**3 roles per organisation:**

- `member` - Participate only (read-only access)
- `team_manager` - Manage team experiments (can assign participants to team)
- `org_admin` - Full access to org (can assign team managers, manage all teams)

**What it controls:**

- Which UI you see for THAT org (manager view vs participant view)
- What actions you can do in THAT org

**Key Point: Roles are nested - same user, different roles in different orgs!**

---

## Real-World Example

### Example 1: Individual Account with Nested Roles

**Sarah has `accountType = "individual"` (can't create orgs, but can be assigned different roles):**

| Organisation      | Role           | What Sarah Sees              | Route                       |
| ----------------- | -------------- | ---------------------------- | --------------------------- |
| Acme Corp         | `member`       | Participant view (read-only) | `/joined-experiments/org-1` |
| Product Team      | `team_manager` | Manager view (manage team)   | `/manager/orgs/org-2`       |
| Engineering Guild | `org_admin`    | Manager view (full access)   | `/manager/orgs/org-3`       |

**Key Point:** Same individual account, **nested roles** - different roles in different orgs!

### Example 2: Organisation Account (Can Create Orgs)

**Mike has `accountType = "organisation"` (can create orgs and assign individual members):**

| Organisation                  | Role        | What Mike Sees             | Route                       |
| ----------------------------- | ----------- | -------------------------- | --------------------------- |
| StartupCo (created by Mike)   | `org_admin` | Manager view (full access) | `/manager/orgs/org-4`       |
| AnotherOrg (joined as member) | `member`    | Participant view           | `/joined-experiments/org-5` |

**Key Point:** Organisation account can create orgs, but also join other orgs as members!

---

## How to Check Permissions

### ✅ CORRECT: Check role in specific org

```typescript
// Get user's role in a specific org
const userRoleInOrg = userData.orgs.find((org) => org.id === "org-1")?.role || "member";

// Determine UI based on role in THIS org
if (userRoleInOrg === "team_manager" || userRoleInOrg === "org_admin") {
  // Show manager UI for this org
  routeTo = `/manager/orgs/${orgId}`;
} else {
  // Show participant UI for this org
  routeTo = `/joined-experiments/${orgId}`;
}
```

### ❌ WRONG: Check accountType only

```typescript
// DON'T do this - accountType doesn't tell you about roles in orgs
if (userData.accountType === "organisation") {
  // This is wrong! Individual accounts can be managers too!
}
```

---

## Navigation Logic

### Navbar Links

Based on `userData` (global flags):

- `hasManagerRole` - True if team_manager or org_admin in ANY org → Show "Manager" tab
- `isOrgAdmin` - True if can create orgs → Show "Organisations" link
- `isParticipant` - True if has assigned experiments → Show "Joined Experiments"

### Page Routing (When Clicking Org)

Based on role in SPECIFIC org:

```typescript
// Check role in the org being clicked
const userRoleInOrg = userData.orgs.find((o) => o.id === orgId)?.role;

// Route accordingly
if (userRoleInOrg === "team_manager" || userRoleInOrg === "org_admin") {
  window.location = `/manager/orgs/${orgId}`; // Manager view
} else {
  window.location = `/joined-experiments/${orgId}`; // Participant view
}
```

---

## Summary

### Account Types (2 Types)

1. **`individual`** - Default, can't create orgs, but can be assigned different roles in different orgs
2. **`organisation`** - Upgraded, can create orgs and assign individual members

### Roles in Organisation (Nested Per-Org)

1. **`member`** - Participate only (read-only access to org experiments)
2. **`team_manager`** - Manage team experiments (can assign participants to team)
3. **`org_admin`** - Full access (can assign team managers, manage all teams)

### Key Rules

1. **Account Type** = Can you create orgs? (individual = no, organisation = yes)
2. **Role in Org** = What can you do in THIS specific org? (nested per org)
3. **Nested Roles** = Same user, different roles in different orgs!
4. **Check Role** = Always check role in SPECIFIC org, not just accountType
5. **Organisation Account** = Can create orgs AND assign individual members to those orgs
