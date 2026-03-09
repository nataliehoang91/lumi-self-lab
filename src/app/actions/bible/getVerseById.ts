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
  referenceLabelEn: string | null;
  referenceLabelVi: string | null;
  referenceLabelZh: string | null;
  contentVIE1923: string | null;
  contentKJV: string | null;
  contentNIV: string | null;
  contentZH: string | null;
  contentDisplayVIE: string | null;
  contentDisplayKJV: string | null;
  contentDisplayNIV: string | null;
  contentDisplayZH: string | null;
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
    referenceLabelEn: row.referenceLabelEn,
    referenceLabelVi: row.referenceLabelVi,
    referenceLabelZh: row.referenceLabelZh,
    contentVIE1923: row.contentVIE1923,
    contentKJV: row.contentKJV,
    contentNIV: row.contentNIV,
    contentZH: row.contentZH,
    contentDisplayVIE: row.contentDisplayVIE,
    contentDisplayKJV: row.contentDisplayKJV,
    contentDisplayNIV: row.contentDisplayNIV,
    contentDisplayZH: row.contentDisplayZH,
    content: row.content,
    createdAt: row.createdAt.toISOString(),
  };
}
