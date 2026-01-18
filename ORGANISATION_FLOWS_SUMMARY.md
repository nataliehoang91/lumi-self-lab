# Organisation Flows Summary - For UI Design

This document summarizes all organisation-related flows to help design the UI. Keep mock data for now, but understand the complete user journeys.

---

## 🎯 Flow Overview

### Main Flows:
1. **Account Upgrade** - Individual → Organisation Account
2. **Organisation Management** (Manager) - Create orgs, templates, view insights
3. **Organisation Membership** (Member) - Join orgs, use templates, view insights
4. **Template Creation** - Create org templates from Manager
5. **Template Usage** - Create experiment from template (personal or org-linked)
6. **Experiment Linking** - Link personal experiment to organisation
7. **Organisation Insights** - View aggregate data (no personal text)
8. **Invitations** - Invite members to org experiments

---

## 1. Account Upgrade Flow

### User Journey:
```
Individual Account → Click "Upgrade" (Navbar) → /upgrade → Click "Upgrade Now" → Account Upgraded → Manager Tab Appears
```

### Pages:
- **`/upgrade`** - Comparison page (Individual vs Organisation features)
  - Shows current plan (Individual)
  - Shows upgraded plan (Organisation)
  - "Upgrade Now" button → `POST /api/users/upgrade`
  - After upgrade → Redirect to `/manager`

### UI Elements Needed:
- ✅ Feature comparison cards
- ✅ "Upgrade Now" button
- ✅ Loading state during upgrade
- ✅ Success redirect

### Mock Data:
- Account type: `"individual"` → `"organisation"`
- Manager tab visibility changes

---

## 2. Organisation Management (Manager) - Dashboard

### User Journey:
```
Organisation Account → Manager Tab → /manager → View aggregate insights & stats
```

### Pages:
- **`/manager`** - Organisation dashboard (Team Insights tab)
  - **Stats Cards:**
    - Active Participants (count of unique users with org-linked experiments)
    - Active Experiments (count of experiments with `organisationId`)
    - Avg Completion Rate (aggregate from all org experiments)
    - Avg Streak (aggregate from all org experiments)
  - **Charts:**
    - Weekly Check-ins (aggregate from all org experiments)
    - Mood Distribution (from emoji fields, aggregated)
  - **Insights:**
    - AI-generated insights from aggregate data
    - Popular experiments (most participants)
  - **Privacy Notice:** "Privacy protected: aggregate insights only"

- **`/manager/templates`** - Organisation templates list
  - List all templates created by this org
  - Each template shows: title, description, category, usage count
  - "Create Template" button → `/manager/templates/create`
  - "Start from Template" → Creates experiment from template

- **`/manager/templates/create`** - Create organisation template
  - Similar to experiment creation form
  - Fields: title, description, category, duration, frequency
  - Add custom fields (emoji, number, text, yes/no, select)
  - "Save Template" → Creates `OrganisationTemplate` record

### UI Elements Needed:
- ✅ Stats cards (4 metrics)
- ✅ Weekly engagement bar chart
- ✅ Mood distribution chart (from emoji responses)
- ✅ AI insights list
- ✅ Popular experiments list
- ✅ Tab navigation (Team Insights / Templates)
- ✅ Privacy notice banner
- ✅ Time range selector (7d, 14d, 30d, 90d)

### Mock Data:
```typescript
{
  totalParticipants: 47,
  activeExperiments: 23,
  avgCompletionRate: 78,
  avgStreak: 5.2,
  weeklyEngagement: [{ day: "Mon", checkIns: 42 }, ...],
  moodTrends: { veryPositive: 23, positive: 34, neutral: 28, ... },
  topExperiments: [{ name: "Focus & Productivity", participants: 18, ... }],
  insights: [{ type: "positive", text: "..." }, ...]
}
```

---

## 3. Organisation Membership (Member) - Organisation Pages

### User Journey:
```
Any User → /organizations → View orgs user belongs to → Click org → /organizations/[orgId] → View org dashboard
```

### Pages:
- **`/organizations`** - List organisations user belongs to
  - Shows all orgs where user is a member (`OrganisationMember`)
  - Each org card shows: name, description, member count, active experiments
  - "Join Organization" button → Future: join flow
  - Pending invitations section (if any)

- **`/organizations/[orgId]`** - Organisation dashboard (member view)
  - **Stats Cards:**
    - Members (count from `OrganisationMember`)
    - Active Experiments (count of experiments with `organisationId`)
    - Templates (count of `OrganisationTemplate`)
    - Avg Completion Rate (aggregate)
  - **Quick Actions:**
    - Templates → `/organizations/[orgId]/templates`
    - Team Insights → `/organizations/[orgId]/insights`
    - Members → `/organizations/[orgId]/members` (future)
  - **Privacy Notice:** "Privacy protected: aggregate insights only"

