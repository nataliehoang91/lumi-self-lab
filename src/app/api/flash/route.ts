import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const verses = await prisma.flashVerse.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json(verses);
  } catch (e) {
    console.error("flash", e);
    return NextResponse.json(
      { error: "Failed to fetch verses." },
      { status: 500 }
    );
  }
}
