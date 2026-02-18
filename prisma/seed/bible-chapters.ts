import type { PrismaClient } from "@prisma/client";
import { VERSE_COUNTS } from "./verse-counts-kjv";

export async function seedBibleChapters(prisma: PrismaClient) {
  const count = await prisma.bibleChapter.count();
  if (count > 0) {
    console.log("BibleChapter table already has data, skipping seed.");
    return;
  }

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  if (books.length !== VERSE_COUNTS.length) {
    console.warn("BibleBook count does not match VERSE_COUNTS length, skipping BibleChapter seed.");
    return;
  }

  const rows: { bookId: string; chapterNumber: number; verseCount: number }[] = [];
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const counts = VERSE_COUNTS[i];
    if (!counts) continue;
    for (let ch = 1; ch <= counts.length; ch++) {
      rows.push({
        bookId: book.id,
        chapterNumber: ch,
        verseCount: counts[ch - 1] ?? 0,
      });
    }
  }

  await prisma.bibleChapter.createMany({ data: rows });
  console.log(`Seeded ${rows.length} Bible chapters (verse counts).`);
}
