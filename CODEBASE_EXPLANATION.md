# 📚 Complete Codebase Explanation

## 🎯 Project Overview

**Self-Lab** is a personal reflection and self-discovery application where users create "experiments" to track patterns in their thoughts, emotions, and behaviors over time. Users design custom tracking fields (text, numbers, emojis, yes/no, dropdowns) and log daily "check-ins" with responses.

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

## 🏗️ Architecture Patterns

### 1. **Next.js App Router (Server Components)**
- **Server Components**: Fetch data directly from database using `async/await`
- **Client Components**: Only used for interactivity (forms, state, event handlers)
- **No useEffect for data fetching**: Data is fetched on the server before rendering

### 2. **Route Groups**
- `(auth)` - Authentication routes (sign-in, sign-up)
- `(protected)` - Routes that require authentication

### 3. **Middleware-Based Authentication**
- `src/proxy.ts` - Clerk middleware protects routes automatically
- No manual auth checks in components (middleware handles it)

### 4. **Prisma Singleton Pattern**
- `src/lib/prisma.ts` - Single Prisma instance shared across app
- Prevents multiple database connections in development

---

## 📁 File Structure Explained

```
lumi-self-lab/
├── prisma/
│   ├── schema.prisma          # Database schema (4 models)
│   └── migrations/            # Database migration history
│
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout (ClerkProvider, ThemeProvider)
│   │   ├── page.tsx           # Landing page
│   │   │
│   │   ├── (auth)/            # Route group for auth pages
│   │   │   ├── layout.tsx     # Runtime signal for auth routes
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │
│   │   ├── (protected)/       # Route group for protected pages
│   │   │   ├── layout.tsx     # Navbar wrapper
│   │   │   ├── dashboard/     # Main dashboard (AI chat + experiment form)
│   │   │   ├── experiments/   # List and detail pages
│   │   │   └── page.tsx       # Protected home page
│   │   │
│   │   └── api/               # API Routes (REST endpoints)
│   │       ├── experiments/   # CRUD for experiments
│   │       ├── chat/          # AI chat endpoint
│   │       └── auth/          # Auth-related endpoints
│   │
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components (Button, Card, etc.)
│   │   ├── navbar.tsx         # Navigation bar
│   │   ├── experiments-list.tsx  # Client component for filtering
│   │   ├── MainAIChat/        # AI chat panel
│   │   └── MainExperimentCreation/  # Experiment form builder
│   │
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions (cn for classnames)
│   │
│   └── proxy.ts               # Clerk middleware (route protection)
│
└── package.json               # Dependencies and scripts
```

---

## 🔐 Authentication Flow

### How It Works

1. **Middleware Protection** (`src/proxy.ts`)
   ```typescript
   // Protects all routes except public ones
   const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/", ...]);
   if (!isPublicRoute(req)) {
     await auth.protect(); // Redirects to sign-in if not authenticated
   }
   ```

2. **Public Routes**
   - `/` - Landing page
   - `/sign-in` - Sign in page
   - `/sign-up` - Sign up page
   - `/forgot-password` - Password reset
   - `/reset-password` - New password
   - `/waitlist` - Waitlist page

3. **Protected Routes** (require authentication)
   - `/dashboard` - Main dashboard
   - `/experiments` - Experiments list
   - `/experiments/[id]` - Experiment detail
   - `/api/*` - All API routes

4. **Clerk Integration**
   - `ClerkProvider` in root layout wraps entire app
   - `auth()` from `@clerk/nextjs/server` gets current user in server components
   - `UserButton` in navbar for user menu

---

## 🗄️ Database Schema (Prisma)

### 4 Main Models

#### 1. **Experiment** (Top-level)
```prisma
Experiment {
  id              String   @default(cuid())
  clerkUserId     String   // Links to Clerk user
  title           String
  whyMatters      String?
  hypothesis      String?
  durationDays    Int
  frequency       String   // daily | every-2-days | weekly
  faithEnabled    Boolean
  scriptureNotes  String?
  status          String   // draft | active | completed
  createdAt       DateTime
  updatedAt       DateTime
  startedAt       DateTime?
  completedAt     DateTime?
  
  fields          ExperimentField[]     // One-to-many
  checkIns        ExperimentCheckIn[]   // One-to-many
}
```

