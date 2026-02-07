/**
 * Database Reset Script
 * 
 * This script truncates all tables but keeps the table structure.
 * Use this to reset all data while keeping the schema intact.
 * 
 * Usage:
 *   npx tsx scripts/reset-database.ts
 *   OR
 *   npx prisma db execute --file scripts/reset-database.sql
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("🔄 Resetting database...");

    // Disable foreign key checks (PostgreSQL)
    // Note: PostgreSQL doesn't support disabling FK checks in the same way as MySQL
    // We need to truncate in the correct order (child tables first)

    // Delete in order to respect foreign key constraints
    // Start with tables that have foreign keys, work up to parent tables

    console.log("Deleting ExperimentFieldResponse...");
    await prisma.experimentFieldResponse.deleteMany({});

    console.log("Deleting ExperimentCheckIn...");
    await prisma.experimentCheckIn.deleteMany({});

    console.log("Deleting ExperimentField...");
    await prisma.experimentField.deleteMany({});

    console.log("Deleting Experiment...");
    await prisma.experiment.deleteMany({});

    console.log("Deleting OrganisationTemplateField...");
    await prisma.organisationTemplateField.deleteMany({});

    console.log("Deleting OrganisationTemplate...");
    await prisma.organisationTemplate.deleteMany({});

    console.log("Deleting OrganisationMember...");
    await prisma.organisationMember.deleteMany({});

    console.log("Deleting OrganisationInvite...");
    await prisma.organisationInvite.deleteMany({});

    console.log("Deleting Organisation...");
    await prisma.organisation.deleteMany({});

    console.log("Deleting User...");
    await prisma.user.deleteMany({});

    console.log("✅ Database reset complete! All data deleted, tables preserved.");

    // Show table counts (should all be 0)
    const userCount = await prisma.user.count();
    const orgCount = await prisma.organisation.count();
    const expCount = await prisma.experiment.count();

    console.log("\n📊 Table counts:");
    console.log(`  Users: ${userCount}`);
    console.log(`  Organisations: ${orgCount}`);
    console.log(`  Experiments: ${expCount}`);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset
resetDatabase()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
