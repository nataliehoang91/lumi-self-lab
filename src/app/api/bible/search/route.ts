import type { BibleBook } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ContextSearchRow = {
  bookId: string;
  chapterNumber: number;
  sectionTitle: string | null;
  sectionTitleKJV: string | null;
  sectionTitleNIV: string | null;
  nameEn: string;
  nameVi: string;
  nameZh: string | null;
  order: number;
  chapterCount: number;
};

/** Normalize, compact (no spaces), strip trailing digits. "gia"→gia, "gia co"→giaco, "giang11"→giang. */
function parseQuery(input: string): string {
  const normalized = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\d]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const compact = normalized.replace(/\s+/g, "");
  return compact.replace(/\d+$/, "");
}

/** Trim and normalize for context (subtitle) search; keep spaces for phrase search. */
function contextQuery(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export type BibleSearchContextMatch = {
  bookId: string;
  nameEn: string;
  nameVi: string;
  nameZh: string | null;
  order: number;
  chapterCount: number;
  chapterNumber: number;
  subtitle: string | null;
};

/**
 * GET /api/bible/search?q=...&lang=en|vi|zh
 * Returns:
 * - book: one matching book (from BibleBookSearchKey) for "go to book" suggestions.
 * - contextMatches: chapters whose section title contains the query (search by context).
 * Subtitles are stored on BibleChapter (sectionTitle for VI, sectionTitleKJV/sectionTitleNIV for EN).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const langParam = (searchParams.get("lang") ?? "en").toLowerCase();
    const lang = langParam === "zh" ? "en" : langParam === "vi" ? "vi" : "en";

    const bookQuery = parseQuery(q);
    const contextQ = contextQuery(q);

    // Run book search and context search in parallel (2–3 DB calls total, same latency as the slowest)
    const [bookResult, contextResult] = await Promise.all([
      // 1) Book search (by key) — for "go to Genesis 1" style suggestions
      bookQuery
        ? prisma.bibleBookSearchKey
            .findMany({
              where: {
                lang,
                OR: [{ key: { startsWith: bookQuery } }, { key: { contains: bookQuery } }],
              },
              include: { book: true },
              orderBy: { book: { order: "asc" } },
              take: 10,
            })
            .then((keyMatches) => {
              const bookMap = new Map<string, BibleBook>();
              for (const m of keyMatches) {
                if (!bookMap.has(m.book.id)) bookMap.set(m.book.id, m.book);
              }
              const first = Array.from(bookMap.values())[0];
              return first
                ? {
                    id: first.id,
                    nameEn: first.nameEn,
                    nameVi: first.nameVi,
                    nameZh: first.nameZh ?? null,
                    order: first.order,
                    chapterCount: first.chapterCount,
                  }
                : null;
            })
        : Promise.resolve(null),

      // 2) Context search — match against BibleChapter.subtitleSearchTerms (array of variants per chapter)
      contextQ.length >= 2
        ? (async (): Promise<BibleSearchContextMatch[]> => {
            const pattern = `%${contextQ}%`;
            const rows = await prisma.$queryRaw<ContextSearchRow[]>`
              SELECT c."bookId", c."chapterNumber", c."sectionTitle", c."sectionTitleKJV", c."sectionTitleNIV",
                     b."nameEn", b."nameVi", b."nameZh", b."order", b."chapterCount"
              FROM "BibleChapter" c
              INNER JOIN "BibleBook" b ON b.id = c."bookId"
              WHERE EXISTS (
                SELECT 1 FROM unnest(c."subtitleSearchTerms") AS t(term)
                WHERE t.term ILIKE ${pattern}
              )
              ORDER BY b."order", c."chapterNumber"
              LIMIT 20
            `;
            return rows.map((row) => {
              const subtitle =
                lang === "vi"
                  ? row.sectionTitle
                  : row.sectionTitleNIV ?? row.sectionTitleKJV ?? row.sectionTitle;
              return {
                bookId: row.bookId,
                nameEn: row.nameEn,
                nameVi: row.nameVi,
                nameZh: row.nameZh ?? null,
                order: row.order,
                chapterCount: row.chapterCount,
                chapterNumber: row.chapterNumber,
                subtitle,
              };
            });
          })()
        : Promise.resolve([]),
    ]);

    const book = bookResult;
    const contextMatches = contextResult;

    return NextResponse.json({
      book: book
        ? {
            id: book.id,
            nameEn: book.nameEn,
            nameVi: book.nameVi,
            nameZh: book.nameZh ?? null,
            order: book.order,
            chapterCount: book.chapterCount,
          }
        : null,
      contextMatches,
    });
  } catch (e) {
    console.error("bible/search", e);
    return NextResponse.json({ error: "Search failed." }, { status: 500 });
  }
}
