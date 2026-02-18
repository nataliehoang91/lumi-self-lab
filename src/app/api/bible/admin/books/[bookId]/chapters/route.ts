import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const isAdmin = _request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookId } = await params;
  try {
    const chapters = await prisma.bibleChapter.findMany({
      where: { bookId },
      orderBy: { chapterNumber: "asc" },
      select: { chapterNumber: true, verseCount: true },
    });
    return NextResponse.json(chapters);
  } catch (e) {
    console.error("bible chapters", e);
    return NextResponse.json(
      { error: "Failed to load chapters." },
      { status: 500 }
    );
  }
}
