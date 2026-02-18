import type { PrismaClient } from "@prisma/client";

/**
 * Example verse content (VIE, KJV, NIV) for admin to select and save to FlashVerse.
 * Book identified by order (1–66): 43 = John, 19 = Psalms, 50 = Philippians.
 */
const EXAMPLES: {
  bookOrder: number;
  chapter: number;
  verse: number;
  contentVIE1923: string;
  contentKJV: string;
  contentNIV: string;
}[] = [
  {
    bookOrder: 43,
    chapter: 3,
    verse: 16,
    contentVIE1923:
      "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, để ai tin Con ấy không bị hư mất mà được sự sống đời đời.",
    contentKJV:
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    contentNIV:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  },
  {
    bookOrder: 19,
    chapter: 23,
    verse: 1,
    contentVIE1923: "Đức Giê-hô-va là Đấng Chăn Ta, Ta chẳng thiếu thốn gì.",
    contentKJV: "The Lord is my shepherd; I shall not want.",
    contentNIV: "The Lord is my shepherd, I lack nothing.",
  },
  {
    bookOrder: 50,
    chapter: 4,
    verse: 13,
    contentVIE1923: "Tôi có thể làm mọi sự nhờ Đấng ban sức mạnh cho tôi.",
    contentKJV: "I can do all things through Christ which strengtheneth me.",
    contentNIV: "I can do all this through him who gives me strength.",
  },
  {
    bookOrder: 1,
    chapter: 1,
    verse: 1,
    contentVIE1923: "Ban đầu Đức Chúa Trời dựng nên trời và đất.",
    contentKJV: "In the beginning God created the heaven and the earth.",
    contentNIV: "In the beginning God created the heavens and the earth.",
  },
  {
    bookOrder: 43,
    chapter: 1,
    verse: 1,
    contentVIE1923: "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.",
    contentKJV: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    contentNIV: "In the beginning was the Word, and the Word was with God, and the Word was God.",
  },
];

export async function seedBibleVerseContent(prisma: PrismaClient) {
  const count = await prisma.bibleVerseContent.count();
  if (count > 0) {
    console.log("BibleVerseContent table already has data, skipping seed.");
    return;
  }

  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  const byOrder = new Map(books.map((b) => [b.order, b]));

  for (const row of EXAMPLES) {
    const book = byOrder.get(row.bookOrder);
    if (!book) continue;
    await prisma.bibleVerseContent.upsert({
      where: {
        bookId_chapter_verse: {
          bookId: book.id,
          chapter: row.chapter,
          verse: row.verse,
        },
      },
      create: {
        bookId: book.id,
        chapter: row.chapter,
        verse: row.verse,
        contentVIE1923: row.contentVIE1923,
        contentKJV: row.contentKJV,
        contentNIV: row.contentNIV,
      },
      update: {},
    });
  }
  console.log(`Seeded ${EXAMPLES.length} example verse contents.`);
}
