"use server";

import { cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { BibleBook } from "@/components/Bible/Read/types";
import type { ChapterContent } from "@/components/Bible/Read/types";
import type { ReadVersionId } from "@/app/(bible)/bible/read/params";

const LANGS = ["vie", "kjv", "niv", "zh"] as const;
type ApiLang = (typeof LANGS)[number];

function versionToApiLang(version: ReadVersionId): ApiLang {
  return version === "vi" ? "vie" : version;
}

/** Cached via use cache + cacheLife so repeated navigations don't hit DB every time. */
export async function getBooks(): Promise<BibleBook[]> {
  "use cache";
  cacheLife("hours");
  const rows = await prisma.bibleBook.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      nameEn: true,
      nameVi: true,
      nameZh: true,
      order: true,
      chapterCount: true,
    },
  });
  return rows as BibleBook[];
}

export async function getChapterContent(
  bookId: string,
  chapter: number,
  version: ReadVersionId
): Promise<ChapterContent | null> {
  const lang = versionToApiLang(version);
  if (!LANGS.includes(lang)) return null;

  const book = await prisma.bibleBook.findUnique({
    where: { id: bookId },
    select: { id: true, nameEn: true, nameVi: true, nameZh: true, order: true, chapterCount: true },
  });
  if (!book) return null;

  const rows = await prisma.bibleVerseContent.findMany({
    where: { bookId, chapter },
    orderBy: { verse: "asc" },
    select: {
      verse: true,
      contentVIE1923: true,
      contentKJV: true,
      contentNIV: true,
      contentZH: true,
    },
  });

  const col =
    lang === "vie"
      ? "contentVIE1923"
      : lang === "kjv"
        ? "contentKJV"
        : lang === "niv"
          ? "contentNIV"
          : "contentZH";

  const verses = rows.map((r) => ({
    number: r.verse,
    text: (r[col as keyof typeof r] as string | null)?.trim() ?? "",
  }));

  return {
    book: {
      id: book.id,
      nameEn: book.nameEn,
      nameVi: book.nameVi,
      nameZh: book.nameZh,
      order: book.order,
      chapterCount: book.chapterCount,
    },
    chapter,
    verses,
  };
}
