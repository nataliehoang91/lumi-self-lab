# Migration Guide - User & Organisation Models

## ✅ Migration Completed

The migration `add_user_and_organisation_models` has been successfully applied.

## Schema Overview

### New Models:
- `User` - User accounts with `accountType` (individual | organisation)
- `Organisation` - Organisation records
- `OrganisationMember` - Organisation memberships
- `OrganisationTemplate` - Organisation experiment templates
- `OrganisationTemplateField` - Template field definitions

### Updated Models:
- `Experiment` - Added `organisationId` (optional) and relation to `User`

## Running Migrations

### Create New Migration:
```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name your_migration_name
```

### Reset Database (WARNING: Deletes All Data):
```bash
npx prisma migrate reset
```

## Step 2: Migrate Existing Data (Optional)

If you have existing experiments, you'll need to create User records for them:

```typescript
// scripts/migrate-users.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateUsers() {
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

migrateUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
npx tsx scripts/migrate-users.ts
```

## Step 3: Update Experiment API

Update `/api/experiments/route.ts` to ensure User exists:

```typescript
// In POST handler, before creating experiment:
// Ensure user exists
await prisma.user.upsert({
  where: { clerkUserId: userId },
  update: {},
  create: {
    clerkUserId: userId,
    accountType: "individual",
  },
});
```

## Step 4: Test Upgrade Flow

1. Sign in with Clerk
2. Check `/api/users/me` - should return user with accountType: "individual"
3. Navigate to `/upgrade`
4. Click "Upgrade Now"
5. Check `/api/users/me` again - should return accountType: "organisation"
6. Manager tab should appear in navbar

## Step 5: Verify Manager Access

1. Navigate to `/manager` - should work for organisation accounts
2. Try creating organisation template
3. Verify personal experiments still work

---

## Troubleshooting

### Error: "User not found"
- Make sure User record exists (auto-created by `/api/users/me`)
- Check clerkUserId matches

### Manager tab not showing
- Check user.accountType === "organisation" in database
- Check `/api/users/me` returns correct accountType
- Clear browser cache

### Migration fails
- Check database connection
- Check for existing data conflicts
- May need to reset database (WARNING: deletes all data)

---

## Files Created/Updated

### New Files:
- `src/app/api/users/me/route.ts`
- `src/app/api/users/upgrade/route.ts`
- `src/app/(protected)/upgrade/page.tsx`
- `src/hooks/use-user.ts`
- `src/components/Navigation/ManagerTabButton.tsx`
- `src/components/Navigation/ManagerTabButtonMobile.tsx`

### Updated Files:
- `prisma/schema.prisma` - Added User, Organisation models
- `src/components/Navigation/navigation-bar.tsx` - Conditional Manager tab

---

Ready to test! 🚀
