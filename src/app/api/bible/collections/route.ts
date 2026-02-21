import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/bible/collections
 * List all flash card collections (for selector on flashcard page). Public read.
 */
export async function GET() {
  try {
    const collections = await prisma.flashCardCollection.findMany({
      orderBy: { sortOrder: "desc" },
      select: { id: true, name: true, sortOrder: true },
    });
    return NextResponse.json(collections);
  } catch (e) {
    console.error("bible/collections", e);
    return NextResponse.json(
      { error: "Failed to fetch collections." },
      { status: 500 }
    );
  }
}
