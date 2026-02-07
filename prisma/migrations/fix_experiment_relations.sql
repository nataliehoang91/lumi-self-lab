-- Fix Experiment table: Add missing organisationId column and foreign keys
-- This script adds the parts that failed in the previous migration

-- Add organisationId column if it doesn't exist
ALTER TABLE "Experiment" ADD COLUMN IF NOT EXISTS "organisationId" TEXT;

-- Add index for organisationId
CREATE INDEX IF NOT EXISTS "Experiment_organisationId_idx" ON "Experiment"("organisationId");

-- Add foreign key to Organisation (optional, so NULL values are allowed)
ALTER TABLE "Experiment" 
  ADD CONSTRAINT IF NOT EXISTS "Experiment_organisationId_fkey" 
  FOREIGN KEY ("organisationId") 
  REFERENCES "Organisation"("id") 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;

-- Note: We're NOT adding the foreign key to User table yet
-- because existing experiments don't have User records.
-- User records will be created automatically when needed via /api/users/identity
-- The relation is optional in the schema, so this is fine.
