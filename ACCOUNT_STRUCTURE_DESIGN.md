# Account Structure & Organisation Flow Design

## Account Types

### 1. Individual Account (Default)
**All users start here**

**Capabilities:**
- ✅ Create personal experiments (always available)
- ✅ Join other individual users' experiments (if shared)
- ✅ Join organisation experiments (if invited)
- ✅ Link personal experiments to organisations (opt-in)
- ❌ Cannot create organisation templates
- ❌ Cannot manage organisation experiments

**Navigation:**
- Dashboard (personal experiments)
- Experiments (all user's experiments)
- Templates (browse templates)
- Insights (personal insights)

---

### 2. Organisation Account (Upgraded)
**Users upgrade to this tier**

**Capabilities:**
- ✅ Everything Individual accounts can do
- ✅ Create organisation templates
- ✅ Manage organisation experiments
- ✅ View organisation aggregate insights
- ✅ Invite members to organisation experiments
- ✅ Still have personal experiments (separate)

**Navigation:**
- Dashboard (personal experiments)
- Experiments (all user's experiments)
- Templates (browse templates)
- Insights (personal insights)
- **Manager** (organisation management - only if upgraded)
  - Organisation Dashboard
  - Organisation Templates
  - Organisation Insights

---

## Structure Clarification

### Individual Users
```
User Account
├── Personal Experiments (always)
├── Joined Individual Experiments (optional)
└── Joined Organisation Experiments (optional, if invited)
```

### Organisation Account Users
```
Organisation Account
├── Personal Experiments (always, separate from org)
├── Joined Individual Experiments (optional)
├── Joined Organisation Experiments (optional)
└── Organisation Management (upgraded feature)
    ├── Create Organisation Templates
    ├── Manage Organisation Experiments
    └── View Organisation Insights
```

---

## Key Principles

1. **Personal Always Available**: Both account types always have personal experiments
2. **Organisation is Additive**: Organisation features add to, don't replace, personal features
3. **Upgrade Required**: Organisation management features require upgrade
4. **Seamless Switching**: Users can switch between personal and organisation views easily

---

## Navigation Structure

### Individual Account Navigation:
```
Dashboard → Personal experiments
Experiments → All experiments (personal + joined)
Templates → Browse templates
Insights → Personal insights
```

### Organisation Account Navigation:
```
Dashboard → Personal experiments
Experiments → All experiments (personal + joined + org)
Templates → Browse templates
Insights → Personal insights
Manager → Organisation management (upgraded)
  ├── Organisation Dashboard
  ├── Organisation Templates
  └── Organisation Insights
```

---

## Flow Design

### Individual User Flow:
1. Sign up → Individual account (default)
2. Create personal experiments
3. Optionally join organisation (if invited)
4. Optionally link personal experiments to organisation
5. Can upgrade to Organisation account anytime

### Organisation Account Flow:
1. Individual account → Upgrade to Organisation account
2. Access Manager tab in navigation
3. Create organisation templates
4. Manage organisation experiments
5. Still have personal experiments (separate)

---

## Page Structure

### Individual Account Pages:
- `/dashboard` - Personal experiments
- `/experiments` - All experiments
- `/experiments/new` - Create experiment
- `/templates` - Browse templates
- `/insights` - Personal insights

### Organisation Account Pages (Additional):
- `/manager` - Organisation dashboard (upgrade required)
- `/manager/templates` - Organisation templates
- `/manager/templates/create` - Create organisation template
- `/manager/insights` - Organisation aggregate insights

### Shared Pages:
- `/organisations` - List organisations user belongs to (both account types)
- `/organisations/[orgId]` - Organisation dashboard (member view)
- `/organisations/[orgId]/templates` - Organisation templates (member view)
- `/organisations/[orgId]/insights` - Organisation insights (member view)

---

## Upgrade Flow (Implemented)

### 1-Click Upgrade Implementation:
- **Page:** `/upgrade` - Shows comparison and upgrade button
- **API:** `POST /api/users/upgrade` - Updates accountType to "organisation"
- **Auto-creation:** User records auto-created when needed (via `/api/users/me` or experiment creation)
- **Navigation:** Manager tab appears automatically after upgrade

### When User Upgrades:
1. User navigates to `/upgrade`
2. Clicks "Upgrade Now" button
3. API updates `accountType` to "organisation" and sets `upgradedAt`
4. Manager tab appears in navigation immediately
5. Access to organisation management features (`/manager`)

### Implementation Details:
- **User Hook:** `useUser()` - Fetches user account type
- **Navbar:** Conditional Manager tab based on `accountType`
- **API Endpoints:**
  - `GET /api/users/me` - Returns user with accountType (auto-creates if missing)
  - `POST /api/users/upgrade` - Upgrades account to organisation
- **Experiment API:** Auto-creates User record when creating experiments

### Future: Payment Gateway
- Payment processing will be added before upgrade API call
- Subscription management will be added later
- For now, upgrade is free and immediate

---

## Database Schema Updates Needed

```prisma
model User {
  id              String   @id @default(cuid())
  clerkUserId     String   @unique
  accountType     String   @default("individual") // individual | organisation
  upgradedAt      DateTime?
  
  personalExperiments Experiment[]
  organisationMemberships OrganisationMember[]
  
  @@index([clerkUserId])
}

model Organisation {
  id              String   @id @default(cuid())
  name            String
  description     String?
  createdBy       String   // clerkUserId of creator
  createdAt       DateTime @default(now())
  
  members         OrganisationMember[]
  templates       OrganisationTemplate[]
  experiments     Experiment[] // experiments linked to this org
  
  @@index([createdBy])
}

model OrganisationMember {
  id              String   @id @default(cuid())
  organisationId  String
  organisation    Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  clerkUserId     String
  role            String   @default("member") // member | admin
  joinedAt        DateTime @default(now())
  
  @@unique([organisationId, clerkUserId])
  @@index([clerkUserId])
}

model OrganisationTemplate {
  id              String   @id @default(cuid())
  organisationId  String
  organisation    Organisation @relation(fields: [organisationId], references: [id], onDelete: Cascade)
  title           String
  description     String?
  // ... template fields similar to Experiment
  createdAt       DateTime @default(now())
  
  @@index([organisationId])
}

model Experiment {
  // ... existing fields
  organisationId  String?  // null = personal, set = linked to org
  organisation    Organisation? @relation(fields: [organisationId], references: [id], onDelete: SetNull)
  
  @@index([organisationId])
}
```

---

## UI/UX Considerations

### Manager Tab Visibility:
- Only show if `user.accountType === "organisation"`
- Show upgrade prompt if not upgraded
- Seamless transition when upgraded

### Experiment Creation:
- Always show "Personal" option (default)
- Show "Link to Organisation" if user belongs to organisations
- Show "Create Organisation Template" only if upgraded

### Navigation:
- Manager tab appears after upgrade
- No confusion between personal and organisation features
- Clear separation but easy switching

---

## Migration Path

1. Add `accountType` to user model
2. Add organisation models
3. Update experiment model with `organisationId`
4. Update UI to show/hide features based on account type
5. Add upgrade flow
6. Migrate existing users to "individual" account type

---

This structure provides:
- ✅ Clear separation between personal and organisation
- ✅ Seamless upgrade path
- ✅ Personal experiments always available
- ✅ Organisation features as additive
- ✅ Simple, intuitive navigation
