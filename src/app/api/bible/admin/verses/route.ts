import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const verses = await prisma.flashVerse.findMany({
      orderBy: [
        { flashCardCollection: { name: "asc" } },
        { createdAt: "desc" },
      ],
      include: {
        flashCardSet: { select: { id: true, name: true } },
        flashCardCollection: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json(verses);
  } catch (e) {
    console.error("verses list", e);
    return NextResponse.json(
      { error: "Failed to fetch verses." },
      { status: 500 }
    );
  }
}
