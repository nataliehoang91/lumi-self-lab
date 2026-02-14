/**
 * Phase A.2 — Review Trends (READ-ONLY)
 *
 * Tables read: Experiment, ExperimentField, ExperimentCheckIn, ExperimentFieldResponse.
 * No Prisma schema changes. No writes. Ownership: requireExperimentOwner(experimentId, userId).
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { reviewTrendsResponseSchema } from "@/lib/review-trends-schema";
import { computeReviewTrendsFields } from "@/lib/review-trends";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const fields = computeReviewTrendsFields(experiment);

    const payload = {
      experimentId,
      generatedAt: new Date().toISOString(),
      fields,
    };

    const parsed = reviewTrendsResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("Review trends validation failed:", parsed.error);
      return NextResponse.json({ error: "Internal error building review trends" }, { status: 500 });
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Error fetching review trends:", error);
    return NextResponse.json({ error: "Failed to fetch review trends" }, { status: 500 });
  }
}
