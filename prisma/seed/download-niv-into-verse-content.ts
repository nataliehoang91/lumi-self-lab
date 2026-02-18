/**
 * One-time script: fetch full NIV (aruljohn/Bible-niv) and fill contentNIV.
 * Run: npx tsx prisma/seed/download-niv-into-verse-content.ts
 * Requires: BibleBook seeded, network access. Run after KJV so rows exist (or creates new).
 * Source: https://github.com/aruljohn/Bible-niv (MIT) – one JSON file per book.
 */
import { PrismaClient } from "@prisma/client";

const NIV_BASE = "https://raw.githubusercontent.com/aruljohn/Bible-niv/main";
const BOOKS_JSON = `${NIV_BASE}/Books.json`;

type NIVChapter = { chapter: string; verses: { verse: string; text: string }[] };
type NIVBook = { book: string; count: number; chapters: NIVChapter[] };

async function main() {
  const prisma = new PrismaClient();

  console.log("Fetching NIV book list…");
  const booksRes = await fetch(BOOKS_JSON);
  if (!booksRes.ok) throw new Error(`Failed to fetch Books.json: ${booksRes.status}`);
  const nivBookNames = (await booksRes.json()) as string[];

  if (nivBookNames.length !== 66) {
    throw new Error(`Expected 66 books in Books.json, got ${nivBookNames.length}`);
  }

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  if (books.length !== 66) {
    throw new Error(`Expected 66 BibleBook rows, got ${books.length}. Run db:seed first.`);
  }

  const BATCH = 400;
  let total = 0;

  for (let bookIndex = 0; bookIndex < 66; bookIndex++) {
    const book = books[bookIndex];
    const nivName = nivBookNames[bookIndex];
    if (!book || !nivName) continue;

    const file = encodeURIComponent(nivName) + ".json";
    const url = `${NIV_BASE}/${file}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  Skip ${book.nameEn}: ${res.status} ${url}`);
      continue;
    }

    const niv = (await res.json()) as NIVBook;
    if (!niv?.chapters) continue;

    const ops: Promise<unknown>[] = [];
    for (let ch = 0; ch < niv.chapters.length; ch++) {
      const cap = niv.chapters[ch];
      if (!cap?.verses) continue;
      const chapterNum = ch + 1;
      for (let v = 0; v < cap.verses.length; v++) {
        const text = cap.verses[v]?.text;
        if (typeof text !== "string") continue;
        const verseNum = v + 1;
        const trimmed = text.trim();
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
              contentNIV: trimmed,
            },
            update: { contentNIV: trimmed },
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

  console.log(`Done. ${total} verses in BibleVerseContent (NIV).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
