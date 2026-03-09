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
      include: {
        bibleBook: true,
        flashCardSet: { select: { id: true, name: true } },
        flashCardCollection: { select: { id: true, name: true } },
      },
    });
    if (!verse) {
      return NextResponse.json({ error: "Verse not found." }, { status: 404 });
    }
    return NextResponse.json(verse);
  } catch (e) {
    console.error("verse get", e);
    return NextResponse.json({ error: "Failed to fetch verse." }, { status: 500 });
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
      verseEnd,
      referenceLabelEn,
      referenceLabelVi,
      referenceLabelZh,
      contentVIE1923,
      contentKJV,
      contentNIV,
      contentZH,
      contentDisplayVIE,
      contentDisplayKJV,
      contentDisplayNIV,
      contentDisplayZH,
      flashCardSetId,
    } = body as {
      bookId?: string;
      chapter?: number;
      verse?: number;
      verseEnd?: number | null;
      referenceLabelEn?: string | null;
      referenceLabelVi?: string | null;
      referenceLabelZh?: string | null;
      contentVIE1923?: string;
      contentKJV?: string;
      contentNIV?: string;
      contentZH?: string;
      contentDisplayVIE?: string | null;
      contentDisplayKJV?: string | null;
      contentDisplayNIV?: string | null;
      contentDisplayZH?: string | null;
      flashCardSetId?: string | null;
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
        {
          error:
            "At least one version content (Vietnamese, KJV, NIV, or Chinese) is required.",
        },
        { status: 400 }
      );
    }

    const setId =
      flashCardSetId === null || flashCardSetId === ""
        ? null
        : typeof flashCardSetId === "string" && flashCardSetId.trim()
          ? flashCardSetId.trim()
          : undefined;
    if (setId !== undefined && setId !== null) {
      const setExists = await prisma.flashCardSet.findUnique({ where: { id: setId } });
      if (!setExists) {
        return NextResponse.json({ error: "Invalid flash card set." }, { status: 400 });
      }
    }

    const contentFallback = trimNIV || trimKJV || trimVI || trimZH;
    const verseRef =
      verseEnd != null && verseEnd > verse
        ? `${chapter}:${verse}-${verseEnd}`
        : `${chapter}:${verse}`;

    await prisma.flashVerse.update({
      where: { id },
      data: {
        ...(setId !== undefined && { flashCardSetId: setId }),
        bookId: bibleBook.id,
        book: bibleBook.nameEn,
        chapter,
        verse,
        verseEnd:
          verseEnd != null && Number.isFinite(verseEnd) && verseEnd > verse ? verseEnd : null,
        titleEn: `${bibleBook.nameEn} ${verseRef}`,
        titleVi: `${bibleBook.nameVi} ${verseRef}`,
        titleZh: bibleBook.nameZh ? `${bibleBook.nameZh} ${verseRef}` : null,
        referenceLabelEn:
          referenceLabelEn !== undefined
            ? (typeof referenceLabelEn === "string" ? referenceLabelEn.trim() || null : null)
            : undefined,
        referenceLabelVi:
          referenceLabelVi !== undefined
            ? (typeof referenceLabelVi === "string" ? referenceLabelVi.trim() || null : null)
            : undefined,
        referenceLabelZh:
          referenceLabelZh !== undefined
            ? (typeof referenceLabelZh === "string" ? referenceLabelZh.trim() || null : null)
            : undefined,
        contentVIE1923: trimVI || null,
        contentKJV: trimKJV || null,
        contentNIV: trimNIV || null,
        contentZH: trimZH || null,
        contentDisplayVIE:
          contentDisplayVIE !== undefined
            ? (typeof contentDisplayVIE === "string" ? contentDisplayVIE.trim() || null : null)
            : undefined,
        contentDisplayKJV:
          contentDisplayKJV !== undefined
            ? (typeof contentDisplayKJV === "string" ? contentDisplayKJV.trim() || null : null)
            : undefined,
        contentDisplayNIV:
          contentDisplayNIV !== undefined
            ? (typeof contentDisplayNIV === "string" ? contentDisplayNIV.trim() || null : null)
            : undefined,
        contentDisplayZH:
          contentDisplayZH !== undefined
            ? (typeof contentDisplayZH === "string" ? contentDisplayZH.trim() || null : null)
            : undefined,
        content: contentFallback,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("verse update", e);
    return NextResponse.json({ error: "Failed to update verse." }, { status: 500 });
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
    return NextResponse.json({ error: "Failed to delete verse." }, { status: 500 });
  }
}
