import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]/fields/[fieldId]
 * Personal only: get a field. Access by experiment ownership only.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, fieldId } = await params;

    const experiment = await requireExperimentOwner(experimentId, userId);
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
 * Personal only: update a field. Access by experiment ownership only.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, fieldId } = await params;
    const body = await request.json();

    const experiment = await requireExperimentOwner(experimentId, userId);
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
 * Personal only: delete a field. Access by experiment ownership only.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId, fieldId } = await params;

    const experiment = await requireExperimentOwner(experimentId, userId);
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
