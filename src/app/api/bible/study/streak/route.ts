import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const streak = await prisma.userStudyStreak.findUnique({ where: { clerkUserId: userId } });
  if (!streak) return NextResponse.json({ currentStreak: 0, longestStreak: 0, totalDaysStudied: 0 });

  return NextResponse.json({
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    totalDaysStudied: streak.totalDaysStudied,
    lastStudiedDate: streak.lastStudiedDate,
  });
}
