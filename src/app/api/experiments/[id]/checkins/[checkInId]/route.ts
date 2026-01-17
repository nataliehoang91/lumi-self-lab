import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/checkins/[checkInId]
 * Get a specific check-in
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, checkInId } = await params;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const checkIn = await prisma.experimentCheckIn.findFirst({
      where: {
        id: checkInId,
        experimentId,
        clerkUserId: userId,
      },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    if (!checkIn) {
      return NextResponse.json({ error: "Check-in not found" }, { status: 404 });
    }

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error("Error fetching check-in:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-in" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/experiments/[id]/checkins/[checkInId]
 * Update a check-in
 * 
 * Body:
 * {
 *   checkInDate?: string
 *   notes?: string
 *   aiSummary?: string
 *   responses?: Array<{...}> (upsert logic)
 * }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, checkInId } = await params;
    const body = await request.json();

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Verify check-in exists and belongs to user
    const existingCheckIn = await prisma.experimentCheckIn.findFirst({
      where: {
        id: checkInId,
        experimentId,
        clerkUserId: userId,
      },
    });

    if (!existingCheckIn) {
      return NextResponse.json({ error: "Check-in not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.checkInDate !== undefined) updateData.checkInDate = new Date(body.checkInDate);
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.aiSummary !== undefined) updateData.aiSummary = body.aiSummary || null;

    // Handle responses update (upsert logic)
    if (body.responses !== undefined) {
      // Delete responses that are not in the new list
      const existingResponseIds = body.responses
        .map((r: any) => r.id)
        .filter(Boolean);
      
      await prisma.experimentFieldResponse.deleteMany({
        where: {
          checkInId,
          id: { notIn: existingResponseIds },
        },
      });

      // Upsert responses
      for (const response of body.responses) {
        const responseData = {
          fieldId: response.fieldId,
          responseText: response.responseText || null,
          responseNumber: response.responseNumber || null, // For number scale OR emoji ranking (1-based)
          responseBool: response.responseBool ?? null,
          selectedOption: response.selectedOption || null,
          aiFeedback: response.aiFeedback || null,
        };

        if (response.id) {
          // Update existing response
          await prisma.experimentFieldResponse.update({
            where: { id: response.id },
            data: responseData,
          });
        } else {
          // Create new response
          await prisma.experimentFieldResponse.create({
            data: {
              ...responseData,
              checkInId,
            },
          });
        }
      }
    }

    // Update check-in
    const checkIn = await prisma.experimentCheckIn.update({
      where: { id: checkInId },
      data: updateData,
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error("Error updating check-in:", error);
    return NextResponse.json(
      { error: "Failed to update check-in" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/experiments/[id]/checkins/[checkInId]
 * Delete a check-in (cascade deletes all responses)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, checkInId } = await params;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Verify check-in exists and belongs to user
    const existingCheckIn = await prisma.experimentCheckIn.findFirst({
      where: {
        id: checkInId,
        experimentId,
        clerkUserId: userId,
      },
    });

    if (!existingCheckIn) {
      return NextResponse.json({ error: "Check-in not found" }, { status: 404 });
    }

    await prisma.experimentCheckIn.delete({
      where: { id: checkInId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting check-in:", error);
    return NextResponse.json(
      { error: "Failed to delete check-in" },
      { status: 500 }
    );
  }
}