#### 2. **ExperimentField** (What user tracks)
```prisma
ExperimentField {
  id            String
  experimentId  String
  label         String
  type          String   // text | number | select | emoji | yesno
  required      Boolean
  order         Int
  
  // Type-specific config
  textType      String?  // short | long (for text type)
  minValue      Int?     // for number type
  maxValue      Int?     // for number type
  emojiCount    Int?     // 3 | 5 | 7 (for emoji type)
  selectOptions String[] // for select type
  
  responses     ExperimentFieldResponse[]
}
```

#### 3. **ExperimentCheckIn** (Daily log entry)
```prisma
ExperimentCheckIn {
  id            String
  experimentId  String
  clerkUserId   String
  checkInDate   DateTime
  notes         String?
  aiSummary     String?
  createdAt     DateTime
  
  responses     ExperimentFieldResponse[]
}
```

#### 4. **ExperimentFieldResponse** (Response to each field)
```prisma
ExperimentFieldResponse {
  id            String
  checkInId     String
  fieldId       String
  
  // Only ONE of these is used (depends on field.type)
  responseText    String?   // for text fields
  responseNumber  Int?      // for number OR emoji (1-based ranking)
  responseBool    Boolean?  // for yes/no
  selectedOption  String?   // for select
  
  aiFeedback      String?
}
```

### Key Design Decisions

1. **Multi-tenancy**: `clerkUserId` in `Experiment` and `ExperimentCheckIn` ensures users only see their data
2. **Cascade deletes**: Deleting an experiment deletes all related fields, check-ins, and responses
3. **Emoji storage**: Emojis stored as `responseNumber` (1-3, 1-5, or 1-7) - more efficient and queryable
4. **Flexible responses**: One response model supports all field types using nullable fields

---

## 🛣️ API Routes Structure

All API routes are in `src/app/api/` following Next.js App Router convention.

### Experiments API (`/api/experiments`)

#### `GET /api/experiments`
- Returns all experiments for current user
- Query params: `?status=active&search=keyword`
- Includes fields and latest check-in

#### `POST /api/experiments`
- Creates new experiment with nested fields
- Body: `{ title, durationDays, frequency, fields: [...] }`
- Returns created experiment

#### `GET /api/experiments/[id]`
- Get single experiment with all fields and check-ins

#### `PATCH /api/experiments/[id]`
- Update experiment
- Supports nested field updates (upsert)

#### `DELETE /api/experiments/[id]`
- Delete experiment (cascade deletes related data)

### Fields API (`/api/experiments/[id]/fields`)

#### `GET /api/experiments/[id]/fields`
- Get all fields for an experiment

#### `POST /api/experiments/[id]/fields`
- Create new field for an experiment

#### `GET/PATCH/DELETE /api/experiments/[id]/fields/[fieldId]`
- CRUD operations for individual fields

### Check-ins API (`/api/experiments/[id]/checkins`)

#### `GET /api/experiments/[id]/checkins`
- Get all check-ins for an experiment
- Query params: `?date=2026-01-15`

#### `POST /api/experiments/[id]/checkins`
- Create new check-in with responses
- Body: `{ checkInDate, notes, responses: [{ fieldId, responseNumber, ... }] }`

#### `GET/PATCH/DELETE /api/experiments/[id]/checkins/[checkInId]`
- CRUD operations for individual check-ins

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

## 🎨 Component Architecture

### Server Components (Data Fetching)

#### `app/(protected)/experiments/page.tsx`
```typescript
export default async function ExperimentsPage() {
  const { userId } = await auth();
  const experiments = await prisma.experiment.findMany({
    where: { clerkUserId: userId }
  });
  // Transform data and pass to client component
  return <ExperimentsList experiments={transformedData} />;
}
```
- ✅ Direct database access with `async/await`
- ✅ No `useEffect` or API calls
- ✅ Data fetched before rendering

