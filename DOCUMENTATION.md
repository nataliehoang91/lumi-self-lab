# Self-Lab - Complete Documentation

Complete documentation covering flows, pages, routes, codebase structure, and all features.

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Codebase Structure](#codebase-structure)
4. [Route Structure & Pages](#route-structure--pages)
5. [User Flows](#user-flows)
6. [Database Schema](#database-schema)
7. [API Routes](#api-routes)
8. [Components](#components)
9. [Account Types & Organisation System](#account-types--organisation-system)
10. [Design Rules](#design-rules)
11. [Architecture Patterns](#architecture-patterns)

---

## 🎯 Project Overview

**Self-Lab** is a personal reflection and self-discovery application where users create "experiments" to track patterns in their thoughts, emotions, and behaviors over time. Users design custom tracking fields (text, numbers, emojis, yes/no, dropdowns) and log daily "check-ins" with responses.

**Key Features:**
- Personal experiments with custom fields
- Daily check-ins with tracked responses
- Organisation templates and team insights (for upgraded accounts)
- AI chat assistant for self-reflection guidance
- Privacy-first design (personal text always private)

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16.1.1** - React framework with App Router (server components)
- **React 19.2.3** - UI library
- **TypeScript** - Type safety

### Authentication
- **Clerk** - Complete authentication solution (sign-in, sign-up, password reset, waitlist)

### Database & ORM
- **PostgreSQL** - Relational database (via Neon or similar)
- **Prisma 6.0** - Type-safe ORM for database access

### Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library (Radix UI primitives)
- **next-themes** - Dark mode support

### Additional Libraries
- **react-resizable-panels** - Resizable panel layouts (dashboard)
- **react-error-boundary** - Error handling
- **lucide-react** - Icon library
- **sonner** - Toast notifications

---

## 📁 Codebase Structure

```
lumi-self-lab/
├── prisma/
│   ├── schema.prisma          # Database schema (all models)
│   └── migrations/            # Database migration history
│
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout (ClerkProvider, ThemeProvider)
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Tailwind config & theme colors
│   │   │
│   │   ├── (auth)/            # Route group for auth pages
│   │   │   ├── layout.tsx     # Runtime signal for auth routes
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │
│   │   ├── (protected)/       # Route group for protected pages
│   │   │   ├── layout.tsx     # Navbar wrapper
│   │   │   ├── dashboard/     # Main dashboard (AI chat + experiment form)
│   │   │   ├── experiments/   # List, detail, new, check-in pages
│   │   │   ├── templates/     # Global templates
│   │   │   ├── insights/      # Personal insights
│   │   │   ├── organizations/ # Organisation membership pages
│   │   │   ├── manager/       # Organisation management (upgraded only)
│   │   │   ├── upgrade/       # Account upgrade page
│   │   │   └── page.tsx       # Protected home page
│   │   │
│   │   └── api/               # API Routes (REST endpoints)
│   │       ├── auth/          # Auth endpoints
│   │       ├── chat/          # AI chat endpoint
│   │       ├── experiments/   # CRUD for experiments
│   │       └── users/         # User endpoints (me, upgrade)
│   │
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navbar.tsx      # Navigation bar
│   │   ├── MainAIChat/        # AI chat panel
│   │   ├── MainExperimentCreation/  # Experiment form builder
│   │   ├── ExperimentCreation/      # Creation flow components
│   │   └── Templates/                # Template components
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   │
│   ├── hooks/
│   │   └── use-user.ts        # User account type hook
│   │
│   ├── types/                 # TypeScript type definitions
│   │
│   └── proxy.ts               # Clerk middleware (route protection)
│
└── package.json               # Dependencies and scripts
```

---

## 🛣️ Route Structure & Pages

### Public Routes
- `/` - Landing page
- `/sign-in` - Sign in page (Clerk)
- `/sign-up` - Sign up page (Clerk)
- `/forgot-password` - Password reset
- `/reset-password` - New password
- `/waitlist` - Waitlist page

### Protected Routes (Require Authentication)

#### Personal Routes
- `/dashboard` - Main dashboard (AI chat + experiment form)
- `/experiments` - Experiments list (with filters)
- `/experiments/new` - **Unified entry point** for experiment creation
- `/experiments/[id]` - Experiment detail page
- `/experiments/[id]/check-in` - Daily check-in form
- `/experiments/[id]/insights` - Personal insights
- `/templates` - Browse global templates
- `/insights` - Personal insights dashboard

#### Organisation Routes (All Users)
- `/organisations` - List organisations user belongs to (as member)
- `/organisations/[orgId]` - Organisation dashboard (member view, read-only)
- `/organisations/[orgId]/templates` - Browse org templates (read-only)
- `/organisations/[orgId]/insights` - View aggregate insights (read-only)
- `/organisations/invites/[inviteId]` - Accept/decline invitation

#### Organisation Management Routes (Organisation Accounts Only)
- `/manager` - Manager dashboard (full access)
- `/manager/templates` - List organisation templates (full access)
- `/manager/templates/create` - Create organisation template (full access)

#### Account Management
- `/upgrade` - Upgrade to organisation account

### Route Grouping
- `(auth)` - Authentication routes (no navbar)
- `(protected)` - Protected routes (with navbar)

---

## 🔄 User Flows

### 1. Experiment Creation Flow

**Entry Point:** `/experiments/new`

**Decision Point:** "Where does this experiment live?"
- **Personal** (default, recommended)
- **Organisation** (optional, requires org membership)

**Creation Methods:**
1. **AI-Guided** - Answer questions, AI generates experiment
2. **From Template** - Choose template, pre-fill form
3. **Manual** - Build from scratch

**Flow:**
```
/experiments/new
  → Select "Personal" or "Organisation"
  → If Organisation: Privacy reminder dialog
  → Select creation method (AI/Template/Manual)
  → Fill form
  → Preview
  → Create experiment → /experiments/[id]
```

### 2. Daily Check-in Flow

**Entry:** `/experiments/[id]` → Click "Check In"

**Process:**
```
View experiment detail
  → Click "Check In" button
  → Fill check-in form (all custom fields)
  → Submit → POST /api/experiments/[id]/checkins
  → Check-in saved → Redirect to detail page
```

### 3. Account Upgrade Flow

**Entry:** Navbar "Upgrade" button (for individual accounts)

**Flow:**
```
Individual Account
  → Click "Upgrade" in navbar
  → /upgrade page
  → View feature comparison
  → Click "Upgrade Now"
  → POST /api/users/upgrade
  → Account upgraded → Manager tab appears
  → Redirect to /manager
```

### 4. Organisation Management Flow (Manager)

**Entry:** Navbar "Manager" tab (organisation accounts only)

**Template Creation:**
```
/manager
  → Click "Create Template"
  → /manager/templates/create
  → Fill template form
  → Add custom fields
  → Save → Template created
  → Redirect to /manager/templates
```

**View Insights:**
```
/manager
  → Team Insights tab (default)
  → View aggregate stats, charts, AI insights
  → Privacy notice: "Aggregate insights only"
```

### 5. Organisation Membership Flow (Member)

**Entry:** Navbar "Organizations" tab (all users)

**Browse Templates:**
```
/organizations
  → Click organisation
  → /organizations/[orgId]
  → Click "Templates"
  → /organizations/[orgId]/templates
  → Browse templates (read-only)
  → Click "Start from Template"
  → /experiments/new?template=[id]&org=[id]
  → Create personal experiment from template
```

**View Insights:**
```
/organizations/[orgId]
  → Click "Team Insights"
  → /organizations/[orgId]/insights
  → View aggregate insights (read-only)
  → Privacy notice explains data sharing
```

### 6. Experiment Linking Flow

**Entry:** `/experiments/[id]` (experiment detail page)

**Link to Organisation:**
```
View experiment detail
  → Click "Link to Organisation"
  → Select organisation
  → Privacy reminder dialog
  → Confirm → Experiment linked
  → Org badge appears on experiment
```

---

## 🗄️ Database Schema

### Core Models

#### User
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
  createdOrganisations Organisation[]
}
```

#### Experiment
```prisma
model Experiment {
  id              String   @id @default(cuid())
  clerkUserId     String
  user            User?    @relation(...)

  title           String
  whyMatters      String?
  hypothesis      String?

  durationDays    Int
  frequency       String   // daily | every-2-days | weekly

  faithEnabled    Boolean  @default(false)
  scriptureNotes  String?

  status          String   @default("draft") // draft | active | completed

  organisationId  String?
  organisation    Organisation? @relation(...)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  startedAt       DateTime?
  completedAt     DateTime?

  fields          ExperimentField[]
  checkIns        ExperimentCheckIn[]
}
```

#### ExperimentField
```prisma
model ExperimentField {
  id            String   @id @default(cuid())
  experimentId  String
  experiment    Experiment @relation(...)

  label         String
  type          String   // text | number | select | emoji | yesno
  required      Boolean  @default(false)
  order         Int

  // Type-specific config
  textType      String?  // short | long
  minValue      Int?
  maxValue      Int?
  emojiCount    Int?     // 3 | 5 | 7
  selectOptions String[]

  responses     ExperimentFieldResponse[]
}
```

#### ExperimentCheckIn
```prisma
model ExperimentCheckIn {
  id            String   @id @default(cuid())
  experimentId  String
  experiment    Experiment @relation(...)
  clerkUserId   String
  checkInDate   DateTime
  notes         String?
  aiSummary     String?
  createdAt     DateTime @default(now())

  responses     ExperimentFieldResponse[]
}
```

#### ExperimentFieldResponse
```prisma
model ExperimentFieldResponse {
  id            String   @id @default(cuid())
  checkInId     String
  checkIn       ExperimentCheckIn @relation(...)
  fieldId       String
  field         ExperimentField @relation(...)

  // Only ONE of these is used (depends on field.type)
  responseText    String?
  responseNumber  Int?      // for number OR emoji (1-based ranking)
  responseBool    Boolean?
  selectedOption  String?

  aiFeedback      String?
}
```

### Organisation Models

#### Organisation
```prisma
model Organisation {
  id              String   @id @default(cuid())
  name            String
  description     String?
  createdBy       String   // clerkUserId of creator
  creator         User?    @relation(...)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  members         OrganisationMember[]
  templates       OrganisationTemplate[]
  experiments     Experiment[]
}
```

#### OrganisationMember
```prisma
model OrganisationMember {
  id              String   @id @default(cuid())
  organisationId  String
  organisation    Organisation @relation(...)
  clerkUserId     String
  user            User     @relation(...)
  role            String   @default("member") // member | admin
  joinedAt        DateTime @default(now())
}
```

---

## 🔐 Authentication

**Clerk** handles all authentication: sign-in, sign-up, password reset, user management.

### Middleware Protection (`src/proxy.ts`)
```typescript
// Protects all routes except public ones
const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/", ...]);
if (!isPublicRoute(req)) {
  await auth.protect(); // Redirects to sign-in if not authenticated
}
```

### Getting Current User
```typescript
// Server Components/API Routes
const { userId } = await auth();

// Client Components
import { useUser } from "@clerk/nextjs";
const { user } = useUser();
```

---

## 🛣️ API Routes

### Experiments API

#### `GET /api/experiments`
- Returns all experiments for current user
- Query params: `?status=active&search=keyword`
- Includes fields and latest check-in

#### `POST /api/experiments`
- Creates new experiment with nested fields
- Auto-creates User record if missing
- Body: `{ title, durationDays, frequency, fields: [...] }`

#### `GET /api/experiments/[id]`
- Get single experiment with all fields and check-ins

#### `PATCH /api/experiments/[id]`
- Update experiment (supports nested field updates)

#### `DELETE /api/experiments/[id]`
- Delete experiment (cascade deletes related data)

### Check-ins API

#### `POST /api/experiments/[id]/checkins`
- Create new check-in with responses
- Body: `{ checkInDate, notes, responses: [{ fieldId, responseNumber, ... }] }`

### User API

#### `GET /api/users/me`
- Get current user info (accountType, organisations)
- Auto-creates User record if missing (defaults to "individual")

#### `POST /api/users/upgrade`
- Upgrade account to "organisation"
- Updates accountType and upgradedAt

### Security Pattern
```typescript
// Every API route follows this pattern:
const { userId } = await auth();
if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Verify ownership
const experiment = await prisma.experiment.findFirst({
  where: { id, clerkUserId: userId }
});
if (!experiment) return NextResponse.json({ error: "Not found" }, { status: 404 });
```

---

## 🎨 Components

### Key Components

#### Navigation (`src/components/Navigation/`)
- `NavigationBar` - Main navigation with conditional Manager tab (`navigation-bar.tsx`)
- `ManagerTabButton` - Desktop Manager/Upgrade button
- `ManagerTabButtonMobile` - Mobile Manager/Upgrade button

#### Experiment Creation
- `ExperimentCreationDetails` - Main experiment form
- `CustomFieldBuilder` - Build custom tracking fields
- `CreationMethodSelector` - Choose creation method
- `OrgLinkToggle` - Link/unlink experiment to organisation
- `PrivacyReminderDialog` - Privacy reminder for org linking

#### Experiment Detail
- `ExperimentDetail` - Experiment detail view
- `CheckInForm` - Daily check-in form with dynamic fields

#### AI Chat
- `AiChatPanel` - AI chat assistant panel

#### Organisation
- `ManagerTemplatesContent` - Organisation templates list (management)
- `PrivacyReminderDialog` - Privacy notice component

### Component Patterns

#### Server Components (Data Fetching)
```typescript
export default async function Page() {
  const { userId } = await auth();
  const data = await prisma.model.findMany({
    where: { clerkUserId: userId }
  });
  return <ClientComponent data={data} />;
}
```

#### Client Components (Interactivity)
```typescript
"use client";
export function ClientComponent({ data }: Props) {
  const [state, setState] = useState();
  // Handle interactions
}
```

---

## 👥 Self-Lab UI Rules & Organisation System

### Self-Lab UI Rules

#### 1. Identify Context

Three contexts for experiments and features:

- **Personal** - User's own experiments, completely private
- **Org** - Organisation-wide experiments and templates
- **Team** - Team-specific experiments within an organisation

#### 2. Identify Role

Three roles with different permissions:

- **member** - Participate only (read-only access)
- **team_manager** - Manage team experiments (full access to team)
- **org_admin** - Manage organisation & teams (full access to org and all teams)

#### 3. Permissions

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

#### 4. Experiments

- **Always owned by user** - User creates and owns their experiment instances
- **Scoped by org/team** - Experiments can be linked to organisation or team for aggregate insights
- **Personal always available** - Users always have personal experiments (outside org/team)

#### 5. Data Visibility

- **Aggregate only** - Only counts, averages, trends shared
- **No personal text exposed** - Text reflections always private
- **Individual check-ins private** - Never shared, only aggregate patterns

#### 6. UI Separation (Never Mix)

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

### Organisation System

#### Key Concept: Mode Separation

**Route = Mode = Mindset**

- **`/organisations/*`** = **Membership Mode** (read-only)
  - View organisations you belong to as member
  - Browse templates, view insights
  - No create/edit/delete actions
  - Role: member (participate only)

- **`/manager/*`** = **Management Mode** (full access)
  - Manage organisations you created/administer
  - Create templates, manage orgs and teams
  - Full access actions
  - Roles: team_manager or org_admin

#### Design Rules

1. **Route determines mode** - `/organisations/*` = read-only, `/manager/*` = full access
2. **Never mix modes** - No create buttons on `/organisations/*` pages
3. **Default to read-only** - When in doubt, show read-only
4. **Separate UI by route** - One route = one mindset

### Organisation Flows

#### Membership Flow (All Users - member role)
```
/organisations
  → List organisations user belongs to (as member)
  → Click org → /organisations/[orgId]
  → View dashboard (read-only)
  → Browse templates (read-only)
  → View insights (read-only)
  → No create/edit/delete actions
```

#### Management Flow (team_manager or org_admin roles)
```
/manager
  → Manager dashboard (full access)
  → Create templates (org_admin only)
  → Manage team experiments (team_manager or org_admin)
  → View aggregate insights
  → Manage organisation (org_admin only)
```

#### Template Usage Flow
```
/organisations/[orgId]/templates
  → Browse templates (read-only)
  → "Start from Template"
  → /experiments/new?template=[id]&org=[id]
  → Creates personal experiment from template
  → User owns experiment, scoped to org/team
```

---

## 📐 Design Rules

### Organisation Feature Rules

1. **Route = Mode = Mindset**
   - `/organisations/*` → Membership mode (read-only, member role)
   - `/manager/*` → Management mode (full access, team_manager or org_admin roles)

2. **Never Mix Modes**
   - No "Create" buttons on `/organisations/*` pages
   - No "View as member" on `/manager/*` pages
   - Separate UI for participation vs. management

3. **Default to Read-Only**
   - When uncertain, default to read-only
   - Show privacy notices

4. **Separate UI by Route**
   - One route = one mindset
   - No conditional permissions based on user role (route determines access)

### Privacy Rules

- **Personal text reflections**: Always private (never shared)
- **Aggregate data only**: Only counts, averages, trends shared
- **Individual check-ins**: Private (never shown to others)
- **Organisation insights**: Aggregate patterns only, no personal data

---

## 🏗️ Architecture Patterns

### 1. Next.js App Router (Server Components)
- **Server Components**: Fetch data directly from database using `async/await`
- **Client Components**: Only used for interactivity (forms, state, event handlers)
- **No useEffect for data fetching**: Data is fetched on server before rendering

### 2. Prisma Singleton Pattern
```typescript
// src/lib/prisma.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

### 3. Multi-tenancy Pattern
```typescript
// Always filter by clerkUserId
const { userId } = await auth();
const data = await prisma.model.findMany({
  where: { clerkUserId: userId }
});
```

### 4. Error Boundaries
```typescript
<ErrorBoundary fallbackRender={GeneralErrorFallback}>
  <Suspense fallback={<LoadingSkeleton />}>
    {children}
  </Suspense>
</ErrorBoundary>
```

### 5. Type-Safe Data Transformation
```typescript
// Database format → UI format
const uiData = dbData.map(item => ({
  id: item.id,
  title: item.title,
  duration: item.durationDays,  // Transform field names
}));
```

---

## 🎯 Key Features

### Experiment Features
- Custom field builder (text, number, select, emoji, yes/no)
- Daily check-ins with tracked responses
- Status management (draft, active, completed)
- Progress tracking
- Faith lens (optional scripture notes)

### Organisation Features
- Organisation templates (for organisation accounts)
- Aggregate insights (privacy-protected)
- Organisation membership
- Template usage from organisations

### AI Features
- AI chat assistant for self-reflection guidance
- AI-generated experiment suggestions (future)
- AI insights from aggregate data (future)

---

## 🔧 Configuration Files

### `next.config.ts`
- `cacheComponents: false` - Disabled for Clerk compatibility

### `proxy.ts` (Middleware)
- Route protection
- Public route definition

### `prisma/schema.prisma`
- Database schema
- Relations and indexes

### `globals.css`
- Tailwind CSS configuration
- Custom color variables (orange/peach primary, violet secondary)
- Dark mode styles

---

## 📝 Important Notes

1. **No `useEffect` for data**: Server components fetch data with `async/await`
2. **Middleware handles auth**: No manual auth checks needed in components
3. **Prisma singleton**: Reuse single database connection
4. **Multi-tenancy**: All queries filter by `clerkUserId`
5. **Cascade deletes**: Deleting experiment removes all related data
6. **Emoji storage**: Stored as numbers (1-3, 1-5, 1-7) for efficiency
7. **Route-based separation**: Organisation features separated by route (membership vs. management)

---

## 🚀 Development

### Database Migrations
See `MIGRATION_GUIDE.md` for database migration instructions.

### Running the App
```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Lint check
```

---

**This documentation covers the entire codebase, flows, pages, and architecture.**
