# 📋 Check-In Feature Implementation Plan

## Current State

### What Exists ✅
- API endpoints for check-ins (`POST /api/experiments/[id]/checkins`)
- Database schema with check-in and field response models
- Mock UI in `ExperimentDetailClient.tsx` (not connected to database)

### What's Missing ❌
- Server component to fetch experiment data
- Check-in form that collects responses for each field type
- Display of check-in history with responses
- Integration between UI and API

---

## Feature Requirements

### 1. Experiment Detail Page
- Fetch experiment from database (server component)
- Display experiment information (title, hypothesis, why matters, etc.)
- Show progress (days completed / total days)
- Show experiment fields

### 2. Check-In Form
- Collect responses for each field in the experiment
- Support all field types:
  - **Text**: Short or long text input
  - **Number**: Slider or number input (min-max range)
  - **Emoji**: Buttons with emoji selection (3, 5, or 7 options)
  - **Select**: Dropdown with options
  - **Yes/No**: Radio buttons or toggle
- Optional notes field
- Date selection (defaults to today)
- Validation (required fields must be filled)
- Submit to API

### 3. Check-In History
- Display all past check-ins
- Show responses for each field
- Display date and notes
- Edit/delete check-ins (future)

---

## Implementation Plan

### Phase 1: Server Component (Fetch Data)

**File:** `src/app/(protected)/experiments/[id]/page.tsx`

```typescript
// Convert to server component
export default async function ExperimentDetailPage({ params }) {
  const { userId } = await auth();
  const { id } = await params;
  
  const experiment = await prisma.experiment.findFirst({
    where: { id, clerkUserId: userId },
    include: {
      fields: { orderBy: { order: "asc" } },
      checkIns: {
        include: { responses: { include: { field: true } } },
        orderBy: { checkInDate: "desc" }
      }
    }
  });
  
  return <ExperimentDetailClient experiment={experiment} />;
}
```

### Phase 2: Check-In Form Component

**File:** `src/components/CheckInForm.tsx`

**Features:**
- Dynamic form based on experiment fields
- Render appropriate input for each field type
- Collect all responses
- Submit to API
- Handle success/error states

**Field Rendering Logic:**
```typescript
// Text field
{field.type === "text" && (
  field.textType === "long" 
    ? <Textarea />
    : <Input />
)}

// Number field
{field.type === "number" && (
  <Slider min={field.minValue} max={field.maxValue} />
)}

// Emoji field
{field.type === "emoji" && (
  <EmojiSelector count={field.emojiCount} />
)}

// Select field
{field.type === "select" && (
  <Select options={field.selectOptions} />
)}

// Yes/No field
{field.type === "yesno" && (
  <RadioGroup>Yes / No</RadioGroup>
)}
```

### Phase 3: Display Check-In History

**Show past check-ins with:**
- Date and day number
- All field responses (formatted based on field type)
- Notes
- Visual timeline

### Phase 4: Integration & Polish

- Handle duplicate check-ins (prevent same date)
- Loading states
- Error handling
- Success feedback
- Redirect after check-in

---

## Component Structure

```
src/app/(protected)/experiments/[id]/
├── page.tsx                    # Server component (fetch data)
├── ExperimentDetailClient.tsx  # Client component (UI)
└── CheckInForm.tsx            # Check-in form component

src/components/
└── CheckInForm/               # Check-in form components
    ├── CheckInForm.tsx       # Main form
    ├── FieldResponseInput.tsx # Input for each field type
    └── CheckInHistory.tsx    # Display past check-ins
```

---

## Data Flow

```
1. User navigates to /experiments/[id]
   ↓
2. Server component fetches experiment + fields + check-ins
   ↓
3. ExperimentDetailClient renders:
   - Experiment info
   - Check-in form (if active)
   - Check-in history
   ↓
4. User fills check-in form
   ↓
5. Submit → POST /api/experiments/[id]/checkins
   ↓
6. API creates check-in + responses
   ↓
7. Refresh data or update UI
```

---

## UI/UX Flow

### Check-In Form Layout

```
┌─────────────────────────────────────────────┐
│  Add Today's Check-in                       │
│                                              │
│  Date: [Today] [Change]                     │
│                                              │
│  ─────────────────────────────────────────  │
│                                              │
│  Field 1: Energy Level                      │
│  Required *                                 │
│  😔  😐  😊                                │
│                                              │
│  Field 2: Mood Description                  │
│  [Text area...]                            │
│                                              │
│  Field 3: Hours of Sleep                    │
│  6  [────●────]  10                        │
│                                              │
│  Field 4: Did you exercise?                 │
│  ○ Yes  ○ No                               │
│                                              │
│  ─────────────────────────────────────────  │
│                                              │
│  Additional Notes (Optional)                │
│  [Text area...]                            │
│                                              │
│  [Cancel]  [Save Check-in]                 │
└─────────────────────────────────────────────┘
```

---

## Next Steps

1. ✅ Create plan (this document)
2. ⏳ Build server component for fetching experiment
3. ⏳ Build check-in form with all field types
4. ⏳ Build check-in history display
5. ⏳ Connect to API
6. ⏳ Test end-to-end flow
