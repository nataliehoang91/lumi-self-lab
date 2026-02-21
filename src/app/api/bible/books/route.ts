import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Public: list all Bible books for read/compare (no auth). */
export async function GET() {
  try {
    const books = await prisma.bibleBook.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        nameEn: true,
        nameVi: true,
        nameZh: true,
        order: true,
        chapterCount: true,
      },
    });
    return NextResponse.json(books);
  } catch (e) {
    console.error("bible/books", e);
    return NextResponse.json(
      { error: "Failed to load books." },
      { status: 500 }
    );
  }
}