- **`/organizations/[orgId]/templates`** - Browse org templates
  - List all templates for this org (`OrganisationTemplate`)
  - Each template card shows: title, description, category, usage count
  - "Start from Template" button → `/experiments/new?template=[id]&org=[id]`
  - This creates a personal experiment (can optionally link to org)

- **`/organizations/[orgId]/insights`** - Org aggregate insights (member view)
  - Similar to `/manager` but read-only
  - Shows aggregate stats (no personal data)
  - Privacy notice prominent

### UI Elements Needed:
- ✅ Organisation cards list
- ✅ Stats cards (4 metrics)
- ✅ Quick action cards (Templates, Insights, Members)
- ✅ Privacy notice banner
- ✅ Template cards with "Start from Template" button

### Mock Data:
```typescript
{
  organizations: [
    { id: "org1", name: "Acme Corp", description: "...", memberCount: 24, activeExperiments: 12 }
  ],
  templates: [
    { id: "t1", title: "Focus & Productivity", description: "...", category: "Productivity", usageCount: 18 }
  ]
}
```

---

## 4. Template Creation Flow (Manager)

### User Journey:
```
Manager Dashboard → "Create Template" → /manager/templates/create → Fill form → Save → Template created → Redirect to /manager/templates
```

### Pages:
- **`/manager/templates/create`** - Create organisation template form
  - **Form Fields:**
    - Title (required)
    - Description (optional)
    - Category (select: Productivity, Collaboration, Wellness, Remote Work, Learning, Custom)
    - Duration (days: 7, 14, 21, 30)
    - Frequency (daily, every-2-days, weekly)
  - **Custom Fields Builder:**
    - Add fields: Emoji Scale, Number Scale, Text Journal, Yes/No, Multiple Choice
    - Each field: label, required toggle, type-specific config
    - Reorder fields (drag & drop or arrows)
    - Delete fields
  - **Actions:**
    - "Save Template" → Creates `OrganisationTemplate` + `OrganisationTemplateField[]`
    - "Cancel" → Back to `/manager/templates`
    - "Preview" → Shows how template will look

### UI Elements Needed:
- ✅ Form inputs (title, description, category, duration, frequency)
- ✅ Field type selector (5 options with icons)
- ✅ Dynamic field builder (add/edit/delete/reorder)
- ✅ Field configuration (label, required, type-specific options)
- ✅ Preview section (optional)
- ✅ Save/Cancel buttons

### Mock Data:
```typescript
{
  template: {
    title: "Focus & Productivity",
    description: "...",
    category: "Productivity",
    durationDays: 14,
    frequency: "daily",
    fields: [
      { type: "emoji", label: "Energy Level", required: true, emojiCount: 5 },
      { type: "number", label: "Focus Score", required: true, minValue: 1, maxValue: 10 },
      { type: "text", label: "Notes", required: false, textType: "long" }
    ]
  }
}
```

---

## 5. Template Usage Flow (Create Experiment from Template)

### User Journey:
```
User → /organizations/[orgId]/templates → Click "Start from Template" → /experiments/new?template=[id]&org=[id] → Pre-filled form → Create Experiment
```

