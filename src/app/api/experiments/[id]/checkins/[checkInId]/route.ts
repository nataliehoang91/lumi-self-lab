import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { toStartOfDayUTC, startOfNextDayUTC } from "@/lib/date-utils";
import { validateCheckInResponses } from "@/lib/checkin-response-validation";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/checkins/[checkInId]
 * Personal only: get a check-in. Access by experiment ownership only.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, checkInId } = await params;

    const experiment = await requireExperimentOwner(experimentId, userId);
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
 * Personal only: update a check-in. Access by experiment ownership only.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, checkInId } = await params;
    const body = await request.json();

    const experiment = await requireExperimentOwner(experimentId, userId);
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

    const updateData: Record<string, unknown> = {};
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.aiSummary !== undefined) updateData.aiSummary = body.aiSummary || null;

    if (body.checkInDate !== undefined) {
      const normalizedDate = toStartOfDayUTC(body.checkInDate);
      const endExclusive = startOfNextDayUTC(normalizedDate);
      const otherOnSameDay = await prisma.experimentCheckIn.findFirst({
        where: {
          experimentId,
          id: { not: checkInId },
          checkInDate: { gte: normalizedDate, lt: endExclusive },
        },
      });
      if (otherOnSameDay) {
        return NextResponse.json(
          { error: "A check-in already exists for this date." },
          { status: 409 }
        );
      }
      updateData.checkInDate = normalizedDate;
    }

    // Handle responses update (upsert logic)
    if (body.responses !== undefined) {
      const fields = await prisma.experimentField.findMany({
        where: { experimentId },
        orderBy: { order: "asc" },
      });
      const validationError = validateCheckInResponses(
        fields.map((f) => ({
          id: f.id,
          type: f.type,
          required: f.required,
          minValue: f.minValue,
          maxValue: f.maxValue,
          emojiCount: f.emojiCount,
          selectOptions: f.selectOptions ?? [],
        })),
        body.responses
      );
      if (validationError) {
        return NextResponse.json(validationError, { status: 400 });
      }

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
 * Personal only: delete a check-in. Access by experiment ownership only.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; checkInId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, checkInId } = await params;

    const experiment = await requireExperimentOwner(experimentId, userId);
    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

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
