# Fix Migration - Handle Existing Data

## Problem
Migration failed because existing experiments have `clerkUserId` values that don't exist in the `User` table yet.

## Solution

### Option 1: Make Relation Optional (Already Done)
The `Experiment.user` relation is now optional (`User?`), so the migration should work. User records will be created automatically when needed via `/api/users/me`.

### Option 2: Create User Records First (Optional)
If you want to create User records for all existing experiments, you can run this after migration:

```typescript
// scripts/create-users-for-experiments.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUsersForExperiments() {
  // Get all unique clerkUserIds from experiments
  const experiments = await prisma.experiment.findMany({
    select: { clerkUserId: true },
    distinct: ["clerkUserId"],
  });

  // Create User records for each clerkUserId
  for (const exp of experiments) {
    await prisma.user.upsert({
      where: { clerkUserId: exp.clerkUserId },
      update: {},
      create: {
        clerkUserId: exp.clerkUserId,
        accountType: "individual", // Default to individual
      },
    });
  }

  console.log(`Created ${experiments.length} user records`);
}

createUsersForExperiments()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

## Next Steps

1. Try migration again:
```bash
npx prisma migrate dev --name add_user_and_organisation_models
```

2. If it still fails, you may need to resolve the failed migration first:
```bash
npx prisma migrate resolve --applied 20260117095614_add_user_and_organisation_models
```

3. Then try again or create a new migration.
