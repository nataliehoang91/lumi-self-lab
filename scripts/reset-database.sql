-- Database Reset SQL Script
-- 
-- This script truncates all tables but keeps the table structure.
-- Use this to reset all data while keeping the schema intact.
--
-- Usage in PostgreSQL:
--   psql $DATABASE_URL -f scripts/reset-database.sql
--
-- Or via Prisma:
--   npx prisma db execute --file scripts/reset-database.sql

-- Disable triggers temporarily (PostgreSQL)
SET session_replication_role = 'replica';

-- Delete in order to respect foreign key constraints
-- Start with child tables (tables with foreign keys), work up to parent tables

-- Delete ExperimentFieldResponse (has FK to ExperimentCheckIn and ExperimentField)
DELETE FROM "ExperimentFieldResponse";

-- Delete ExperimentCheckIn (has FK to Experiment)
DELETE FROM "ExperimentCheckIn";

-- Delete ExperimentField (has FK to Experiment)
DELETE FROM "ExperimentField";

-- Delete Experiment (has FK to User and Organisation)
DELETE FROM "Experiment";

-- Delete OrganisationTemplateField (has FK to OrganisationTemplate)
DELETE FROM "OrganisationTemplateField";

-- Delete OrganisationTemplate (has FK to Organisation)
DELETE FROM "OrganisationTemplate";

-- Delete OrganisationMember (has FK to Organisation and User)
DELETE FROM "OrganisationMember";

-- Delete Organisation (has FK to User)
DELETE FROM "Organisation";

-- Delete User (parent table, can have many related records)
DELETE FROM "User";

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Verify all tables are empty
SELECT 
  'User' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Organisation', COUNT(*) FROM "Organisation"
UNION ALL
SELECT 'OrganisationMember', COUNT(*) FROM "OrganisationMember"
UNION ALL
SELECT 'OrganisationTemplate', COUNT(*) FROM "OrganisationTemplate"
UNION ALL
SELECT 'OrganisationTemplateField', COUNT(*) FROM "OrganisationTemplateField"
UNION ALL
SELECT 'Experiment', COUNT(*) FROM "Experiment"
UNION ALL
SELECT 'ExperimentField', COUNT(*) FROM "ExperimentField"
UNION ALL
SELECT 'ExperimentCheckIn', COUNT(*) FROM "ExperimentCheckIn"
UNION ALL
SELECT 'ExperimentFieldResponse', COUNT(*) FROM "ExperimentFieldResponse";
