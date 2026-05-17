"use server";

import { prisma } from "@/lib/prisma";

export interface TopicVerseText {
  bookSlug: string;
  bookId: string;
  chapter: number;
  verse: number;
  textEn: string | null;
  textVi: string | null;
  bookNameEn: string | null;
  bookNameVi: string | null;
}

/**
 * Fetch real verse texts from DB for a list of topic verses.
 * Uses `contentVIE1923` for Vietnamese and `contentNIV` for English.
 */
export async function getTopicVerseTexts(
  verses: { bookSlug: string; chapter: number; verse: number }[]
): Promise<Record<string, TopicVerseText>> {
  if (verses.length === 0) return {};

  const slugs = [...new Set(verses.map((v) => v.bookSlug))];

  // Resolve slugs → bookIds + book names
  const books = await prisma.bibleBook.findMany({
    where: { slugEn: { in: slugs } },
    select: { id: true, slugEn: true, nameEn: true, nameVi: true },
  });
  const slugToBook = Object.fromEntries(
    books.map((b) => [b.slugEn, { id: b.id, nameEn: b.nameEn, nameVi: b.nameVi }])
  );

  // Build conditions for each verse
  const conditions = verses
    .map((v) => {
      const book = slugToBook[v.bookSlug];
      if (!book) return null;
      return { bookId: book.id, chapter: v.chapter, verse: v.verse };
    })
    .filter(Boolean) as { bookId: string; chapter: number; verse: number }[];

  if (conditions.length === 0) return {};

  const rows = await prisma.bibleVerseContent.findMany({
    where: { OR: conditions.map((c) => ({ bookId: c.bookId, chapter: c.chapter, verse: c.verse })) },
    select: { bookId: true, chapter: true, verse: true, contentNIV: true, contentVIE1923: true },
  });

  const idToSlug = Object.fromEntries(books.map((b) => [b.id, b.slugEn ?? ""]));
  const result: Record<string, TopicVerseText> = {};

  for (const row of rows) {
    const slug = idToSlug[row.bookId];
    if (!slug) continue;
    const book = slugToBook[slug];
    const key = `${slug}-${row.chapter}-${row.verse}`;
    result[key] = {
      bookSlug: slug,
      bookId: row.bookId,
      chapter: row.chapter,
      verse: row.verse,
      textEn: row.contentNIV,
      textVi: row.contentVIE1923,
      bookNameEn: book?.nameEn ?? null,
      bookNameVi: book?.nameVi ?? null,
    };
  }
  return result;
}
