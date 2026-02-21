import { prisma } from "@/lib/prisma";

export type VerseData = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  verseEnd: number | null;
  titleEn: string | null;
  titleVi: string | null;
  titleZh: string | null;
  contentVIE1923: string | null;
  contentKJV: string | null;
  contentNIV: string | null;
  contentZH: string | null;
  content: string | null;
  createdAt: string;
};

export async function getVerseById(id: string): Promise<VerseData | null> {
  const row = await prisma.flashVerse.findUnique({
    where: { id },
  });
  if (!row) return null;
  return {
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    verse: row.verse,
    verseEnd: row.verseEnd,
    titleEn: row.titleEn,
    titleVi: row.titleVi,
    titleZh: row.titleZh,
    contentVIE1923: row.contentVIE1923,
    contentKJV: row.contentKJV,
    contentNIV: row.contentNIV,
    contentZH: row.contentZH,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  };
}
