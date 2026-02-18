import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VERSIONS = ["KJV", "NIV", "VIE1923"] as const;

export async function POST(request: NextRequest) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { book, chapter, verse, content, version } = body as {
      book?: string;
      chapter?: number;
      verse?: number;
      content?: string;
      version?: string;
    };

    if (
      typeof book !== "string" ||
      !book.trim() ||
      typeof chapter !== "number" ||
      chapter < 1 ||
      typeof verse !== "number" ||
      verse < 1 ||
      typeof content !== "string" ||
      !content.trim() ||
      !version ||
      !VERSIONS.includes(version as (typeof VERSIONS)[number])
    ) {
      return NextResponse.json(
        { error: "Invalid book, chapter, verse, content, or version." },
        { status: 400 }
      );
    }

    await prisma.flashVerse.create({
      data: {
        book: book.trim(),
        chapter,
        verse,
        content: content.trim(),
        version,
        language: version === "VIE1923" ? "vi" : "en",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("add-verse", e);
    return NextResponse.json({ error: "Failed to save verse." }, { status: 500 });
  }
}
