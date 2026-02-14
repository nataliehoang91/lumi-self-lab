# Database Role Structure

## Overview

This document explains how roles and permissions are stored in the database to match the 3-scenario permission matrix.

## Database Schema

### User Model

```prisma
model User {
  id              String   @id @default(cuid())
  clerkUserId     String   @unique
  accountType     String   @default("individual") // individual | organisation
  upgradedAt      DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  experiments     Experiment[]
  organisationMemberships OrganisationMember[]
  createdOrganisations Organisation[] // Only populated if accountType = "organisation"
}
```

**Account Types:**

- `individual` - Default for all users
- `organisation` - Upgraded account (can create orgs)

### OrganisationMember Model

```prisma
model OrganisationMember {
  id              String   @id @default(cuid())
  organisationId  String
  organisation    Organisation @relation(...)
  clerkUserId     String
  user            User     @relation(...)
  role            String   @default("member") // member | team_manager | org_admin
  teamId          String?  // Optional: for team_manager, specifies which team
  teamName        String?  // Optional: denormalized team name
  joinedAt        DateTime @default(now())

  @@unique([organisationId, clerkUserId])
}
```

**Roles in Organisation:**

- `member` - Participate only, can join assigned experiments
- `team_manager` - Can manage team experiments, assign participants (team only)
- `org_admin` - Full access, can create org, assign team managers

## Permission Matrix Implementation

### 1. Individual Account

```typescript
// User record
{
  accountType: "individual",
  // No OrganisationMember records
}

// Permissions:
- personalExperiment: true (can create personal experiments)
- joinAssigned: true (can join if assigned, shows "Joined Experiments" if isParticipant)
- createTeamExperiment: false
- assignParticipants: false
- viewAggregateResult: false
- createOrg: false
- assignTeamManagers: false
```

### 2. Team Manager

```typescript
// User record
{
  accountType: "individual", // Still individual account
}

// OrganisationMember record
{
  organisationId: "org-1",
  clerkUserId: "user_123",
  role: "team_manager",
  teamId: "team-1",
  teamName: "Engineering",
}

// Permissions (derived from role):
- personalExperiment: true
- joinAssigned: true
- createTeamExperiment: true (team_manager role)
- assignParticipants: "team only" (restricted to teamId)
- viewAggregateResult: "team" (restricted to teamId)
- createOrg: false (accountType = "individual")
- assignTeamManagers: false (not org_admin)
```

### 3. Org Admin

```typescript
// User record
{
  accountType: "organisation", // Upgraded account
}

// OrganisationMember record
{
  organisationId: "org-1",
  clerkUserId: "user_456",
  role: "org_admin",
  // teamId: null (manages all teams)
}

// Permissions (derived from role + accountType):
- personalExperiment: true
- joinAssigned: true
- createTeamExperiment: true (org_admin role)
- assignParticipants: "any team" (org_admin can assign to any team)
- viewAggregateResult: "org-wide" (org_admin sees all)
- createOrg: true (accountType = "organisation")
- assignTeamManagers: true (org_admin can change OrganisationMember.role)
```

## Permission Checks (Code Logic)

### Check if user can create org:

```typescript
const canCreateOrg = user.accountType === "organisation";
```

### Check if user can manage team experiments:

```typescript
const membership = await prisma.organisationMember.findFirst({
  where: {
    clerkUserId: userId,
    organisationId: orgId,
    role: { in: ["team_manager", "org_admin"] },
  },
});
const canManageTeam = !!membership;
```

### Check if user can assign team managers:

```typescript
const canAssignTeamManagers = membership?.role === "org_admin";
```

### Check if user can assign participants:

```typescript
const canAssign = membership?.role === "team_manager" || membership?.role === "org_admin";
const isRestrictedToTeam = membership?.role === "team_manager";
// If isRestrictedToTeam, can only assign to membership.teamId
```

### Check if user is participant:

```typescript
// A user is a "participant" if they have assigned experiments
// This is a state, not a role - check if user has experiments with organisationId set
const isParticipant =
  (await prisma.experiment.count({
    where: {
      clerkUserId: userId,
      organisationId: { not: null },
    },
  })) > 0;
```

## Example Data Structure

### Individual (No Org)

```sql
-- User
INSERT INTO "User" (id, "clerkUserId", "accountType")
VALUES ('user_1', 'clerk_individual_1', 'individual');

-- No OrganisationMember records
```

### Team Manager

```sql
-- User
INSERT INTO "User" (id, "clerkUserId", "accountType")
VALUES ('user_2', 'clerk_manager_1', 'individual');

-- OrganisationMember
INSERT INTO "OrganisationMember" (id, "organisationId", "clerkUserId", role, "teamId", "teamName")
VALUES ('member_1', 'org_1', 'clerk_manager_1', 'team_manager', 'team_eng', 'Engineering');
```

### Org Admin

```sql
-- User
INSERT INTO "User" (id, "clerkUserId", "accountType", "upgradedAt")
VALUES ('user_3', 'clerk_admin_1', 'organisation', NOW());

-- OrganisationMember
INSERT INTO "OrganisationMember" (id, "organisationId", "clerkUserId", role)
VALUES ('member_2', 'org_1', 'clerk_admin_1', 'org_admin');

-- Organisation (created by this user)
INSERT INTO "Organisation" (id, name, "createdBy")
VALUES ('org_1', 'Acme Corp', 'clerk_admin_1');
```

## Summary

- **Account Type** (`User.accountType`): Determines if user can create orgs
- **Role** (`OrganisationMember.role`): Determines permissions within an org (member, team_manager, org_admin)
- **Team Scope** (`OrganisationMember.teamId`): Restricts team_manager to specific team
- **Participant State**: Derived from having experiments linked to orgs (not a role)
