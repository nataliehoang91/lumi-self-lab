/**
 * Phase A.3 — Review Result (READ-ONLY, NON-AI)
 *
 * Aggregates experiment metadata, stats, review summary, and review trends
 * into one response for the Review screen.
 * No Prisma schema changes. No writes. Ownership: requireExperimentOwner(experimentId, userId).
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { reviewResultResponseSchema } from "@/lib/review-result-schema";
import { computeReviewSummaryFields } from "@/lib/review-summary";
import { computeReviewTrendsFields } from "@/lib/review-trends";

const MS_PER_DAY = 86400000;

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

    const owned = await requireExperimentOwner(experimentId, userId);
    if (!owned) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
      include: {
        fields: { orderBy: { order: "asc" } },
        checkIns: {
          orderBy: { checkInDate: "asc" },
          include: {
            responses: { include: { field: true } },
          },
        },
      },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const totalCheckIns = experiment.checkIns.length;
    const daysCovered =
      totalCheckIns === 0
        ? 0
        : Math.floor(
            (experiment.checkIns[totalCheckIns - 1].checkInDate.getTime() -
              experiment.checkIns[0].checkInDate.getTime()) /
              MS_PER_DAY
          ) + 1;

    const durationDays = experiment.durationDays;
    const completionRate =
      durationDays != null && durationDays > 0
        ? Math.min(1, totalCheckIns / durationDays)
        : undefined;

    const generatedAt = new Date().toISOString();

    const summary = {
      experimentId,
      generatedAt,
      fields: computeReviewSummaryFields(experiment),
    };

    const trends = {
      experimentId,
      generatedAt,
      fields: computeReviewTrendsFields(experiment),
    };

    const payload = {
      experiment: {
        id: experiment.id,
        title: experiment.title,
        hypothesis: experiment.hypothesis,
        whyMatters: experiment.whyMatters,
        status: experiment.status,
        startedAt: experiment.startedAt?.toISOString() ?? null,
        completedAt: experiment.completedAt?.toISOString() ?? null,
      },
      stats: {
        totalCheckIns,
        daysCovered,
        ...(completionRate !== undefined && { completionRate }),
      },
      summary,
      trends,
      generatedAt,
    };

    const parsed = reviewResultResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("Review result validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Internal error building review result" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Error fetching review result:", error);
    return NextResponse.json(
      { error: "Failed to fetch review result" },
      { status: 500 }
    );
  }
}
