import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/fields/[fieldId]
 * Get a specific field
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, fieldId } = await params;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const field = await prisma.experimentField.findFirst({
      where: {
        id: fieldId,
        experimentId,
      },
    });

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    return NextResponse.json(field);
  } catch (error) {
    console.error("Error fetching field:", error);
    return NextResponse.json(
      { error: "Failed to fetch field" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/experiments/[id]/fields/[fieldId]
 * Update a field definition
 * 
 * Body:
 * {
 *   label?: string
 *   type?: string
 *   required?: boolean
 *   order?: number
 *   textType?: string
 *   minValue?: number
 *   maxValue?: number
 *   emojiCount?: number
 *   selectOptions?: string[]
 * }
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, fieldId } = await params;
    const body = await request.json();

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Verify field exists
    const existingField = await prisma.experimentField.findFirst({
      where: {
        id: fieldId,
        experimentId,
      },
    });

    if (!existingField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.label !== undefined) updateData.label = body.label;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.required !== undefined) updateData.required = body.required;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.textType !== undefined) updateData.textType = body.textType || null;
    if (body.minValue !== undefined) updateData.minValue = body.minValue || null;
    if (body.maxValue !== undefined) updateData.maxValue = body.maxValue || null;
    if (body.emojiCount !== undefined) updateData.emojiCount = body.emojiCount || null;
    if (body.selectOptions !== undefined) updateData.selectOptions = body.selectOptions || [];

    const field = await prisma.experimentField.update({
      where: { id: fieldId },
      data: updateData,
    });

    return NextResponse.json(field);
  } catch (error) {
    console.error("Error updating field:", error);
    return NextResponse.json(
      { error: "Failed to update field" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/experiments/[id]/fields/[fieldId]
 * Delete a field (cascade deletes all responses)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, fieldId } = await params;

    // Verify experiment ownership
    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Verify field exists
    const existingField = await prisma.experimentField.findFirst({
      where: {
        id: fieldId,
        experimentId,
      },
    });

    if (!existingField) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    await prisma.experimentField.delete({
      where: { id: fieldId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting field:", error);
    return NextResponse.json(
      { error: "Failed to delete field" },
      { status: 500 }
    );
  }
}
