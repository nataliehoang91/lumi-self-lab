# Database Reset & Clerk Webhook Setup

## 🔄 Resetting Database (Keep Tables, Delete All Data)

### Option 1: Using TypeScript Script (Recommended)

```bash
npx tsx scripts/reset-database.ts
```

This will:

- Delete all data from all tables
- Keep table structure intact
- Show table counts after reset (should all be 0)

### Option 2: Using SQL Script

```bash
# Via Prisma
npx prisma db execute --file scripts/reset-database.sql

# Or directly via psql
psql $DATABASE_URL -f scripts/reset-database.sql
```

### What Gets Reset

All data is deleted from:

- `User`
- `Organisation`
- `OrganisationMember`
- `OrganisationTemplate`
- `OrganisationTemplateField`
- `Experiment`
- `ExperimentField`
- `ExperimentCheckIn`
- `ExperimentFieldResponse`

**Tables and schema remain intact** - only data is deleted.

---

## 🔔 Clerk Webhook Setup (Handle User Deletion)

### 1. Install Svix (if not already installed)

```bash
npm install svix
```

### 2. Set Environment Variable

Add to your `.env.local`:

```bash
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3. Configure Webhook in Clerk Dashboard

1. Go to Clerk Dashboard → Webhooks
2. Click "Add Endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/webhooks/clerk`
4. Select events to listen for:
   - ✅ `user.deleted` (required for user cleanup)
   - Optionally: `user.created`, `user.updated`
5. Copy the **Signing Secret** (starts with `whsec_`)
6. Add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

### 4. Test Webhook (Local Development)

For local testing, use `ngrok` to expose your local server. See **`WEBHOOK_LOCAL_TESTING.md`** for detailed instructions.

**Quick Setup:**

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server (Terminal 1)
npm run dev

# Expose local server (Terminal 2)
ngrok http 3005

# Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
# Use in Clerk dashboard: https://abc123.ngrok-free.app/api/webhooks/clerk
```

**📖 Full Guide:** See `WEBHOOK_LOCAL_TESTING.md` for step-by-step instructions.

### 5. How It Works

When a user is deleted in Clerk:

1. Clerk sends webhook to `/api/webhooks/clerk`
2. Webhook is verified using `CLERK_WEBHOOK_SECRET`
3. User record is deleted from database (cascade handles related records)

**Cascade Behavior:**

- Deleting `User` automatically deletes:
  - `OrganisationMember` (via `onDelete: Cascade`)
  - `Experiment` (via `onDelete: Cascade`)
  - Related `ExperimentCheckIn`, `ExperimentField`, etc.

---

## 📋 Manual User Cleanup (Alternative)

If you need to manually clean up a deleted Clerk user:

```typescript
// Via Prisma Studio or API
await prisma.user.deleteMany({
  where: { clerkUserId: "user_xxxxx" },
});
```

Or via SQL:

```sql
DELETE FROM "User" WHERE "clerkUserId" = 'user_xxxxx';
```

---

## 🛡️ Important Notes

1. **Cascade Deletes**: When a `User` is deleted, all related records are automatically deleted via Prisma cascade rules.

2. **Webhook Security**: Always verify webhook signatures using `svix` - never trust unverified webhooks.

3. **Production**: Make sure `CLERK_WEBHOOK_SECRET` is set in production environment variables.

4. **Backup**: Before resetting database, consider backing up data if needed.
