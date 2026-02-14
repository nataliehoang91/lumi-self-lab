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
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const where: Record<string, unknown> & {
      experimentId: string;
      checkInDate?: { gte: Date; lt: Date };
    } = { experimentId };
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
    return NextResponse.json({ error: "Failed to fetch check-ins" }, { status: 500 });
  }
}

/**
 * POST /api/experiments/[id]/checkins
 * Phase C: Create or update a check-in for any UTC calendar day (one per experiment per day).
 * Personal only, owner only. If a check-in exists for that date → update (replace responses); else create.
 * Body: checkInDate (required), notes?, aiSummary?, responses.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
          detail:
            "You can only add check-ins when the experiment is active. Start the experiment first.",
        },
        { status: 400 }
      );
    }
    if (!experiment.startedAt) {
      return NextResponse.json(
        {
          error: "Check-ins not allowed",
          detail:
            "The experiment has not been started yet. Use Start experiment to set the start date.",
        },
        { status: 400 }
      );
    }

    if (checkInDate === undefined || checkInDate === null || checkInDate === "") {
      return NextResponse.json({ error: "checkInDate is required" }, { status: 400 });
    }

    const normalizedDate = toStartOfDayUTC(checkInDate);
    if (Number.isNaN(normalizedDate.getTime())) {
      return NextResponse.json({ error: "Invalid checkInDate" }, { status: 400 });
    }

    const endExclusive = startOfNextDayUTC(normalizedDate);

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

    const existingCheckIn = await prisma.experimentCheckIn.findFirst({
      where: {
        experimentId,
        clerkUserId: userId,
        checkInDate: { gte: normalizedDate, lt: endExclusive },
      },
    });

    const responsesData = (Array.isArray(responses) ? responses : []).map((r: any) => ({
      fieldId: r.fieldId,
      responseText: r.responseText ?? null,
      responseNumber: r.responseNumber ?? null,
      responseBool: r.responseBool ?? null,
      selectedOption: r.selectedOption ?? null,
      aiFeedback: r.aiFeedback ?? null,
    }));

    if (existingCheckIn) {
      const updateData: { notes?: string | null; aiSummary?: string | null } = {};
      if (notes !== undefined) updateData.notes = notes ?? null;
      if (aiSummary !== undefined) updateData.aiSummary = aiSummary ?? null;

      await prisma.$transaction(async (tx) => {
        await tx.experimentFieldResponse.deleteMany({
          where: { checkInId: existingCheckIn.id },
        });
        if (Object.keys(updateData).length > 0) {
          await tx.experimentCheckIn.update({
            where: { id: existingCheckIn.id },
            data: updateData,
          });
        }
        if (responsesData.length > 0) {
          await tx.experimentFieldResponse.createMany({
            data: responsesData.map((r) => ({
              checkInId: existingCheckIn.id,
              fieldId: r.fieldId,
              responseText: r.responseText,
              responseNumber: r.responseNumber,
              responseBool: r.responseBool,
              selectedOption: r.selectedOption,
              aiFeedback: r.aiFeedback,
            })),
          });
        }
      });

      const updated = await prisma.experimentCheckIn.findUnique({
        where: { id: existingCheckIn.id },
        include: {
          responses: {
            include: { field: true },
          },
        },
      });
      return NextResponse.json(updated);
    }

    const checkIn = await prisma.experimentCheckIn.create({
      data: {
        experimentId,
        clerkUserId: userId,
        checkInDate: normalizedDate,
        notes: notes ?? null,
        aiSummary: aiSummary ?? null,
        responses: {
          create: responsesData.map((r) => ({
            fieldId: r.fieldId,
            responseText: r.responseText,
            responseNumber: r.responseNumber,
            responseBool: r.responseBool,
            selectedOption: r.selectedOption,
            aiFeedback: r.aiFeedback,
          })),
        },
      },
      include: {
        responses: {
          include: { field: true },
        },
      },
    });

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return NextResponse.json({ error: "Failed to create check-in" }, { status: 500 });
  }
}
