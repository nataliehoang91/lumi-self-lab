/**
 * One-time script: fetch full Vietnamese Bible (thiagobodruk) and fill contentVIE1923.
 * Run: npx tsx prisma/seed/download-vietnamese-into-verse-content.ts
 * Requires: KJV already seeded (or run after), network access.
 * Source: https://github.com/thiagobodruk/bible (vi_vietnamese.json), same structure as en_kjv.
 */
import { PrismaClient } from "@prisma/client";

const VI_JSON_URL =
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/vi_vietnamese.json";

type ViBook = { abbrev: string; chapters: string[][] };

async function main() {
  const prisma = new PrismaClient();

  console.log("Fetching Vietnamese Bible from GitHub…");
  const res = await fetch(VI_JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch Vietnamese: ${res.status}`);
  const viBooks = (await res.json()) as ViBook[];

  if (viBooks.length !== 66) {
    throw new Error(`Expected 66 books, got ${viBooks.length}`);
  }

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  if (books.length !== 66) {
    throw new Error(`Expected 66 BibleBook rows, got ${books.length}. Run db:seed first.`);
  }

  const BATCH = 400;
  let total = 0;

  for (let bookIndex = 0; bookIndex < 66; bookIndex++) {
    const book = books[bookIndex];
    const vi = viBooks[bookIndex];
    if (!book || !vi?.chapters) continue;

    const ops: Promise<unknown>[] = [];
    for (let ch = 0; ch < vi.chapters.length; ch++) {
      const verses = vi.chapters[ch];
      if (!Array.isArray(verses)) continue;
      const chapterNum = ch + 1;
      for (let v = 0; v < verses.length; v++) {
        const text = verses[v];
        if (typeof text !== "string" || !text.trim()) continue;
        const verseNum = v + 1;
        ops.push(
          prisma.bibleVerseContent.upsert({
            where: {
              bookId_chapter_verse: {
                bookId: book.id,
                chapter: chapterNum,
                verse: verseNum,
              },
            },
            create: {
              bookId: book.id,
              chapter: chapterNum,
              verse: verseNum,
              contentVIE1923: text.trim(),
            },
            update: { contentVIE1923: text.trim() },
          })
        );
      }
    }

    for (let i = 0; i < ops.length; i += BATCH) {
      await prisma.$transaction(ops.slice(i, i + BATCH));
    }
    total += ops.length;
    console.log(`  ${book.nameEn}: ${ops.length} verses`);
  }

  console.log(`Done. ${total} verses updated with Vietnamese (contentVIE1923).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
