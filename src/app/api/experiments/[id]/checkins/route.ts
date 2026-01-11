import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/experiments/[id]/checkins
 * Create a new check-in for an experiment
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId } = await params;
    const body = await request.json();
    const { responses, notes, aiSummary } = body;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Create check-in with responses
    const checkin = await prisma.experimentCheckin.create({
      data: {
        experimentId,
        userId,
        checkinDate: new Date(),
        notes,
        aiSummary,
        responses: {
          create: responses?.map((response: any) => ({
            fieldId: response.fieldId,
            responseText: response.responseText,
            responseNumber: response.responseNumber,
            responseEmoji: response.responseEmoji,
            responseBool: response.responseBool,
            selectedOption: response.selectedOption,
            aiFeedback: response.aiFeedback,
          })) || [],
        },
      },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    return NextResponse.json(checkin, { status: 201 });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return NextResponse.json(
      { error: "Failed to create check-in" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/experiments/[id]/checkins
 * Get all check-ins for an experiment
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId } = await params;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const checkins = await prisma.experimentCheckin.findMany({
      where: { experimentId },
      orderBy: { checkinDate: "desc" },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    return NextResponse.json(checkins);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}
