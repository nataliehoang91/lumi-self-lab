# Self-Lab New Flow Structure

## 🎯 Self-Lab UI Rules

### 1. Identify Context

Three contexts for experiments and features:

- **Personal** - User's own experiments, completely private
- **Org** - Organisation-wide experiments and templates
- **Team** - Team-specific experiments within an organisation

### 2. Identify Role

Three roles with different permissions:

- **member** - Participate only (read-only access)
- **team_manager** - Manage team experiments (full access to team)
- **org_admin** - Manage organisation & teams (full access to org and all teams)

### 3. Permissions

**Members (participate only):**
- Can participate in experiments (check-ins only)
- Can view templates (read-only)
- Can view aggregate insights (read-only)
- **Cannot** create templates
- **Cannot** manage experiments

**Team Managers (manage team experiments):**
- Everything Members can do
- **Can** manage team experiments (create, edit, delete)
- **Can** view team aggregate insights
- **Cannot** manage organisation settings
- **Cannot** create organisation templates

**Org Admins (manage org & teams):**
- Everything Team Managers can do
- **Can** manage organisation settings
- **Can** create organisation templates
- **Can** manage all teams
- **Can** view organisation-wide aggregate insights

### 4. Experiments

- **Always owned by user** - User creates and owns their experiment instances
- **Scoped by org/team** - Experiments can be linked to organisation or team for aggregate insights
- **Personal always available** - Users always have personal experiments (outside org/team)

### 5. Data Visibility

- **Aggregate only** - Only counts, averages, trends shared
- **No personal text exposed** - Text reflections always private
- **Individual check-ins private** - Never shared, only aggregate patterns

### 6. UI Separation (Never Mix)

**Org Participation UI** (`/organisations/*`):
- Read-only views (browse templates, view insights)
- No create/edit/delete actions
- Member mindset
- Accessible by all users who are members

**Manager Control UI** (`/manager/*`):
- Full access (create templates, manage experiments)
- Admin/Manager mindset (org_admin or team_manager roles)
- Separate from participation UI
- Only accessible by managers/admins

---

## 📋 Implementation Notes

### Current State vs. New Flow

**Current Implementation:**
- Routes use `/organizations` (US spelling)
- Two account types: individual, organisation
- Two modes: Membership (`/organizations/*`), Management (`/manager/*`)
- Roles: member, manager (implied by accountType)

**New Flow Requirements:**
- Routes should use `/organisations` (UK spelling, consistent with Prisma schema)
- Three contexts: Personal, Org, Team
- Three roles: member, team_manager, org_admin
- Experiments always owned by user, scoped by org/team
- UI separation: participation vs. management

### Changes Needed

1. **Naming Consistency:**
   - Change routes from `/organizations` → `/organisations`
   - Update all components to use UK spelling
   - Update documentation

2. **Role System:**
   - Add `team_manager` and `org_admin` roles to database schema
   - Update permission checks
   - Update UI to reflect roles

3. **Team Support:**
   - Add Team model to database schema
   - Add team scoping to experiments
   - Update UI to show team context

4. **UI Separation:**
   - Ensure `/organisations/*` is read-only (member role)
   - Ensure `/manager/*` is full access (team_manager or org_admin roles)
   - Never mix participation and management UI

---

## 🔄 Migration Path

### Phase 1: Naming Consistency
- Change route paths: `/organizations` → `/organisations`
- Update all references in code
- Update documentation

### Phase 2: Role System
- Add roles to database schema
- Update permission checks
- Update UI to show/hide based on roles

### Phase 3: Team Support
- Add Team model
- Update experiment scoping
- Update UI to show team context

### Phase 4: UI Refinement
- Ensure clear separation between participation and management UI
- Update all pages to follow new flow structure

---

**This document outlines the new flow structure. Implementation details will follow.**
