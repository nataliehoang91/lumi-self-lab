# Components & Pages Created

This document lists all the components and pages created for the experiment creation flow.

## Pages Created

### 1. `/app/(protected)/experiments/new/page.tsx`
**Purpose:** Main entry point for experiment creation
**Features:**
- Single decision point: "Where does this experiment live?"
- Personal vs. Organization selection
- Handles template and assignment parameters from URL
- Routes to method selector or privacy reminder

**URL Parameters:**
- `?template=[templateId]` - Pre-select template
- `?org=[orgId]` - Pre-select organization
- `?assigned=[inviteId]` - From org assignment

---

### 2. `/app/(protected)/organizations/page.tsx`
**Purpose:** List user's organizations and pending invitations
**Features:**
- Shows all organizations user belongs to
- Displays pending experiment invitations
- Links to join new organizations
- Empty state when no orgs

---

### 3. `/app/(protected)/organizations/[orgId]/page.tsx`
**Purpose:** Organization dashboard
**Features:**
- Stats overview (members, experiments, templates, completion rate)
- Quick actions (Templates, Insights, Members)
- Privacy notice
- Links to org-specific pages

---

### 4. `/app/(protected)/organizations/[orgId]/templates/page.tsx`
**Purpose:** Browse organization templates
**Features:**
- Lists all templates for the organization
- Template cards with details
- "Start from Template" button
- Links to experiment creation with template pre-selected

---

### 5. `/app/(protected)/organizations/[orgId]/insights/page.tsx`
**Purpose:** View aggregate organization insights
**Features:**
- Privacy notice explaining what's visible
- Stats (participants, experiments, completion rate)
- Key insights list
- Weekly engagement chart
- No personal data shown

---

### 6. `/app/(protected)/organizations/invites/[inviteId]/page.tsx`
**Purpose:** View and respond to experiment invitation
**Features:**
- Shows invitation details
- Accept & Link option (with privacy reminder)
- Accept as Personal option
- Decline option
- Privacy explanation

---

## Components Created

### 1. `PrivacyReminderDialog.tsx`
**Location:** `/components/ExperimentCreation/PrivacyReminderDialog.tsx`
**Purpose:** Reusable privacy reminder dialog
**Features:**
- Shows what orgs can see vs. cannot see
- Organization selector (if multiple orgs)
- Confirmation required before proceeding
- Used before linking experiments to orgs

**Props:**
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  organizations: Organization[];
  selectedOrgId: string | null;
  onOrgSelect: (orgId: string) => void;
}
```

---

### 2. `CreationMethodSelector.tsx`
**Location:** `/components/ExperimentCreation/CreationMethodSelector.tsx`
**Purpose:** Select creation method (AI-guided, Template, Manual)
**Features:**
- Three method options
- Back button
- Handles template/assignment pre-selection
- Routes to appropriate creation flow

**Props:**
```typescript
{
  onSelect: (method: "ai-guided" | "template" | "manual") => void;
  onBack: () => void;
  orgId?: string | null;
  templateId?: string | null;
  assignedInviteId?: string | null;
}
```

---

### 3. `OrgLinkToggle.tsx`
**Location:** `/components/ExperimentCreation/OrgLinkToggle.tsx`
**Purpose:** Link/unlink experiment to/from organization
**Features:**
- Shows current link status
- "Link to Organization" button (if not linked)
- "Make Personal" button (if linked)
- Privacy reminder before linking
- Unlink confirmation

**Props:**
```typescript
{
  experimentId: string;
  isLinked: boolean;
  linkedOrgId: string | null;
  organizations: Organization[];
  onLink: (orgId: string) => void;
  onUnlink: () => void;
}
```

---

## Flow Summary

### Personal Experiment Creation
```
/experiments/new
  → Select "Personal"
  → CreationMethodSelector
    → AI-Guided → /onboarding/guided
    → Template → /templates
    → Manual → /dashboard (form builder)
```

### Organization-Linked Creation
```
/experiments/new
  → Select "Organization"
  → PrivacyReminderDialog
  → CreationMethodSelector
    → (same as above, but with org context)
