import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function joinContent(parts: (string | null | undefined)[], separator = " "): string | null {
  const trimmed = parts
    .filter((p): p is string => typeof p === "string" && p.trim() !== "")
    .map((p) => p.trim());
  return trimmed.length > 0 ? trimmed.join(separator) : null;
}

export async function GET(request: NextRequest) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookId = request.nextUrl.searchParams.get("bookId");
  const chapter = request.nextUrl.searchParams.get("chapter");
  const verse = request.nextUrl.searchParams.get("verse");
  const verseEndParam = request.nextUrl.searchParams.get("verseEnd");

  if (!bookId || chapter == null || verse == null) {
    return NextResponse.json(
      { error: "bookId, chapter, and verse are required." },
      { status: 400 }
    );
  }

  const chapterNum = parseInt(chapter, 10);
  const verseNum = parseInt(verse, 10);
  if (Number.isNaN(chapterNum) || Number.isNaN(verseNum) || chapterNum < 1 || verseNum < 1) {
    return NextResponse.json({ error: "Invalid chapter or verse." }, { status: 400 });
  }

  const verseEndNum =
    verseEndParam != null && verseEndParam !== ""
      ? parseInt(verseEndParam, 10)
      : null;
  const isRange =
    verseEndNum != null &&
    !Number.isNaN(verseEndNum) &&
    verseEndNum >= verseNum &&
    verseEndNum - verseNum <= 50; // cap range size
  const endVerse = isRange ? verseEndNum! : verseNum;

  try {
    if (endVerse === verseNum) {
      const row = await prisma.bibleVerseContent.findUnique({
        where: {
          bookId_chapter_verse: {
            bookId,
            chapter: chapterNum,
            verse: verseNum,
          },
        },
      });
      return NextResponse.json(row ?? null);
    }

    const rows = await prisma.bibleVerseContent.findMany({
      where: {
        bookId,
        chapter: chapterNum,
        verse: { gte: verseNum, lte: endVerse },
      },
      orderBy: { verse: "asc" },
    });

    if (rows.length === 0) {
      return NextResponse.json(null);
    }

    const combined = {
      contentVIE1923: joinContent(rows.map((r) => r.contentVIE1923)),
      contentKJV: joinContent(rows.map((r) => r.contentKJV)),
      contentNIV: joinContent(rows.map((r) => r.contentNIV)),
      contentZH: joinContent(rows.map((r) => r.contentZH)),
    };
    return NextResponse.json(combined);
  } catch (e) {
    console.error("verse-content", e);
    return NextResponse.json(
      { error: "Failed to load content." },
      { status: 500 }
    );
  }
}
