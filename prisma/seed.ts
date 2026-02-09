/**
 * Prisma seed entry point.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import { seedExperimentTemplates } from "./seed/experiment-templates";

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedExperimentTemplates(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
