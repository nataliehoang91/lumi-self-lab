-- Manual Test Users Creation SQL
-- 
-- This script creates test users directly in the database.
-- Use this when webhook isn't working or for manual testing.
--
-- 📋 TO GET FULL CLERK USER IDs:
--    1. Go to Clerk Dashboard → Users
--    2. Click on a user to view profile
--    3. In the right sidebar, find "User ID" field
--    4. Click the copy icon next to the User ID (e.g., user_38QH...aSa6pxcwp)
--    5. Replace the placeholder below with the FULL ID
--
-- 🔄 SYNC LOCAL → NEON (Run this ENTIRE file on BOTH databases):
--
--   STEP 1: Add users to LOCAL database first
--     # Set local DATABASE_URL in your .env.local
--     psql $DATABASE_URL -f scripts/create-test-users.sql
--     OR
--     npx prisma db execute --file scripts/create-test-users.sql --schema prisma/schema.prisma
--
--   STEP 2: Add users to NEON database (same file, same command)
--     DATABASE_URL="your-neon-url" psql $DATABASE_URL -f scripts/create-test-users.sql
--     OR
--     DATABASE_URL="your-neon-url" npx prisma db execute --file scripts/create-test-users.sql --schema prisma/schema.prisma
--
--   NOTE: The INSERT statements (lines 30-62) CREATE the users.
--         The SELECT statement (lines 65-77) only VERIFIES - it does NOT push data.
--
-- 📝 NOTE: Clerk webhook updates users at: src/app/api/webhooks/clerk/route.ts (lines 170-203)

-- Users from Clerk Dashboard (3 users from images)
-- ⚠️ IMPORTANT: Replace the clerkUserId placeholders below with FULL User IDs from Clerk Dashboard

INSERT INTO "User" ("id", "clerkUserId", "email", "accountType", "createdAt", "updatedAt")
VALUES
  -- User 1: Natalie Hoang
  -- Image shows: nataliehoang713@gmail.com, User ID: user_38QH...aSa6pxcwp (truncated)
  (
    gen_random_uuid()::text,
    'user_38QHfiWpysOELO8u2RaSa6pxcwp', -- ⚠️ Replace with FULL User ID from Clerk Dashboard
    'nataliehoang713@gmail.com',
    'individual',
    NOW(),
    NOW()
  ),
  -- User 2: hoang anh
  -- Image shows: hoanganh7133@gmail.com, User ID: user_38QH...mn8eVwidT (truncated)
  (
    gen_random_uuid()::text,
    'user_38QHqET2zFR2vQv7itmn8eVwidT', -- ⚠️ Replace with FULL User ID from Clerk Dashboard
    'hoanganh7133@gmail.com',
    'individual',
    NOW(),
    NOW()
  ),
  -- User 3: Natalie Hoang (second account)
  -- Image shows: natalie.hoang91@gmail.com, User ID: user_38QH...PSAWpWEjd (truncated)
  (
    gen_random_uuid()::text,
    'user_38QHPZMHlWGIKzRXbZPSAWpWEjd', -- ⚠️ Replace with FULL User ID from Clerk Dashboard
    'natalie.hoang91@gmail.com',
    'individual',
    NOW(),
    NOW()
  )
ON CONFLICT ("clerkUserId") DO NOTHING; -- Skip if user already exists

-- Verify users were created
SELECT 
  id,
  "clerkUserId",
  email,
  "accountType",
  "createdAt"
FROM "User"
WHERE "clerkUserId" IN (
  'user_38QHfiWpysOELO8u2RaSa6pxcwp',
  'user_38QHqET2zFR2vQv7itmn8eVwidT',
  'user_38QHPZMHlWGIKzRXbZPSAWpWEjd'
)
ORDER BY "createdAt" DESC;
