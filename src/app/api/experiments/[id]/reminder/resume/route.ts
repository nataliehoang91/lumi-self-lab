/**
 * Phase R.3 — POST resume reminders for this experiment.
 * Auth: requireExperimentOwner. Set pausedAt = null.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    await prisma.experimentReminder.upsert({
      where: { experimentId },
      create: { experimentId, pausedAt: null, updatedAt: new Date() },
      update: { pausedAt: null, updatedAt: new Date() },
    });

    return NextResponse.json({
      paused: false,
      pausedAt: null,
    });
  } catch (error) {
    console.error("Error resuming reminders:", error);
    return NextResponse.json({ error: "Failed to resume reminders" }, { status: 500 });
  }
}
