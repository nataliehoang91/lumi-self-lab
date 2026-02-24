"use server";

import { prisma } from "@/lib/prisma";

export type BibleInsightSource = "db" | "ai";

/** Normalized shape for UI: context, explanation, reflections[]. */
export interface ChapterInsightData {
  context: string | null;
  explanation: string | null;
  reflections: string[];
  source: BibleInsightSource;
}

/** Map app language (EN/VI/ZH) to insight locale (en/vi/zh). */
function toInsightLocale(language: string): "en" | "vi" | "zh" {
  const l = language.toUpperCase();
  if (l === "VI") return "vi";
  if (l === "ZH") return "zh";
  return "en";
}

function parseReflections(json: unknown): string[] {
  if (Array.isArray(json)) {
    return json.filter((x): x is string => typeof x === "string");
  }
  return [];
}

/**
 * Fetch insights for a chapter: from DB and/or AI.
 * Prefer chapter-level insight; fall back to book-level for the same source.
 * Returns { db, ai }. Each is null if no insight exists for that source.
 */
export async function getInsightsForChapter(
  bookId: string,
  chapterNumber: number,
  language: string
): Promise<{ db: ChapterInsightData | null; ai: ChapterInsightData | null }> {
  const locale = toInsightLocale(language);

  const rows = await prisma.bibleInsight.findMany({
    where: {
      bookId,
      language: locale,
      status: "published",
      OR: [
        { scope: "chapter", chapterNumber },
        { scope: "book", chapterNumber: null, verseNumber: null },
      ],
    },
    orderBy: [{ scope: "desc" }], // "chapter" before "book" (desc = chapter first)
  });

  const bySource = { db: null as ChapterInsightData | null, ai: null as ChapterInsightData | null };

  for (const row of rows) {
    const source = row.source as BibleInsightSource;
    if (source !== "db" && source !== "ai") continue;
    const data: ChapterInsightData = {
      context: row.context ?? null,
      explanation: row.explanation ?? null,
      reflections: parseReflections(row.reflections),
      source,
    };
    const isChapterLevel = row.scope === "chapter";
    if (isChapterLevel) bySource[source] = data;
    else if (!bySource[source]) bySource[source] = data; // book-level fallback
  }

  return bySource;
}

/**
 * Fetch insight for a single verse (for future verse-level tooltips or panels).
 * Prefer verse-level, then chapter-level, then book-level.
 */
export async function getInsightForVerse(
  bookId: string,
  chapterNumber: number,
  verseNumber: number,
  language: string,
  source: BibleInsightSource
): Promise<ChapterInsightData | null> {
  const locale = toInsightLocale(language);

  const rows = await prisma.bibleInsight.findMany({
    where: {
      bookId,
      language: locale,
      status: "published",
      source,
      OR: [
        { scope: "verse", chapterNumber, verseNumber },
        { scope: "chapter", chapterNumber, verseNumber: null },
        { scope: "book", chapterNumber: null, verseNumber: null },
      ],
    },
    orderBy: [{ scope: "desc" }], // verse > chapter > book
  });

  const best = rows[0];
  if (!best) return null;

  return {
    context: best.context ?? null,
    explanation: best.explanation ?? null,
    reflections: parseReflections(best.reflections),
    source: best.source as BibleInsightSource,
  };
}
