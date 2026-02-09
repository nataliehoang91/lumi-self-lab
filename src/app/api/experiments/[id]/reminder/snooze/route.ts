/**
 * Phase R.4 — POST snooze reminders until a given time.
 * Auth: requireExperimentOwner. Upsert reminder, set snoozedUntil = body.until.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId } = await params;
    const experiment = await requireExperimentOwner(experimentId, userId);
    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    let body: { until?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const untilRaw =
      typeof body.until === "string" ? body.until.trim() : "";
    if (!untilRaw) {
      return NextResponse.json(
        { error: "until is required (ISO date or datetime)" },
        { status: 400 }
      );
    }

    const until = new Date(untilRaw);
    if (Number.isNaN(until.getTime())) {
      return NextResponse.json(
        { error: "until must be a valid ISO date or datetime" },
        { status: 400 }
      );
    }

    const now = new Date();
    await prisma.experimentReminder.upsert({
      where: { experimentId },
      create: { experimentId, snoozedUntil: until, updatedAt: now },
      update: { snoozedUntil: until, updatedAt: now },
    });

    return NextResponse.json({
      snoozed: true,
      snoozedUntil: until.toISOString(),
    });
  } catch (error) {
    console.error("Error snoozing reminders:", error);
    return NextResponse.json(
      { error: "Failed to snooze reminders" },
      { status: 500 }
    );
  }
}
