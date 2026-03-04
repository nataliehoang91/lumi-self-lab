# Types Directory Structure

This directory contains all TypeScript types for the application, organized by concern.

## 📁 File Organization

```
src/types/
├── index.ts              # Central export point (import from here)
├── database.ts           # Prisma-generated types & relations
├── experiments.ts        # Domain types (UI, API requests/responses)
└── README.md            # This file
```

## 📚 Usage

### Import Types

```typescript
// ✅ GOOD: Import from central index
import type { Experiment, UIExperiment, CreateExperimentRequest } from "@/types";

// ❌ BAD: Import from individual files (works, but not preferred)
import type { Experiment } from "@/types/database";
import type { UIExperiment } from "@/types/experiments";
```

## 📋 Type Categories

### 1. Database Types (`database.ts`)

Types directly from Prisma schema. These match your database structure.

```typescript
import type { Experiment, ExperimentWithRelations } from "@/types";

// Use these when:
// - Working with Prisma queries
// - Database operations
// - API routes that return raw Prisma data
```

### 2. Domain Types (`experiments.ts`)

Business logic and UI-facing types. These may transform database types for presentation.

```typescript
import type {
  UIExperiment, // Transformed for UI display
  CustomField, // Form field configuration
  CreateExperimentRequest, // API request body
} from "@/types";

// Use these when:
// - UI components
// - API request/response bodies
// - Business logic transformations
```

## 🔄 Type Transformations

### Database → UI

```typescript
// In server components or API routes
const dbExperiment: Experiment = await prisma.experiment.findUnique(...);

const uiExperiment: UIExperiment = {
  id: dbExperiment.id,
  title: dbExperiment.title,
  duration: dbExperiment.durationDays,  // Transform field name
  startDate: dbExperiment.startedAt?.toISOString().split("T")[0], // Format date
  // ... other transformations
};
```

### UI → API Request

```typescript
// In client components
const formData: CreateExperimentRequest = {
  title: experimentTitle,
  durationDays: Number(duration),
  frequency: frequency as ExperimentFrequency,
  fields: customFields.map((f) => ({ ...f, id: undefined })), // Remove id for creation
};
```

## 🎯 Type Safety Best Practices

1. **Use Prisma Types for Database Operations**

   ```typescript
   const experiment: Experiment = await prisma.experiment.findUnique(...);
   ```

2. **Use Domain Types for UI/API**

   ```typescript
   const uiExperiment: UIExperiment = transformToUI(experiment);
   ```

3. **Avoid `any` - Use `unknown` if type is truly unknown**

   ```typescript
   // ❌ BAD
   const data: any = await response.json();
   
   // ✅ GOOD
   const data: unknown = await response.json();
   const validated: CreateExperimentRequest = validateCreateRequest(data);
   ```

4. **Extract Common Patterns**
   ```typescript
   // If you find yourself repeating the same transformation,
   // create a helper function with proper typing
   export function transformExperimentToUI(exp: Experiment): UIExperiment {
     // ...
   }
   ```

## 🔍 Search Functionality

We use **Prisma's built-in search** (no Typesense needed):

- Basic `contains` queries for text search
- Client-side filtering for status
- Sufficient for personal experiment tracking

See `src/app/api/experiments/route.ts` for search implementation:

```typescript
if (searchTerm) {
  where.OR = [
    { title: { contains: searchTerm, mode: "insensitive" } },
    { whyMatters: { contains: searchTerm, mode: "insensitive" } },
    { hypothesis: { contains: searchTerm, mode: "insensitive" } },
  ];
}
```

## ✅ Zod Validation (Optional)

**Zod is NOT currently installed** in this project.

If you want runtime validation for API requests, you can add Zod:

```bash
npm install zod
```

Then create validation schemas in `src/lib/validations/`:

```typescript
import { z } from "zod";

export const createExperimentSchema = z.object({
  title: z.string().min(1),
  durationDays: z.number().int().positive(),
  frequency: z.enum(["daily", "every-2-days", "weekly"]),
  // ...
});
```

Currently, we rely on **TypeScript types + Prisma validation** for type safety.

## 📝 Adding New Types

1. **Database types**: Update Prisma schema, types auto-generate
2. **Domain types**: Add to `experiments.ts` or create new domain file
3. **Export**: Add exports to `index.ts`

## 🚀 Migration from Old Types

If you have types scattered across components:

1. Move shared types to appropriate files in `src/types/`
2. Update imports to use `@/types`
3. Remove duplicate type definitions

Example migration:

```typescript
// Before (in component file)
interface CustomField { ... }

// After (in src/types/experiments.ts)
export interface CustomField { ... }

// Import in component
import type { CustomField } from "@/types";
```
