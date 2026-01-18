# Role Structure Analysis

## Your Requirements

### 1. Individual Account
- ✅ Can create personal experiments
- ✅ Can join experiments if assigned (shows "Joined Experiments" in navbar)
- ❌ Cannot create orgs
- ❌ Cannot manage team experiments

### 2. Individual Account (Team Manager)
- ✅ Can create personal experiments
- ✅ Can manage team experiments (if assigned by org admin)
- ✅ Can create experiments for team
- ✅ Can manage results
- ✅ Can send assignments to others
- ❌ Cannot create orgs
- ❌ Cannot authorize other team managers

### 3. Org Account-Admin
- ✅ Can create orgs (1 for now, multiple in future)
- ✅ Has same access as team manager
- ✅ Can authorize people to manage team experiments
- ✅ Can manage org settings
- ✅ Can create org templates

## Analysis: Do You Need 4 Scenarios?

### Option A: 3 Scenarios (Simpler)

1. **Individual** - Personal experiments only, can join if assigned
2. **Team Manager** - Individual account with team management rights (assigned by org admin)
3. **Org Admin** - Can create orgs, authorize team managers, full access

**Pros:**
- Simpler mental model
- Clear hierarchy: Individual → Team Manager → Org Admin
- Less complexity in UI

**Cons:**
- "Individual" who gets assigned experiments vs. "Individual" who doesn't - same role, different state
- Need to check `isParticipant` flag to show "Joined Experiments" link

### Option B: 4 Scenarios (More Explicit)

1. **Individual** - Personal experiments only, no org involvement
2. **Member** - In org(s), can participate, can be assigned experiments, but no management
3. **Team Manager** - Individual account with team management rights (assigned by org admin)
4. **Org Admin** - Can create orgs, authorize team managers, full access

**Pros:**
- More explicit distinction between "no org" vs "in org as member"
- Clearer permission model
- Easier to understand who can do what

**Cons:**
- More scenarios to maintain
- "Individual" and "Member" are similar (both can't manage, both can participate)

## Recommendation: **3 Scenarios** ✅

### Why 3 is Better:

1. **Account Type vs. Role Distinction:**
   - **Account Type**: Individual (default) vs. Org Account (upgraded)
   - **Role in Org**: member, team_manager, org_admin

2. **Simpler Logic:**
   ```
   Individual Account:
     - Can have personal experiments
     - Can join experiments if assigned (isParticipant = true)
     - Can become team_manager if authorized by org admin
     - Cannot create orgs
   
   Org Account:
     - Everything Individual can do
     - Can create orgs
     - Can authorize team managers
     - Always org_admin in their orgs
   ```

3. **State Flags Instead of Separate Scenarios:**
   - `isParticipant` - has assigned experiments → show "Joined Experiments"
   - `hasManagerRole` - is team_manager or org_admin → show "Manager" tab
   - `isOrgAdmin` - can create orgs → show "Organisations" (management view)

## Proposed Structure

### Scenario 1: Individual (No Org Involvement)
```typescript
{
  accountType: "individual",
  hasManagerRole: false,
  isOrgAdmin: false,
  isParticipant: false,
  orgs: [],
  // Navbar: Dashboard, Experiments, Upgrade
}
```

### Scenario 2: Individual (Team Manager)
```typescript
{
  accountType: "individual",
  hasManagerRole: true,  // team_manager role
  isOrgAdmin: false,
  isParticipant: true,    // might have assigned experiments too
  orgs: [
    { id: "org-1", name: "Acme Corp", role: "team_manager" }
  ],
  teams: [
    { id: "team-1", name: "Engineering", orgId: "org-1" }
  ],
  // Navbar: Dashboard, Experiments, Joined Experiments, Manager
}
```

### Scenario 3: Org Admin
```typescript
{
  accountType: "organisation",
  hasManagerRole: true,  // org_admin role
  isOrgAdmin: true,
  isParticipant: false,  // usually doesn't participate, manages
  orgs: [
    { id: "org-1", name: "Acme Corp", role: "org_admin" }
  ],
  // Navbar: Dashboard, Experiments, Organisations, Manager
}
```

### Scenario 4: Individual (Member/Participant) - Optional
```typescript
{
  accountType: "individual",
  hasManagerRole: false,
  isOrgAdmin: false,
  isParticipant: true,  // has assigned experiments
  orgs: [
    { id: "org-1", name: "Acme Corp", role: "member" }
  ],
  // Navbar: Dashboard, Experiments, Joined Experiments
}
```

## My Recommendation

**Use 3 scenarios** and handle "participant" as a state flag:

1. **Individual** - base case
2. **Team Manager** - individual with management rights
3. **Org Admin** - can create orgs

The `isParticipant` flag handles the "joined experiments" case for both Individual and Team Manager scenarios.

This keeps it simple while covering all your use cases!
