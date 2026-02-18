/**
 * Prisma seed entry point.
 * Run with: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import { seedBibleBooks } from "./seed/bible-books";
import { seedBibleChapters } from "./seed/bible-chapters";
import { seedBibleVerseContent } from "./seed/bible-verse-content";
import { seedExperimentTemplates } from "./seed/experiment-templates";
import { seedFlashVerses } from "./seed/flash-verses";

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedExperimentTemplates(prisma);
    await seedBibleBooks(prisma);
    await seedBibleChapters(prisma);
    await seedBibleVerseContent(prisma);
    await seedFlashVerses(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
