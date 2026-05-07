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
  authorOccupation: string | null;
  date: string | null;
  audience: string | null;
  themes: string[];
  /** Legacy single paragraph; prefer summary (array) when present. */
  christConnection: string | null;
  /** Summary as array of paragraphs (p1, p2, p3). */
  summary: string[];
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
  });
  if (!book) return null;

  const overview = await prisma.bibleBookOverview.findFirst({
    where: { bookId: book.id, language: lang },
  });

  const themes = (overview?.themes ?? []) as unknown as string[];
  const keyVerses = (overview?.keyVerses ?? []) as unknown as KeyVerseRow[];
  const outline = (overview?.outline ?? []) as unknown as OutlineRow[];
  const rawSummary = overview?.summary;
  const summaryArray = Array.isArray(rawSummary)
    ? (rawSummary as string[]).filter((s): s is string => typeof s === "string")
    : [];
  const christConnection = overview?.christConnection ?? null;
  const summary =
    summaryArray.length > 0
      ? summaryArray
      : christConnection
        ? [christConnection]
        : [];

  return {
    bookId: book.id,
    nameEn: book.nameEn,
    nameVi: book.nameVi,
    order: book.order,
    chapterCount: book.chapterCount,
    author: overview?.author ?? null,
    authorOccupation: overview?.authorOccupation ?? null,
    date: overview?.date ?? null,
    audience: overview?.audience ?? null,
    themes,
    christConnection,
    summary,
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
    select: {
      slugEn: true,
      nameEn: true,
      nameVi: true,
      order: true,
      chapterCount: true,
    },
  });
  return rows;
}
