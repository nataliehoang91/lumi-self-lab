# Experiment Creation Flow Design

## Core Principles (DO NOT BREAK)

1. **User Ownership**: Users always own their experiment instances
2. **No Auto-Creation**: Organizations never auto-create experiments without user consent
3. **Privacy by Default**: Personal experiments are private by default
4. **Aggregate Only**: Organization-linked experiments only expose aggregate, non-text insights
5. **Text Privacy**: Text reflections are private unless explicitly shared

---

## 1️⃣ HIGH-LEVEL FLOW

### Unified Entry Point: `/experiments/new`

All experiment creation flows start from a single entry point to avoid confusion and decision paralysis. The flow is designed to feel like a personal journey, with organization features as optional enhancements.

**Flow Philosophy:**
- Start personal, expand to org (not the reverse)
- Make org features discoverable but not intrusive
- Always show what's private vs. shared
- Never surprise users with visibility changes

---

## 2️⃣ ROUTING STRUCTURE

### Route Tree

```
/app
  /(protected)                    # Protected routes (requires auth)
    /dashboard                    # Personal dashboard (default home)
    /experiments
      /new                        # 🎯 UNIFIED ENTRY POINT
      /[experimentId]             # Experiment detail view
        /check-in                 # Daily check-in (can be accessed from detail)
        /insights                 # Personal insights
    /organizations                # User's org memberships
      /[orgId]                    # Org dashboard (if user is member)
        /templates                # Org experiment templates
        /insights                 # Org aggregate insights (no personal data)
        /members                  # Org members (if user has permission)
    /templates                    # Global/public templates
      /[templateId]               # Template preview & "Start Experiment"
    /onboarding                   # First-time user flow
      /guided                     # AI-guided experiment creation
      /preview                    # Preview experiment design
```

### Route Explanations

#### `/dashboard`
**Why:** Personal home base. Shows user's experiments, recent check-ins, personal insights. Always private.

#### `/experiments/new`
**Why:** Single entry point prevents confusion. User makes ONE decision: personal or org-linked. Then flows to creation method (AI-guided, template, or manual).

#### `/experiments/[experimentId]`
**Why:** Main experiment view. Shows experiment details, check-in history, personal insights. Context-aware: shows org badge if linked, but user still owns it.

#### `/experiments/[experimentId]/check-in`
**Why:** Dedicated check-in page. Can also be accessed via dialog from detail page. Always private to user.

#### `/experiments/[experimentId]/insights`
**Why:** Personal insights view. Shows user's own patterns, trends, reflections. If org-linked, also shows "Contribute to Org Insights" toggle (opt-in).

#### `/organizations`
**Why:** List of orgs user belongs to. Entry point to org features. Shows pending invites.

#### `/organizations/[orgId]`
**Why:** Org dashboard. Shows aggregate stats (no personal data), org templates, team engagement (anonymized). User can browse templates here.

#### `/organizations/[orgId]/templates`
**Why:** Org-specific templates. User can preview and "Start from Template" which creates a personal instance.

#### `/organizations/[orgId]/insights`
**Why:** Org aggregate insights. Shows patterns across all org-linked experiments (no personal text, no individual data). Privacy-first design.

#### `/templates`
**Why:** Global/public templates. Curated templates available to all users. Can be personal or org-created (if org makes public).

#### `/templates/[templateId]`
**Why:** Template preview. User sees template structure, can "Start Experiment" which creates personal instance. Can optionally link to org if user belongs to one.

---

## 3️⃣ ENTRY DECISION POINT

### Location: `/experiments/new`

**Single Question Design:**