### Client Components (Interactivity)

#### `components/experiments-list.tsx`
```typescript
"use client";
export function ExperimentsList({ experiments }: Props) {
  const [filter, setFilter] = useState("all");
  // Filter logic, event handlers
}
```
- ✅ Handles user interactions (filters, clicks)
- ✅ Receives data as props from server component
- ✅ No data fetching

### Layout Components

#### `app/layout.tsx` (Root)
- `ClerkProvider` - Authentication context
- `ThemeProvider` - Dark mode context
- `Suspense` - Loading boundary
- Global fonts and styles

#### `app/(protected)/layout.tsx`
- `Navbar` - Navigation bar with user menu
- Wraps all protected routes

#### `app/(protected)/experiments/layout.tsx`
- `ErrorBoundary` - Error handling
- `Suspense` - Loading states
- `Container` - Layout wrapper

---

## 🔄 Data Flow Examples

### Example 1: Creating an Experiment

```
1. User fills form (Client Component)
   └─> ExperimentCreationDetails.tsx

2. User clicks "Start Experiment"
   └─> handleStartExperiment()
       └─> POST /api/experiments
           └─> API route verifies auth
               └─> Prisma creates experiment + fields
                   └─> Returns experiment ID
                       └─> Router redirects to /experiments/[id]
```

### Example 2: Viewing Experiments List

```
1. User navigates to /experiments
   └─> Server Component (page.tsx) renders
       └─> auth() gets userId
           └─> prisma.experiment.findMany({ clerkUserId })
               └─> Transforms data to UI format
                   └─> Passes to ExperimentsList (client)
                       └─> Renders with filters
```

### Example 3: Daily Check-in

```
1. User views experiment detail
   └─> Server Component fetches experiment + fields + check-ins

2. User fills check-in form
   └─> Client Component collects responses

3. User submits
   └─> POST /api/experiments/[id]/checkins
       └─> Creates check-in + responses (one per field)
           └─> Updates UI or redirects
```

---

## 🎯 Key Patterns Used

### 1. **Server Components for Data**
```typescript
// ✅ GOOD: Server component
export default async function Page() {
  const data = await prisma.model.findMany();
  return <Component data={data} />;
}

// ❌ BAD: Client component with useEffect
"use client";
export default function Page() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  return <Component data={data} />;
}
```

### 2. **Multi-tenancy Pattern**
```typescript
// Always filter by clerkUserId
const { userId } = await auth();
const data = await prisma.model.findMany({
  where: { clerkUserId: userId }
});
```

### 3. **Error Boundaries**
```typescript
<ErrorBoundary fallbackRender={GeneralErrorFallback}>
  <Suspense fallback={<LoadingSkeleton />}>
    {children}
  </Suspense>
</ErrorBoundary>
```

### 4. **Type-Safe Data Transformation**
```typescript
// Database format → UI format
const uiData = dbData.map(item => ({
  id: item.id,
  title: item.title,
  duration: item.durationDays,  // Transform field names
  // ... other transformations
}));
```

---

## 🚀 Key Features

### 1. **Experiment Creation**
- Custom field builder (text, number, select, emoji, yes/no)
- Faith lens (optional scripture notes)
- Template browsing (future)

### 2. **Check-in System**
- Daily logging with custom fields
- Multiple check-ins per experiment
- AI summary generation (future)

### 3. **Dashboard**
- Resizable panels (AI chat + experiment form)
- Real-time chat with AI
- Experiment creation form

### 4. **Experiments List**
- Filter by status (all, active, draft, completed)
- Progress tracking
- Quick navigation to details

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

---

## 🎓 Learning Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

This architecture prioritizes:
- ✅ **Type safety** (TypeScript + Prisma)
- ✅ **Security** (Clerk auth + multi-tenancy)
- ✅ **Performance** (Server components + efficient queries)
- ✅ **Developer experience** (Clear patterns, separation of concerns)
