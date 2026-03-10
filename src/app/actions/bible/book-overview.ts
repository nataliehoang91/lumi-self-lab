"use server";

import { prisma } from "@/lib/prisma";

export type BookOverviewLang = "en" | "vi";

export interface KeyVerseRow {
  ref: string;
  text: string;
  chapter?: number;
  verse?: number;
}

export interface OutlineRow {
  chapter: string;
  title: string;
}

export interface BookOverviewData {
  bookId: string;
  nameEn: string;
  nameVi: string;
  order: number;
  chapterCount: number;
  author: string | null;
  date: string | null;
  audience: string | null;
  themes: string[];
  christConnection: string | null;
  keyVerses: KeyVerseRow[];
  outline: OutlineRow[];
}

/**
 * Resolve book by English URL slug (e.g. "genesis", "1-corinthians").
 * Returns book + overview for the given language, or null if not found.
 */
export async function getBookOverviewBySlug(
  bookSlug: string,
  lang: BookOverviewLang
): Promise<BookOverviewData | null> {
  const slug = bookSlug.trim().toLowerCase().replace(/\s+/g, "-");
  const book = await prisma.bibleBook.findFirst({
    where: { slugEn: slug },
    include: {
      bookOverviews: {
        where: { language: lang },
        take: 1,
      },
    },
  });
  if (!book) return null;

  const overview = book.bookOverviews[0];
  const themes = (overview?.themes ?? []) as string[];
  const keyVerses = (overview?.keyVerses ?? []) as KeyVerseRow[];
  const outline = (overview?.outline ?? []) as OutlineRow[];

  return {
    bookId: book.id,
    nameEn: book.nameEn,
    nameVi: book.nameVi,
    order: book.order,
    chapterCount: book.chapterCount,
    author: overview?.author ?? null,
    date: overview?.date ?? null,
    audience: overview?.audience ?? null,
    themes,
    christConnection: overview?.christConnection ?? null,
    keyVerses,
    outline,
  };
}

/** Book row for table-of-contents (order 1–39 = OT, 40–66 = NT). */
export interface BookForToc {
  slugEn: string | null;
  nameEn: string;
  nameVi: string;
  order: number;
  chapterCount: number;
}

/**
 * Get all books with slugEn for building book-overviews index / table of contents.
 */
export async function getBooksWithSlug(): Promise<BookForToc[]> {
  const rows = await prisma.bibleBook.findMany({
    orderBy: { order: "asc" },
    select: { slugEn: true, nameEn: true, nameVi: true, order: true, chapterCount: true },
  });
  return rows;
}
