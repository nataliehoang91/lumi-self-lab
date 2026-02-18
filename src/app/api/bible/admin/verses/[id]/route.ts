import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = _request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const verse = await prisma.flashVerse.findUnique({
      where: { id },
      include: { bibleBook: true },
    });
    if (!verse) {
      return NextResponse.json({ error: "Verse not found." }, { status: 404 });
    }
    return NextResponse.json(verse);
  } catch (e) {
    console.error("verse get", e);
    return NextResponse.json(
      { error: "Failed to fetch verse." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const {
      bookId,
      chapter,
      verse,
      contentVIE1923,
      contentKJV,
      contentNIV,
      contentZH,
    } = body as {
      bookId?: string;
      chapter?: number;
      verse?: number;
      contentVIE1923?: string;
      contentKJV?: string;
      contentNIV?: string;
      contentZH?: string;
    };

    if (
      typeof bookId !== "string" ||
      !bookId.trim() ||
      typeof chapter !== "number" ||
      chapter < 1 ||
      typeof verse !== "number" ||
      verse < 1
    ) {
      return NextResponse.json(
        { error: "Invalid book, chapter, or verse." },
        { status: 400 }
      );
    }

    const bibleBook = await prisma.bibleBook.findUnique({
      where: { id: bookId },
    });
    if (!bibleBook) {
      return NextResponse.json({ error: "Book not found." }, { status: 400 });
    }
    if (chapter > bibleBook.chapterCount) {
      return NextResponse.json(
        { error: `Chapter must be 1–${bibleBook.chapterCount} for ${bibleBook.nameEn}.` },
        { status: 400 }
      );
    }

    const trimVI = typeof contentVIE1923 === "string" ? contentVIE1923.trim() : "";
    const trimKJV = typeof contentKJV === "string" ? contentKJV.trim() : "";
    const trimNIV = typeof contentNIV === "string" ? contentNIV.trim() : "";
    const trimZH = typeof contentZH === "string" ? contentZH.trim() : "";
    const hasContent = trimVI !== "" || trimKJV !== "" || trimNIV !== "" || trimZH !== "";

    if (!hasContent) {
      return NextResponse.json(
        { error: "At least one version content (Vietnamese, KJV, NIV, or Chinese) is required." },
        { status: 400 }
      );
    }

    const contentFallback = trimNIV || trimKJV || trimVI || trimZH;

    await prisma.flashVerse.update({
      where: { id },
      data: {
        bookId: bibleBook.id,
        book: bibleBook.nameEn,
        chapter,
        verse,
        titleEn: `${bibleBook.nameEn} ${chapter}:${verse}`,
        titleVi: `${bibleBook.nameVi} ${chapter}:${verse}`,
        titleZh: bibleBook.nameZh ? `${bibleBook.nameZh} ${chapter}:${verse}` : null,
        contentVIE1923: trimVI || null,
        contentKJV: trimKJV || null,
        contentNIV: trimNIV || null,
        contentZH: trimZH || null,
        content: contentFallback,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("verse update", e);
    return NextResponse.json(
      { error: "Failed to update verse." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = _request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.flashVerse.delete({
      where: { id },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("verse delete", e);
    return NextResponse.json(
      { error: "Failed to delete verse." },
      { status: 500 }
    );
  }
}
