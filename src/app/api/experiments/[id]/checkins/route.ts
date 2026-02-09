import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { toStartOfDayUTC, startOfNextDayUTC } from "@/lib/date-utils";
import { validateCheckInResponses } from "@/lib/checkin-response-validation";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/checkins
 * Personal only: list check-ins for an experiment. Access by ownership only.
 *
 * Query params:
 * - date: filter by specific date (YYYY-MM-DD format)
 */
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
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get("date");

    const experiment = await requireExperimentOwner(experimentId, userId);
    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const where: Record<string, unknown> & { experimentId: string; checkInDate?: { gte: Date; lt: Date } } = { experimentId };
    if (dateFilter) {
      const startOfDay = toStartOfDayUTC(dateFilter);
      const endExclusive = startOfNextDayUTC(startOfDay);
      where.checkInDate = { gte: startOfDay, lt: endExclusive };
    }

    const checkIns = await prisma.experimentCheckIn.findMany({
      where,
      orderBy: { checkInDate: "desc" },
      include: {
        responses: {
          include: {
            field: true,
          },
        },
      },
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return NextResponse.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experiments/[id]/checkins
 * Personal only: create a check-in for an experiment. Owner only.
 *
 * Body:
 * {
 *   checkInDate: string (ISO date string)
 *   notes?: string
 *   aiSummary?: string
 *   responses: Array<{ fieldId, responseText?, ... }>
 * }
 */
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
    const body = await request.json();
    const { checkInDate, notes, aiSummary, responses } = body;

    const experiment = await requireExperimentOwner(experimentId, userId);
    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Phase 1: check-ins allowed only when experiment is active and started
    if (experiment.status !== "active") {
      return NextResponse.json(
        {
          error: "Check-ins not allowed",
          detail: "You can only add check-ins when the experiment is active. Start the experiment first.",
        },
        { status: 400 }
      );
    }
    if (!experiment.startedAt) {
      return NextResponse.json(
        {
          error: "Check-ins not allowed",
          detail: "The experiment has not been started yet. Use Start experiment to set the start date.",
        },
        { status: 400 }
      );
    }

    if (!checkInDate) {
      return NextResponse.json(
        { error: "checkInDate is required" },
        { status: 400 }
      );
    }

    const normalizedDate = toStartOfDayUTC(checkInDate);
    const endExclusive = startOfNextDayUTC(normalizedDate);

    const existingCheckIn = await prisma.experimentCheckIn.findFirst({
      where: {
        experimentId,
        checkInDate: { gte: normalizedDate, lt: endExclusive },
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: "A check-in already exists for this date." },
        { status: 409 }
      );
    }

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
      responses
    );
    if (validationError) {
      return NextResponse.json(validationError, { status: 400 });
    }

    const checkIn = await prisma.experimentCheckIn.create({
      data: {
        experimentId,
        clerkUserId: userId,
        checkInDate: normalizedDate,
        notes: notes || null,
        aiSummary: aiSummary || null,
        responses: {
          create: responses?.map((response: any) => ({
            fieldId: response.fieldId,
            responseText: response.responseText || null,
            responseNumber: response.responseNumber || null, // For number scale OR emoji ranking (1-based)
            responseBool: response.responseBool ?? null,
            selectedOption: response.selectedOption || null,
            aiFeedback: response.aiFeedback || null,
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

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return NextResponse.json(
      { error: "Failed to create check-in" },
      { status: 500 }
    );
  }
}
