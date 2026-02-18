import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookId = request.nextUrl.searchParams.get("bookId");
  const chapter = request.nextUrl.searchParams.get("chapter");
  const verse = request.nextUrl.searchParams.get("verse");

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

  try {
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
  } catch (e) {
    console.error("verse-content", e);
    return NextResponse.json(
      { error: "Failed to load content." },
      { status: 500 }
    );
  }
}
