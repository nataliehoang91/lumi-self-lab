import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]
 * Get a specific experiment by ID with all fields and check-ins
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
        clerkUserId: userId, // Ensure user can only access their own experiments
      },
      include: {
        fields: {
          orderBy: { order: "asc" },
        },
        checkIns: {
          orderBy: { checkInDate: "desc" },
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
 * 
 * Body:
 * {
 *   title?: string
 *   whyMatters?: string
 *   hypothesis?: string
 *   durationDays?: number
 *   frequency?: string
 *   faithEnabled?: boolean
 *   scriptureNotes?: string
 *   status?: string
 *   fields?: Array<{...}> (upsert logic)
 * }
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
      where: { id, clerkUserId: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.whyMatters !== undefined) updateData.whyMatters = body.whyMatters;
    if (body.hypothesis !== undefined) updateData.hypothesis = body.hypothesis;
    if (body.durationDays !== undefined) updateData.durationDays = body.durationDays;
    if (body.frequency !== undefined) updateData.frequency = body.frequency;
    if (body.faithEnabled !== undefined) updateData.faithEnabled = body.faithEnabled;
    if (body.scriptureNotes !== undefined) updateData.scriptureNotes = body.scriptureNotes;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startedAt !== undefined) updateData.startedAt = body.startedAt ? new Date(body.startedAt) : null;
    if (body.completedAt !== undefined) updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;

    // Handle fields update (upsert logic)
    if (body.fields !== undefined) {
      // Delete fields that are not in the new list
      const existingFieldIds = body.fields
        .map((f: any) => f.id)
        .filter(Boolean);
      
      await prisma.experimentField.deleteMany({
        where: {
          experimentId: id,
          id: { notIn: existingFieldIds },
        },
      });

      // Upsert fields
      for (const field of body.fields) {
        const fieldData = {
          label: field.label,
          type: field.type,
          required: field.required || false,
          order: field.order,
          textType: field.textType || null,
          minValue: field.minValue || null,
          maxValue: field.maxValue || null,
          emojiCount: field.emojiCount || null,
          selectOptions: field.selectOptions || [],
        };

        if (field.id) {
          // Update existing field
          await prisma.experimentField.update({
            where: { id: field.id },
            data: fieldData,
          });
        } else {
          // Create new field
          await prisma.experimentField.create({
            data: {
              ...fieldData,
              experimentId: id,
            },
          });
        }
      }
    }

    // Update experiment
    const experiment = await prisma.experiment.update({
      where: { id },
      data: updateData,
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
 * Delete an experiment (cascade deletes all fields and check-ins)
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
      where: { id, clerkUserId: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Delete experiment (fields and check-ins cascade automatically)
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
