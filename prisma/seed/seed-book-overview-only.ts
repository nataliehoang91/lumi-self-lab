/**
 * Production-safe: seeds only Book Overview data (and backfills slugEn on BibleBook if missing).
 * Run: npx tsx prisma/seed/seed-book-overview-only.ts
 *
 * Uses DATABASE_URL from env (e.g. production). Does not run the full seed.
 */

import { PrismaClient } from "@prisma/client";
import { seedBookOverviews } from "./seed-book-overviews";

function slugFromNameEn(nameEn: string): string {
  return nameEn.trim().toLowerCase().replace(/\s+/g, "-");
}

async function backfillSlugEn(prisma: PrismaClient) {
  const withoutSlug = await prisma.bibleBook.findMany({
    where: { slugEn: null },
    select: { id: true, nameEn: true },
  });
  if (withoutSlug.length === 0) {
    console.log("All BibleBook rows already have slugEn.");
    return;
  }
  for (const book of withoutSlug) {
    await prisma.bibleBook.update({
      where: { id: book.id },
      data: { slugEn: slugFromNameEn(book.nameEn) },
    });
  }
  console.log(`Backfilled slugEn for ${withoutSlug.length} book(s).`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Backfilling slugEn on BibleBook (if any missing)...");
    await backfillSlugEn(prisma);
    console.log("Seeding BibleBookOverview...");
    await seedBookOverviews(prisma);
    console.log("Done.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
