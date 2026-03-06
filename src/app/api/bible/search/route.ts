import type { BibleBook } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

/**
 * GET /api/bible/search?q=...&lang=en|vi|zh
 * Returns one matching book (best of multiple matches, deduped) for chapter/verse suggestions.
 * ZH is not supported for search keys; we fall back to EN. Requires BibleBookSearchKey to be seeded.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();
    const langParam = (searchParams.get("lang") ?? "en").toLowerCase();
    // ZH not supported for search keys yet; fallback to en
    const lang = langParam === "zh" ? "en" : langParam === "vi" ? "vi" : "en";

    const bookQuery = parseQuery(q);
    if (!bookQuery) {
      return NextResponse.json({ book: null });
    }

    // Use full bookQuery for both conditions (no prefix truncation) so "gia" and "timo" match correctly.
    const matches = await prisma.bibleBookSearchKey.findMany({
      where: {
        lang,
        OR: [{ key: { startsWith: bookQuery } }, { key: { contains: bookQuery } }],
      },
      include: { book: true },
      orderBy: { book: { order: "asc" } },
      take: 10,
    });

    const bookMap = new Map<string, BibleBook>();
    for (const m of matches) {
      if (!bookMap.has(m.book.id)) bookMap.set(m.book.id, m.book);
    }
    const uniqueBooks = Array.from(bookMap.values());
    const book = uniqueBooks[0] ?? null;

    if (!book) {
      return NextResponse.json({ book: null });
    }
    console.log("book", book);

    return NextResponse.json({
      book: {
        id: book.id,
        nameEn: book.nameEn,
        nameVi: book.nameVi,
        nameZh: book.nameZh ?? null,
        order: book.order,
        chapterCount: book.chapterCount,
      },
    });
  } catch (e) {
    console.error("bible/search", e);
    return NextResponse.json({ error: "Search failed." }, { status: 500 });
  }
}
