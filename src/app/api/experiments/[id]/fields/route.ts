import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/fields
 * Get all fields for an experiment
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
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const fields = await prisma.experimentField.findMany({
      where: { experimentId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(fields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json(
      { error: "Failed to fetch fields" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/experiments/[id]/fields
 * Create a new field for an experiment
 * 
 * Body:
 * {
 *   label: string
 *   type: string
 *   required?: boolean
 *   order: number
 *   textType?: string (short | long)
 *   minValue?: number
 *   maxValue?: number
 *   emojiCount?: number (3 | 5 | 7)
 *   selectOptions?: string[]
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
    const { label, type, required, order, textType, minValue, maxValue, emojiCount, selectOptions } = body;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    if (!label || !type || order === undefined) {
      return NextResponse.json(
        { error: "Label, type, and order are required" },
        { status: 400 }
      );
    }

    const field = await prisma.experimentField.create({
      data: {
        experimentId,
        label,
        type,
        required: required || false,
        order,
        textType: textType || null,
        minValue: minValue || null,
        maxValue: maxValue || null,
        emojiCount: emojiCount || null,
        selectOptions: selectOptions || [],
      },
    });

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error("Error creating field:", error);
    return NextResponse.json(
      { error: "Failed to create field" },
      { status: 500 }
    );
  }
}
