import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      book,
      chapter,
      verse,
      titleEn,
      titleVi,
      contentVIE1923,
      contentKJV,
      contentNIV,
    } = body as {
      book?: string;
      chapter?: number;
      verse?: number;
      titleEn?: string;
      titleVi?: string;
      contentVIE1923?: string;
      contentKJV?: string;
      contentNIV?: string;
    };

    if (
      typeof book !== "string" ||
      !book.trim() ||
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

    const trimVI = typeof contentVIE1923 === "string" ? contentVIE1923.trim() : "";
    const trimKJV = typeof contentKJV === "string" ? contentKJV.trim() : "";
    const trimNIV = typeof contentNIV === "string" ? contentNIV.trim() : "";
    const hasContent = trimVI !== "" || trimKJV !== "" || trimNIV !== "";

    if (!hasContent) {
      return NextResponse.json(
        { error: "At least one version content (Vietnamese, KJV, or NIV) is required." },
        { status: 400 }
      );
    }

    const contentFallback = trimNIV || trimKJV || trimVI;

    await prisma.flashVerse.create({
      data: {
        book: book.trim(),
        chapter,
        verse,
        titleEn: typeof titleEn === "string" ? titleEn.trim() || null : null,
        titleVi: typeof titleVi === "string" ? titleVi.trim() || null : null,
        contentVIE1923: trimVI || null,
        contentKJV: trimKJV || null,
        contentNIV: trimNIV || null,
        content: contentFallback,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("add-verse", e);
    return NextResponse.json(
      { error: "Failed to save verse." },
      { status: 500 }
    );
  }
}