### Pages:
- **`/experiments/new?template=[id]&org=[id]`** - Create experiment from template
  - Pre-filled with template data
  - User can edit all fields before creating
  - **Location Decision:** Already decided (from template's org)
  - **Experiment Creation:**
    - Creates `Experiment` with `organisationId` (if org template)
    - Copies fields from template to `ExperimentField[]`
    - User owns the experiment (personal instance)
    - Can unlink from org later (optional)

### UI Elements Needed:
- ✅ Pre-filled form (editable)
- ✅ Context banner showing "Creating from [Org Name] template"
- ✅ "Unlink from Organisation" toggle (optional)
- ✅ Create/Cancel buttons

### Mock Data:
- Pre-fill from template data
- `organisationId` set from template's org (or user can choose)

---

## 6. Experiment Linking Flow (Link Personal Experiment to Org)

### User Journey:
```
User → /experiments/[id] → Click "Link to Organisation" → Select org → Privacy reminder → Experiment linked → Org badge appears
```

### Pages:
- **`/experiments/[id]`** - Experiment detail page
  - If not linked: Show "Link to Organisation" button/dropdown
  - If linked: Show org badge + "Unlink from Organisation" option
  - Privacy reminder dialog when linking

### UI Elements Needed:
- ✅ "Link to Organisation" button/dropdown
- ✅ Organisation selector (list of orgs user belongs to)
- ✅ Privacy reminder dialog
- ✅ Org badge (when linked)
- ✅ "Unlink" option (when linked)

### Mock Data:
- Experiment has `organisationId: null` → Can link
- Experiment has `organisationId: "org1"` → Already linked, show badge

---

## 7. Organisation Insights Flow

### User Journey:
```
Manager → /manager (Team Insights tab) → View aggregate insights
Member → /organizations/[orgId]/insights → View aggregate insights
```

### Pages:
- **`/manager`** (Team Insights tab) - Manager view
  - Stats, charts, insights (as described in #2)

- **`/organizations/[orgId]/insights`** - Member view (read-only)
  - Same content as manager but read-only
  - No "Create Template" button

### Data Displayed (Aggregate Only):
- ✅ **No personal text** (reflections stay private)
- ✅ **Aggregate numbers** (counts, averages, percentages)
- ✅ **Aggregate emoji trends** (from emoji fields)
- ✅ **Aggregate number trends** (from number fields)
- ✅ **Patterns** (e.g., "Most check-ins happen at 9am")
- ✅ **AI insights** (generated from aggregate data)

### Privacy Rules:
- Individual check-in responses: **Private** (never shown)
- Personal text reflections: **Private** (never shown)
- Only aggregate stats shown: counts, averages, trends

---

## 8. Invitations Flow (Future - Not Yet Implemented)

### User Journey:
```
Manager → Create experiment → Assign to org members → Members receive invitation → /organizations/invites/[inviteId] → Accept → Experiment created
```

### Pages:
- **`/organizations/invites/[inviteId]`** - View invitation
  - Shows invitation details: org name, experiment template, invited by
  - **Actions:**
    - "Accept & Link to Org" → Creates experiment with `organisationId`
    - "Accept as Personal" → Creates experiment without `organisationId`
    - "Decline" → Rejects invitation
  - Privacy reminder about org linking

### UI Elements Needed:
- ✅ Invitation card with details
- ✅ Privacy reminder
- ✅ Action buttons (Accept & Link / Accept as Personal / Decline)

### Mock Data:
```typescript
{
  invitation: {
    id: "inv1",
    orgName: "Acme Corp",
    experimentTitle: "Focus & Deep Work Tracking",
    invitedBy: "John Doe",
    templateId: "t1"
  }
}
```

---

## 📋 Key Data Models (For Understanding)

### OrganisationTemplate:
```typescript
{
  id: string;
  organisationId: string;
  title: string;
  description?: string;
  category?: string;
  durationDays: number;
  frequency: "daily" | "every-2-days" | "weekly";
  fields: OrganisationTemplateField[];
}
```

### Experiment (when linked to org):
```typescript
{
  id: string;
  clerkUserId: string;
  organisationId?: string; // Set when linked to org
  title: string;
  // ... other fields
}
```

### OrganisationMember:
```typescript
{
  id: string;
  organisationId: string;
  clerkUserId: string;
  role: "member" | "admin";
  joinedAt: DateTime;
}
```

---

## 🎨 UI Design Notes

### Privacy-First Design:
- Always show privacy notice on org pages
- Clearly distinguish personal vs. org-linked experiments
- Org badge on linked experiments
- "Privacy protected" banners on insights pages

### Navigation Patterns:
- Manager tab only visible for organisation accounts
- Organisation pages accessible to all members
- Clear separation: Personal vs. Organisation features

### Mock Data Strategy:
- Use realistic mock data for all flows
- Structure mock data to match database schema
- Use consistent IDs across related mock data
- Show different states (empty, loading, error, success)

---

## 🔄 Flow Diagrams (High-Level)

### Template Creation:
```
/manager → "Create Template" → /manager/templates/create → Fill form → Save → /manager/templates
```

### Template Usage:
```
/organizations/[orgId]/templates → "Start from Template" → /experiments/new?template=[id]&org=[id] → Create → /experiments/[id]
```

### Linking Experiment:
```
/experiments/[id] → "Link to Organisation" → Select org → Privacy reminder → Linked → Org badge appears
```

---

## ✅ Current Status

### Implemented (with Mock Data):
- ✅ `/upgrade` - Account upgrade page
- ✅ `/manager` - Manager dashboard (Team Insights tab)
- ✅ `/manager/templates` - Templates list page
- ✅ `/manager/templates/create` - Create template page
- ✅ `/organizations` - Organisations list page
- ✅ `/organizations/[orgId]` - Organisation dashboard (member view)
- ✅ `/organizations/[orgId]/templates` - Browse org templates
- ✅ `/organizations/[orgId]/insights` - Org insights (member view)

### Not Yet Implemented:
- ❌ `/organizations/[orgId]/members` - Member management
- ❌ `/organizations/invites/[inviteId]` - Invitation accept/decline (UI exists but needs backend)
- ❌ Organisation creation API
- ❌ Template creation API
- ❌ Real database integration (all using mock data)

---

This summary should help you design all the organisation-related UI flows! 🎨
