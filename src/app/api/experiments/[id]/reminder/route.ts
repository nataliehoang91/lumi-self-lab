/**
 * Phase R.3 + R.4 — GET reminder state (paused, snoozed).
 * Auth: requireExperimentOwner. No change to experiment lifecycle.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET(
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

    const reminder = await prisma.experimentReminder.findUnique({
      where: { experimentId },
      select: { pausedAt: true, snoozedUntil: true },
    });

    const now = new Date();
    const paused = reminder?.pausedAt != null;
    const snoozedUntil = reminder?.snoozedUntil?.toISOString() ?? null;
    const snoozed =
      reminder?.snoozedUntil != null && now < reminder.snoozedUntil;

    return NextResponse.json({
      paused,
      pausedAt: reminder?.pausedAt?.toISOString() ?? null,
      snoozed,
      snoozedUntil,
    });
  } catch (error) {
    console.error("Error fetching reminder state:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminder state" },
      { status: 500 }
    );
  }
}
