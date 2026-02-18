import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  const isAdmin = _request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const books = await prisma.bibleBook.findMany({
      orderBy: { order: "asc" },
      select: { id: true, nameEn: true, nameVi: true, nameZh: true, order: true, chapterCount: true },
    });
    return NextResponse.json(books);
  } catch (e) {
    console.error("bible books list", e);
    return NextResponse.json(
      { error: "Failed to load books." },
      { status: 500 }
    );
  }
}
