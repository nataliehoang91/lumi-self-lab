"use server";

import { cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { BibleBook } from "@/components/Bible/Read/types";
import type { ChapterContent } from "@/components/Bible/Read/types";
import type { ReadVersionId } from "@/app/(bible)/bible/[lang]/read/params";

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
      slugEn: true,
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

  const [book, chapterRow] = await Promise.all([
    prisma.bibleBook.findUnique({
      where: { id: bookId },
      select: {
        id: true,
        nameEn: true,
        nameVi: true,
        nameZh: true,
        order: true,
        chapterCount: true,
      },
    }),
    prisma.bibleChapter.findUnique({
      where: { bookId_chapterNumber: { bookId, chapterNumber: chapter } },
      select: { sectionTitle: true, sectionTitleKJV: true, sectionTitleNIV: true },
    }),
  ]);
  if (!book) return null;

  const effectiveSectionTitle =
    lang === "kjv"
      ? (chapterRow?.sectionTitleKJV ?? chapterRow?.sectionTitle) ?? null
      : lang === "niv"
        ? (chapterRow?.sectionTitleNIV ?? chapterRow?.sectionTitle) ?? null
        : chapterRow?.sectionTitle ?? null;

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
    sectionTitle: effectiveSectionTitle,
  };
}

export type VerseOfDay = {
  text: string;
  ref: string;
  bookId: string;
  bookNameEn: string;
  bookNameVi: string;
  chapter: number;
  verse: number;
  testament: "ot" | "nt";
};

export async function getVerseOfDay(lang: "vi" | "en"): Promise<VerseOfDay | null> {
  "use cache";
  cacheLife("days");

  const contentField = lang === "vi" ? "contentVIE1923" : "contentKJV";
  const count = await prisma.flashVerse.count({
    where: { [contentField]: { not: null }, bookId: { not: null } },
  });
  if (count === 0) return null;

  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const idx = dayOfYear % count;

  const rows = await prisma.flashVerse.findMany({
    where: { [contentField]: { not: null }, bookId: { not: null } },
    orderBy: { createdAt: "asc" },
    skip: idx,
    take: 1,
    select: {
      contentVIE1923: true,
      contentKJV: true,
      referenceLabelVi: true,
      referenceLabelEn: true,
      titleVi: true,
      titleEn: true,
      chapter: true,
      verse: true,
      bookId: true,
      bibleBook: { select: { nameEn: true, nameVi: true, order: true } },
    },
  });

  const row = rows[0];
  if (!row?.bookId || !row.bibleBook) return null;

  const text = lang === "vi" ? row.contentVIE1923 : row.contentKJV;
  if (!text) return null;

  const ref =
    lang === "vi"
      ? (row.referenceLabelVi ?? row.titleVi ?? `${row.bibleBook.nameVi} ${row.chapter}:${row.verse}`)
      : (row.referenceLabelEn ?? row.titleEn ?? `${row.bibleBook.nameEn} ${row.chapter}:${row.verse}`);

  return {
    text,
    ref,
    bookId: row.bookId,
    bookNameEn: row.bibleBook.nameEn,
    bookNameVi: row.bibleBook.nameVi,
    chapter: row.chapter,
    verse: row.verse,
    testament: row.bibleBook.order <= 39 ? "ot" : "nt",
  };
}
