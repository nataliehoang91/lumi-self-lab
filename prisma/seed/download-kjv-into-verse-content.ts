/**
 * One-time script: fetch full KJV (public domain) and fill BibleVerseContent.
 * Run: npx tsx prisma/seed/download-kjv-into-verse-content.ts
 * Requires: migrations applied, BibleBook + BibleChapter seeded, network access.
 */
import { PrismaClient, Prisma } from "@prisma/client";

const KJV_JSON_URL =
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json";

type KjvBook = { abbrev: string; chapters: string[][] };

async function main() {
  const prisma = new PrismaClient();

  console.log("Fetching KJV from GitHub…");
  const res = await fetch(KJV_JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch KJV: ${res.status}`);
  const kjvBooks = (await res.json()) as KjvBook[];

  if (kjvBooks.length !== 66) {
    throw new Error(`Expected 66 books, got ${kjvBooks.length}`);
  }

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  if (books.length !== 66) {
    throw new Error(`Expected 66 BibleBook rows, got ${books.length}. Run db:seed first.`);
  }

  const BATCH = 400; // verses per transaction to avoid DB limits
  let total = 0;

  for (let bookIndex = 0; bookIndex < 66; bookIndex++) {
    const book = books[bookIndex];
    const kjv = kjvBooks[bookIndex];
    if (!book || !kjv?.chapters) continue;

    const ops: Prisma.PrismaPromise<unknown>[] = [];
    for (let ch = 0; ch < kjv.chapters.length; ch++) {
      const verses = kjv.chapters[ch];
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
              contentKJV: text.trim(),
            },
            update: { contentKJV: text.trim() },
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

  console.log(`Done. ${total} verses in BibleVerseContent (KJV).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
