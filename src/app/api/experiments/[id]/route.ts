import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]
 * Get a specific experiment by ID
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

    const { id } = await params;

    const experiment = await prisma.experiment.findFirst({
      where: {
        id,
        userId, // Ensure user can only access their own experiments
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        checkins: {
          orderBy: { checkinDate: "desc" },
          include: {
            responses: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    return NextResponse.json(experiment);
  } catch (error) {
    console.error("Error fetching experiment:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiment" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/experiments/[id]
 * Update an experiment
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.experiment.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const experiment = await prisma.experiment.update({
      where: { id },
      data: {
        title: body.title,
        whyMatters: body.whyMatters,
        hypothesis: body.hypothesis,
        durationDays: body.durationDays,
        frequency: body.frequency,
        faithEnabled: body.faithEnabled,
        scriptureNotes: body.scriptureNotes,
        status: body.status,
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(experiment);
  } catch (error) {
    console.error("Error updating experiment:", error);
    return NextResponse.json(
      { error: "Failed to update experiment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/experiments/[id]
 * Delete an experiment
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.experiment.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    await prisma.experiment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting experiment:", error);
    return NextResponse.json(
      { error: "Failed to delete experiment" },
      { status: 500 }
    );
  }
}
