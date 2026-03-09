import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/bible/verses/[id]
 * Returns one flash verse by id (read-only, for flashcard display).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const verse = await prisma.flashVerse.findUnique({
      where: { id },
    });
    if (!verse) {
      return NextResponse.json({ error: "Verse not found." }, { status: 404 });
    }
    return NextResponse.json({
      id: verse.id,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      verseEnd: verse.verseEnd,
      titleEn: verse.titleEn,
      titleVi: verse.titleVi,
      titleZh: verse.titleZh,
      referenceLabelEn: verse.referenceLabelEn,
      referenceLabelVi: verse.referenceLabelVi,
      referenceLabelZh: verse.referenceLabelZh,
      contentVIE1923: verse.contentVIE1923,
      contentKJV: verse.contentKJV,
      contentNIV: verse.contentNIV,
      contentZH: verse.contentZH,
      contentDisplayVIE: verse.contentDisplayVIE,
      contentDisplayKJV: verse.contentDisplayKJV,
      contentDisplayNIV: verse.contentDisplayNIV,
      contentDisplayZH: verse.contentDisplayZH,
      content: verse.content,
      version: verse.version,
      language: verse.language,
      createdAt: verse.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("bible/verses/[id]", e);
    return NextResponse.json({ error: "Failed to fetch verse." }, { status: 500 });
  }
}
