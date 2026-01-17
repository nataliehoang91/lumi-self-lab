import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/checkins
 * Get all check-ins for an experiment
 * 
 * Query params:
 * - date: filter by specific date (YYYY-MM-DD format)
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
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get("date");

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const where: any = { experimentId };
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
      where.checkInDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
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
 * Create a new check-in for an experiment
 * 
 * Body:
 * {
 *   checkInDate: string (ISO date string)
 *   notes?: string
 *   aiSummary?: string
 *   responses: Array<{
 *     fieldId: string
 *     responseText?: string
 *     responseNumber?: number
 *     responseEmoji?: string
 *     responseBool?: boolean
 *     selectedOption?: string
 *     aiFeedback?: string
 *   }>
 * }
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
    const { checkInDate, notes, aiSummary, responses } = body;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    if (!checkInDate) {
      return NextResponse.json(
        { error: "checkInDate is required" },
        { status: 400 }
      );
    }

    // Check if check-in already exists for this date
    const existingCheckIn = await prisma.experimentCheckIn.findFirst({
      where: {
        experimentId,
        checkInDate: new Date(checkInDate),
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: "Check-in already exists for this date" },
        { status: 409 }
      );
    }

    // Create check-in with responses
    const checkIn = await prisma.experimentCheckIn.create({
      data: {
        experimentId,
        clerkUserId: userId,
        checkInDate: new Date(checkInDate),
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
