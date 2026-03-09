import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const LANGS = ["vie", "kjv", "niv", "zh"] as const;
type Lang = (typeof LANGS)[number];

/** Public: get verses for a chapter in one language (no auth). */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");
  const chapterParam = searchParams.get("chapter");
  const lang = (searchParams.get("lang") ?? "").toLowerCase() as Lang;

  if (!bookId || !chapterParam || !LANGS.includes(lang)) {
    return NextResponse.json(
      { error: "Missing or invalid bookId, chapter, or lang (vie|kjv|niv|zh)." },
      { status: 400 }
    );
  }
  const chapter = parseInt(chapterParam, 10);
  if (!Number.isFinite(chapter) || chapter < 1) {
    return NextResponse.json({ error: "Invalid chapter." }, { status: 400 });
  }

  try {
    const [book, chapterRow] = await Promise.all([
      prisma.bibleBook.findUnique({
        where: { id: bookId },
        select: { id: true, nameEn: true, nameVi: true, nameZh: true, chapterCount: true },
      }),
      prisma.bibleChapter.findUnique({
        where: { bookId_chapterNumber: { bookId, chapterNumber: chapter } },
        select: { sectionTitle: true, sectionTitleKJV: true, sectionTitleNIV: true },
      }),
    ]);
    if (!book) {
      return NextResponse.json({ error: "Book not found." }, { status: 404 });
    }

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

    const effectiveSectionTitle =
      lang === "kjv"
        ? (chapterRow?.sectionTitleKJV ?? chapterRow?.sectionTitle) ?? null
        : lang === "niv"
          ? (chapterRow?.sectionTitleNIV ?? chapterRow?.sectionTitle) ?? null
          : chapterRow?.sectionTitle ?? null;

    const verses = rows.map((r) => ({
      number: r.verse,
      text: (r[col as keyof typeof r] as string | null)?.trim() ?? "",
    }));

    return NextResponse.json({
      book: {
        id: book.id,
        nameEn: book.nameEn,
        nameVi: book.nameVi,
        nameZh: book.nameZh,
        chapterCount: book.chapterCount,
      },
      chapter,
      verses,
      sectionTitle: effectiveSectionTitle,
    });
  } catch (e) {
    console.error("bible/read", e);
    return NextResponse.json({ error: "Failed to load chapter." }, { status: 500 });
  }
}