```

### From Template
```
/templates/[templateId] or /organizations/[orgId]/templates/[templateId]
  → Click "Start Experiment"
  → /experiments/new?template=[id]&org=[id]
  → (pre-filled form)
```

### From Assignment
```
/organizations/[orgId]/invites/[inviteId]
  → Accept & Link or Accept as Personal
  → /experiments/new?assigned=[id]&template=[id]
  → (pre-filled form)
```

---

## Integration Points

### To Integrate with Existing Pages:

1. **Experiment Detail Page** (`/experiments/[id]/page.tsx`)
   - Add `OrgLinkToggle` component
   - Show org badge if linked
   - Add "View Org Insights" link if linked

2. **Experiments List** (`/experiments/page.tsx`)
   - Show org badge on linked experiments
   - Filter by org (optional)

3. **Dashboard** (`/dashboard/page.tsx`)
   - Show org-linked experiments
   - Add "Organizations" quick link

4. **Templates Page** (`/templates/page.tsx`)
   - Support org templates
   - Show template source (global vs. org)

---

## Mock Data Notes

All pages currently use mock data. Replace with real API calls:

- `userOrganizations` - Fetch from `/api/organizations`
- `getOrgData(orgId)` - Fetch from `/api/organizations/[orgId]`
- `getOrgTemplates(orgId)` - Fetch from `/api/organizations/[orgId]/templates`
- `getOrgInsights(orgId)` - Fetch from `/api/organizations/[orgId]/insights`
- `getInvitation(inviteId)` - Fetch from `/api/invitations/[inviteId]`

---

## Next Steps

1. **Backend API Endpoints Needed:**
   - `GET /api/organizations` - List user's orgs
   - `GET /api/organizations/[orgId]` - Get org details
   - `GET /api/organizations/[orgId]/templates` - Get org templates
   - `GET /api/organizations/[orgId]/insights` - Get org insights
   - `GET /api/invitations/[inviteId]` - Get invitation
   - `POST /api/invitations/[inviteId]/accept` - Accept invitation
   - `POST /api/invitations/[inviteId]/decline` - Decline invitation
   - `PATCH /api/experiments/[id]/link` - Link experiment to org
   - `PATCH /api/experiments/[id]/unlink` - Unlink experiment from org

2. **Database Schema Updates:**
   - Add `organizationId` to `Experiment` model (optional)
   - Create `Organization` model
   - Create `OrganizationMember` model
   - Create `ExperimentInvitation` model
   - Create `ExperimentTemplate` model (or extend existing)

3. **Context Management:**
   - Create React Context for experiment creation state
   - Persist org selection during creation flow
   - Handle URL parameter state

4. **Styling:**
   - Update components to match your design system
   - Add animations/transitions
   - Polish UI/UX

---

## File Structure

```
src/
  app/
    (protected)/
      experiments/
        new/
          page.tsx                    # ✅ Created
      organizations/
        page.tsx                      # ✅ Created
        [orgId]/
          page.tsx                    # ✅ Created
          templates/
            page.tsx                  # ✅ Created
          insights/
            page.tsx                  # ✅ Created
        invites/
          [inviteId]/
            page.tsx                  # ✅ Created
  components/
    ExperimentCreation/
      PrivacyReminderDialog.tsx      # ✅ Created
      CreationMethodSelector.tsx      # ✅ Created
      OrgLinkToggle.tsx               # ✅ Created
```

---

## Testing Checklist

- [ ] Navigate to `/experiments/new` - shows location selector
- [ ] Select "Personal" - goes to method selector
- [ ] Select "Organization" - shows privacy reminder
- [ ] Complete privacy reminder - goes to method selector
- [ ] Browse organizations - shows org list
- [ ] View org dashboard - shows stats
- [ ] Browse org templates - shows templates
- [ ] Start from template - pre-fills form
- [ ] View invitation - shows details
- [ ] Accept invitation - creates experiment
- [ ] Link experiment to org - shows privacy reminder
- [ ] Unlink experiment - confirms and unlinks

---

All components are functional and ready for styling and backend integration!