```
┌─────────────────────────────────────────┐
│  Where does this experiment live?       │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  🏠 Personal                      │  │
│  │  Just for me, completely private  │  │
│  │  [Recommended]                     │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  🏢 With an organization          │  │
│  │  Share aggregate insights         │  │
│  │  (Your reflections stay private)  │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### UI Copy

**Page Title:** "Create New Experiment"

**Question:** "Where does this experiment live?"

**Option 1 - Personal:**
- **Title:** "Personal"
- **Subtitle:** "Just for me, completely private"
- **Badge:** "Recommended"
- **Description:** "This experiment is yours alone. Your check-ins, reflections, and insights are completely private. You can always link it to an organization later if you change your mind."

**Option 2 - Organization:**
- **Title:** "With an organization"
- **Subtitle:** "Share aggregate insights (Your reflections stay private)"
- **Description:** "Link this experiment to an organization to contribute to team insights. Your personal reflections and text responses remain private. Only aggregate patterns (like average mood scores) are shared."
- **Conditional:** Only shown if `user.organizations.length > 0`

**Fallback (No Orgs):**
If user belongs to no organizations:
- Show only "Personal" option
- Add subtle text: "Join an organization to enable team insights"
- Link to `/organizations` (invite/join flow)

### Decision Logic

```typescript
// Pseudocode
if (selectedOption === 'personal') {
  // Flow to creation method selection
  // No org context
} else if (selectedOption === 'organization') {
  // Show org selector (if multiple orgs)
  // Set experimentContext.orgId
  // Flow to creation method selection
  // Show privacy reminder
}
```

**Privacy Reminder (if org selected):**
```
┌─────────────────────────────────────────┐
│  🔒 Privacy Protected                   │
│                                         │
│  Your organization will see:            │
│  • Aggregate patterns (e.g., "Team     │
│    mood averages 7.2/10")              │
│  • Participation rates                  │
│                                         │
│  Your organization will NOT see:        │
│  • Your personal reflections            │
│  • Your text responses                  │
│  • Your individual check-in data       │
│                                         │
│  [I understand, continue]               │
└─────────────────────────────────────────┘
```

---

## 4️⃣ FLOW DETAILS

### A. Personal Experiment (AI-Guided)

**Route Sequence:**
1. `/experiments/new` → Select "Personal"
2. `/experiments/new?method=guided` → Select "AI-Guided Creation"
3. `/onboarding/guided` → Answer AI questions
4. `/onboarding/preview` → Preview experiment design
5. `/experiments/[experimentId]` → Experiment created, redirect to detail

**User Decision Points:**
- **D1:** Personal vs. Org (at entry)
- **D2:** Creation method (AI-guided, template, or manual)
- **D3:** Review and confirm experiment design
- **D4:** Start experiment immediately or save as draft

**Context State:**
```typescript
experimentContext = {
  source: 'personal',
  orgId: null,
  visibility: 'private',
  creationMethod: 'ai-guided'
}
```

**UI Labels:**
- "Your Experiment" (not "Team Experiment")
- "Personal Insights" (not "Team Insights")
- No org badges or sharing indicators

---

### B. Personal Experiment (From Template)

**Route Sequence:**
1. `/templates/[templateId]` → Browse template
2. `/templates/[templateId]?start=true` → Click "Start Experiment"
3. `/experiments/new?template=[templateId]&source=personal` → Pre-filled form
4. `/experiments/[experimentId]` → Experiment created

**User Decision Points:**
- **D1:** Choose template (personal or org template)
- **D2:** Confirm "Start as Personal" (default)
- **D3:** Customize fields if needed
- **D4:** Start or save as draft

**Context State:**
```typescript
experimentContext = {
  source: 'template',
  templateId: 'xxx',
  orgId: null,
  visibility: 'private'
}
```

**UI Labels:**
- "Start Personal Experiment"
- Template badge shows source (e.g., "From: Productivity Template")

---

### C. Org Template → User Starts Experiment

**Route Sequence:**
1. `/organizations/[orgId]/templates` → Browse org templates
2. `/organizations/[orgId]/templates/[templateId]` → Preview template
3. `/experiments/new?template=[templateId]&org=[orgId]` → Pre-filled, org-linked
4. `/experiments/new?template=[templateId]&org=[orgId]&confirm` → Privacy reminder
5. `/experiments/[experimentId]` → Experiment created, linked to org

**User Decision Points:**
- **D1:** Browse org templates (optional)
- **D2:** Click "Start from Template"
- **D3:** Confirm org linking (with privacy reminder)
- **D4:** Option to "Start as Personal Instead" (always available)
- **D5:** Customize and start

**Context State:**
```typescript
experimentContext = {
  source: 'org-template',
  templateId: 'xxx',
  orgId: 'yyy',
  visibility: 'org-linked',
  canUnlink: true  // User can always unlink
}
```

**UI Labels:**
- "Start from [Org Name] Template"
- Org badge visible
- "Linked to [Org Name]" indicator
- "Make Personal" option always visible

**Privacy Reminder:**
```
┌─────────────────────────────────────────┐
│  Starting from [Org Name] Template     │
│                                         │
│  This experiment will be linked to     │
│  [Org Name] for aggregate insights.   │
│                                         │
│  Your personal data stays private.     │
│                                         │
│  [Start Linked] [Start Personal]       │
└─────────────────────────────────────────┘
```

---

### D. Org Assigns Experiment → User Accepts/Declines

**Route Sequence:**
1. `/organizations/[orgId]` → User sees "New Experiment Invitation"
2. `/organizations/[orgId]/invites/[inviteId]` → View invitation details
3. `/experiments/new?assigned=[inviteId]` → Pre-filled from org assignment
4. `/experiments/[experimentId]` → User accepts, experiment created

**User Decision Points:**
- **D1:** See invitation notification
- **D2:** View invitation details
- **D3:** Accept or Decline
- **D4:** If accept, can still choose "Start as Personal" (opt-out of org link)
- **D5:** Customize experiment before starting

**Context State:**
```typescript
experimentContext = {
  source: 'org-assigned',
  orgId: 'yyy',
  inviteId: 'zzz',
  assignedBy: 'org-admin-id',
  visibility: 'org-linked' // unless user opts out
}
```

**Invitation UI:**
```
┌─────────────────────────────────────────┐
│  📬 New Experiment Invitation         │
│                                         │
│  [Org Name] has invited you to start  │
│  an experiment:                        │
│                                         │
│  "Focus & Deep Work Tracking"          │
│                                         │
│  This is a suggestion, not a           │
│  requirement. You own the experiment   │
│  and can make it personal anytime.    │
│                                         │
│  [View Details] [Dismiss]              │
└─────────────────────────────────────────┘
```

**Accept/Decline Flow:**
```
┌─────────────────────────────────────────┐
│  Experiment Invitation                  │
│                                         │
│  From: [Org Name]                       │
│  Template: Focus & Deep Work            │
│                                         │
│  [Org Name] suggested this experiment  │
│  to help the team understand focus      │
│  patterns. You can:                     │
│                                         │
│  • Accept and link to org              │
│    (share aggregate insights)           │
│                                         │
│  • Accept as personal                  │
│    (keep it private)                    │
│                                         │
│  • Decline                              │
│                                         │
│  [Accept & Link] [Accept Personal]      │
│  [Decline]                              │
└─────────────────────────────────────────┘
```

**Key UX:**
- Never auto-create
- Always show "Personal" option
- Make declining feel safe and normal
- No pressure language

---

### E. User Belongs to Org but Chooses Personal Mode

**Route Sequence:**
1. `/experiments/new` → User selects "Personal" (even though they have orgs)
2. `/experiments/new?method=[method]` → Creation flow (no org context)
3. `/experiments/[experimentId]` → Personal experiment created

**User Decision Points:**
- **D1:** Explicitly choose "Personal" at entry
- **D2:** No org prompts during creation
- **D3:** Option to "Link to Organization Later" (subtle, not pushy)

**Context State:**
```typescript
experimentContext = {
  source: 'personal',
  orgId: null,
  visibility: 'private',
  canLinkLater: true  // User has orgs available
}
```

**UI Labels:**
- "Personal Experiment" (clear)
- Subtle hint: "You can link this to an organization later if you want" (not prominent)

**Link Later Option:**
Shown as subtle action in experiment detail:
```
┌─────────────────────────────────────────┐
│  [Experiment Details]                  │
│                                         │
│  🔗 Link to organization                │
│  Share aggregate insights with your    │
│  team (your data stays private)        │
│                                         │
│  [Not now] [Learn More]                │
└─────────────────────────────────────────┘
```

---

## 5️⃣ DATA CONTEXT HANDLING

### Context Structure

```typescript
// Global app context
interface AppContext {
  currentUser: {
    id: string;
    email: string;
    organizations: Organization[];
  };
  
  activeOrg: Organization | null;  // Currently viewing org context
  
  experimentContext: {
    source: 'personal' | 'org-template' | 'org-assigned';
    orgId: string | null;
    templateId: string | null;
    visibility: 'private' | 'org-linked';
    canUnlink: boolean;
    canLinkLater: boolean;
  };
}
```

### Context Effects on UI

#### Navigation
- **Personal experiments:** Show in `/dashboard`, `/experiments`
- **Org-linked experiments:** Show in both personal AND org dashboards (with different badges)
- **Org templates:** Show in `/organizations/[orgId]/templates`

#### Labels
```typescript
// Dynamic label generation
function getExperimentLabel(experiment, context) {
  if (experiment.orgId && context.experimentContext.visibility === 'org-linked') {
    return `Linked to ${experiment.org.name}`;
  }
  return 'Personal Experiment';
}

function getInsightsLabel(experiment, context) {
  if (experiment.orgId) {
    return 'Personal Insights (contribute to org insights)';
  }
  return 'Personal Insights';
}
```

#### Insights Visibility
- **Personal insights:** Always visible to user
- **Org aggregate insights:** Only if experiment is org-linked AND user opts in
- **Text reflections:** Never visible to org (even if linked)

#### Navigation Items
```typescript
// Conditional navigation
const navItems = [
  { href: '/dashboard', label: 'My Experiments' },
  { href: '/experiments', label: 'All Experiments' },
  ...(user.organizations.length > 0 ? [
    { href: '/organizations', label: 'Organizations' }
  ] : []),
  { href: '/templates', label: 'Templates' }
];
```

---

## 6️⃣ SAFETY & TRUST UX

### Microcopy Examples

#### Explaining Org Visibility

**Title:** "What your organization can see"

**Content:**
```
When you link an experiment to an organization, you're contributing to collective understanding—not exposing your personal journey.

Your organization will see:
• Aggregate patterns (e.g., "Team average focus score: 7.2/10")
• Participation rates (e.g., "12 team members are tracking focus")
• Trend insights (e.g., "Focus scores are 15% higher on Tuesdays")

Your organization will never see:
• Your personal reflections or journal entries
• Your individual check-in responses
• Your text-based answers
• Your name attached to specific data points

Think of it like a weather report: useful patterns emerge, but no one knows if it rained on your specific street.
```

**Tone:** Calm, explanatory, reassuring

---

#### Accepting Assigned Experiment

**Title:** "You're in control"

**Content:**
```
[Org Name] suggested this experiment because they think it might be valuable for the team. But this is your experiment, and you're in complete control.

You can:
• Accept and link it to the organization (share aggregate insights)
• Accept it as personal (keep it completely private)
• Decline the invitation (no hard feelings)

Even if you accept and link it, you can:
• Unlink it anytime
• Make it personal later
• Delete it whenever you want

This is your self-reflection journey. We're just here to support it.
```

**Tone:** Empowering, non-pressuring, supportive

---

#### Viewing Org-Linked Insights

**Title:** "Team insights (your privacy protected)"

**Content:**
```
These insights are built from experiments linked to [Org Name]. They show patterns across the team, not individual journeys.

What you're seeing:
• Aggregate statistics (averages, trends, patterns)
• Anonymized participation data
• Collective insights and recommendations

What you're not seeing:
• Anyone's personal reflections
• Individual check-in data
• Names or identifying information

Your personal experiment data contributes to these insights, but your individual responses remain private.
```

**Tone:** Transparent, reassuring, informative

---

#### Privacy Reminder (Before Linking)

**Title:** "Before you link this experiment"

**Content:**
```
Linking this experiment to [Org Name] means your aggregate data (like average scores) will contribute to team insights.

Your personal reflections and text responses will always remain private—even if linked.

You can unlink this experiment anytime from the experiment settings.

[I understand, link experiment] [Cancel]
```

**Tone:** Clear, concise, non-alarming

---

### Trust Indicators

**Visual Elements:**
- 🔒 Privacy icon next to personal data
- 🏠 Personal badge (vs. 🏢 Org badge)
- Clear separation between "Personal" and "Team" sections
- "Your data" vs. "Team insights" labels

**Language Patterns:**
- "Your experiment" (not "The experiment")
- "You own" (not "You have access to")
- "Contribute to" (not "Share with")
- "Opt in" (not "Enable")
- "Unlink anytime" (always available)

**Avoid:**
- ❌ "Performance tracking"
- ❌ "Team monitoring"
- ❌ "Manager dashboard"
- ❌ "Surveillance"
- ❌ "Required"
- ❌ "Mandatory"

**Use:**
- ✅ "Self-reflection"
- ✅ "Personal insights"
- ✅ "Collective understanding"
- ✅ "Optional"
- ✅ "Your choice"
- ✅ "Support"

---

## 7️⃣ FLOW DIAGRAMS

### Unified Creation Flow

```
                    /experiments/new
                           │
                    ┌──────┴──────┐
                    │            │
            [Personal]    [Organization]
                    │            │
                    │      ┌─────┴─────┐
                    │      │           │
                    │  [Select Org] [Privacy Reminder]
                    │      │           │
                    └──────┴─────┬─────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            [AI-Guided]              [Template] [Manual]
                    │                         │
                    │                  ┌──────┴──────┐
                    │                  │              │
                    │            [Global]      [Org Template]
                    │                  │              │
                    └──────────────────┴──────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            [Preview Design]          [Customize Fields]
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            [Start Now]              [Save as Draft]
                    │                         │
                    └────────────┬────────────┘
                                 │
                    /experiments/[experimentId]
```

### Org Assignment Flow

```
/organizations/[orgId]
         │
         │ User sees invitation
         │
/organizations/[orgId]/invites/[inviteId]
         │
         │ User views details
         │
    ┌────┴────┐
    │         │
[Accept]  [Decline]
    │         │
    │    [Dismissed]
    │
    │
    └───┐
        │
/experiments/new?assigned=[inviteId]
        │
    ┌───┴───┐
    │       │
[Link] [Personal]
    │       │
    │   [No org link]
    │
[Privacy Reminder]
    │
[Confirm]
    │
/experiments/[experimentId]
```

---

## 8️⃣ IMPLEMENTATION NOTES

### Key Components Needed

1. **ExperimentCreationEntry** (`/experiments/new`)
   - Single decision point
   - Personal vs. Org selector
   - Privacy reminders

2. **CreationMethodSelector**
   - AI-guided, Template, Manual
   - Context-aware (shows org templates if org selected)

3. **PrivacyReminderDialog**
   - Reusable component
   - Shows what's visible vs. private
   - Confirmation required

4. **OrgLinkToggle**
   - In experiment detail
   - Link/unlink functionality
   - Always shows "Make Personal" option

5. **InvitationCard**
   - Shows org invitations
   - Accept/Decline actions
   - Non-pressuring design

### State Management

- Use React Context for `experimentContext`
- Persist org selection in URL params during creation
- Clear context after experiment creation
- Store org link preference in experiment model

### URL Patterns

- `/experiments/new?org=[orgId]` - Pre-select org
- `/experiments/new?template=[templateId]` - Pre-select template
- `/experiments/new?assigned=[inviteId]` - From org assignment
- `/experiments/new?method=guided` - Direct to AI-guided

---

## 9️⃣ SUMMARY

**Core Design Principles:**
1. Single entry point (`/experiments/new`) prevents confusion
2. One branching question: "Where does this live?"
3. Personal is default and recommended
4. Org features are optional enhancements
5. Privacy is always clear and controllable

**User Experience:**
- Never feels surveilled
- Always in control
- Clear privacy boundaries
- Non-pressuring language
- Empowering choices

**Scalability:**
- Supports multiple orgs per user
- Template system (global + org)
- Assignment system (invite-based)
- Future: public templates, template marketplace

**Trust:**
- Transparent about visibility
- Always opt-in (never opt-out)
- Easy to unlink/make personal
- Calm, human, reflective tone
