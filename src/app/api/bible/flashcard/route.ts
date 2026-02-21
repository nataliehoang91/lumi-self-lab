import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/bible/flashcard?page=1&limit=50
 * Returns paginated list of flash verse ids and metadata (no verse content).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(500, Math.max(1, Number(searchParams.get("limit")) || 50));
    const skip = (page - 1) * limit;

    const [ids, total] = await Promise.all([
      prisma.flashVerse.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: { id: true },
      }).then((rows) => rows.map((r) => r.id)),
      prisma.flashVerse.count(),
    ]);

    return NextResponse.json({
      ids,
      count: ids.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (e) {
    console.error("bible/flashcard list", e);
    return NextResponse.json(
      { error: "Failed to fetch flashcard list." },
      { status: 500 }
    );
  }
}
