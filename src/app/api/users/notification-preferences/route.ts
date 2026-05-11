/**
 * GET  /api/users/notification-preferences — returns { reminderEmailEnabled, reminderTimeSlot }
 * PATCH /api/users/notification-preferences — updates notification prefs for the authenticated user
 *
 * Note: reminderEmailEnabled / reminderTimeSlot are new User columns not yet in the generated
 * Prisma client. After running `prisma generate` the casts can be removed.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/permissions";

const VALID_SLOTS = ["morning", "afternoon", "evening"];

type UserPrefs = {
  reminderEmailEnabled: boolean;
  reminderTimeSlot: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user: UserPrefs | null = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { reminderEmailEnabled: true, reminderTimeSlot: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { reminderEmailEnabled, reminderTimeSlot } = body as {
    reminderEmailEnabled?: boolean;
    reminderTimeSlot?: string;
  };

  if (reminderTimeSlot !== undefined && !VALID_SLOTS.includes(reminderTimeSlot)) {
    return NextResponse.json(
      { error: "reminderTimeSlot must be morning, afternoon, or evening" },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (reminderEmailEnabled !== undefined) data.reminderEmailEnabled = reminderEmailEnabled;
  if (reminderTimeSlot !== undefined) data.reminderTimeSlot = reminderTimeSlot;

  const user: UserPrefs = await db.user.update({
    where: { clerkUserId: userId },
    data,
    select: { reminderEmailEnabled: true, reminderTimeSlot: true },
  });

  return NextResponse.json(user);
}
