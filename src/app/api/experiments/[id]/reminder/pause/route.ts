/**
 * Phase R.3 — POST pause reminders for this experiment.
 * Auth: requireExperimentOwner. Upsert reminder, set pausedAt = now().
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

    const now = new Date();
    await prisma.experimentReminder.upsert({
      where: { experimentId },
      create: { experimentId, pausedAt: now, updatedAt: now },
      update: { pausedAt: now, updatedAt: now },
    });

    return NextResponse.json({
      paused: true,
      pausedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Error pausing reminders:", error);
    return NextResponse.json({ error: "Failed to pause reminders" }, { status: 500 });
  }
}
