import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/bible/admin/flashcard-sets
 * List all flash card sets for admin (e.g. set selector dropdown). Admin only.
 */
export async function GET(request: NextRequest) {
  const isAdmin = request.cookies.get("is_admin")?.value === "true";
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sets = await prisma.flashCardSet.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, sortOrder: true },
    });
    return NextResponse.json(sets);
  } catch (e) {
    console.error("flashcard-sets", e);
    return NextResponse.json(
      { error: "Failed to fetch flash card sets." },
      { status: 500 }
    );
  }
}
