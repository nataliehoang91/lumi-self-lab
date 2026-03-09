/**
 * Backfill BibleChapter.subtitleSearchTerms from existing sectionTitle, sectionTitleKJV, sectionTitleNIV.
 * Each chapter gets an array of searchable variants: original titles + lowercase + normalized (no diacritics).
 * Run once after adding the column: npx tsx prisma/seed/backfill-subtitle-search-terms.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeForSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Build unique search terms from one or more titles (e.g. "The Creation" → ["The Creation", "the creation", "creation"]). */
function buildSearchTerms(...titles: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const t of titles) {
    if (typeof t !== "string" || !t.trim()) continue;
    const trimmed = t.trim();
    set.add(trimmed);
    set.add(trimmed.toLowerCase());
    const norm = normalizeForSearch(trimmed);
    if (norm) set.add(norm);
  }
  return Array.from(set);
}

async function backfill() {
  console.log("🌱 Backfilling subtitleSearchTerms from section titles...");
  const chapters = await prisma.bibleChapter.findMany({
    select: {
      id: true,
      bookId: true,
      chapterNumber: true,
      sectionTitle: true,
      sectionTitleKJV: true,
      sectionTitleNIV: true,
    },
  });
  let updated = 0;
  for (const ch of chapters) {
    const terms = buildSearchTerms(ch.sectionTitle, ch.sectionTitleKJV, ch.sectionTitleNIV);
    if (terms.length === 0) continue;
    await prisma.bibleChapter.update({
      where: { id: ch.id },
      data: { subtitleSearchTerms: terms },
    });
    updated++;
  }
  console.log(`✅ Updated subtitleSearchTerms for ${updated} chapter(s).`);
}

backfill()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
