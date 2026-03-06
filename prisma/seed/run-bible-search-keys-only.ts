/**
 * Seed ONLY BibleBookSearchKey (for search). Safe to run on production.
 * Does NOT touch any other table.
 *
 * Run with: npx tsx prisma/seed/run-bible-search-keys-only.ts
 * Or: node --loader ts-node/esm prisma/seed/run-bible-search-keys-only.ts
 */
import { PrismaClient } from "@prisma/client";
import { seedBibleBookSearchKeys } from "./bible-book-search-keys";

async function main() {
  console.log("Seeding ONLY BibleBookSearchKey (search keys). No other tables are touched.\n");
  const prisma = new PrismaClient();
  try {
    await seedBibleBookSearchKeys(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
