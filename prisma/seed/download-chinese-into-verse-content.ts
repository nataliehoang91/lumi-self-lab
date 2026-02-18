/**
 * One-time script: fetch full Chinese Bible CUV (thiagobodruk) and fill contentZH.
 * Run: npx tsx prisma/seed/download-chinese-into-verse-content.ts
 * Requires: BibleBook seeded (KJV/VI recommended first), network access.
 * Source: https://github.com/thiagobodruk/bible (zh_cuv.json), same structure as en_kjv.
 */
import { PrismaClient } from "@prisma/client";

const ZH_JSON_URL =
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/zh_cuv.json";

type ZhBook = { abbrev: string; chapters: string[][] };

async function main() {
  const prisma = new PrismaClient();

  console.log("Fetching Chinese (CUV) Bible from GitHub…");
  const res = await fetch(ZH_JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch Chinese: ${res.status}`);
  const zhBooks = (await res.json()) as ZhBook[];

  if (zhBooks.length !== 66) {
    throw new Error(`Expected 66 books, got ${zhBooks.length}`);
  }

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  if (books.length !== 66) {
    throw new Error(`Expected 66 BibleBook rows, got ${books.length}. Run db:seed first.`);
  }

  const BATCH = 400;
  let total = 0;

  for (let bookIndex = 0; bookIndex < 66; bookIndex++) {
    const book = books[bookIndex];
    const zh = zhBooks[bookIndex];
    if (!book || !zh?.chapters) continue;

    const ops: Promise<unknown>[] = [];
    for (let ch = 0; ch < zh.chapters.length; ch++) {
      const verses = zh.chapters[ch];
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
              contentZH: text.trim(),
            },
            update: { contentZH: text.trim() },
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

  console.log(`Done. ${total} verses updated with Chinese (contentZH).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
