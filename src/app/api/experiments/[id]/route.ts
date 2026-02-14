import { prisma } from "@/lib/prisma";
import {
  getAuthenticatedUserId,
  requireExperimentOwner,
  experimentHasCheckIns,
} from "@/lib/permissions";
import { NextResponse } from "next/server";

/**
 * GET /api/experiments/[id]
 * Personal only: get experiment by ID. Access only if current user owns it
 * (clerkUserId). No org/manager role grants access.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Personal only: access by ownership (clerkUserId) only.
    const experiment = await prisma.experiment.findFirst({
      where: { id, clerkUserId: userId },
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
    return NextResponse.json({ error: "Failed to fetch experiment" }, { status: 500 });
  }
}

/**
 * PATCH /api/experiments/[id]
 * Personal only: update experiment. Ownership (clerkUserId) is immutable.
 * organisationId is not accepted here; use future link/unlink API when implemented.
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
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await requireExperimentOwner(id, userId);
    if (!existing) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Ownership is immutable: never accept clerkUserId. organisationId deferred to link API.
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.whyMatters !== undefined) updateData.whyMatters = body.whyMatters;
    if (body.hypothesis !== undefined) updateData.hypothesis = body.hypothesis;
    if (body.durationDays !== undefined) updateData.durationDays = body.durationDays;
    if (body.frequency !== undefined) updateData.frequency = body.frequency;
    if (body.faithEnabled !== undefined) updateData.faithEnabled = body.faithEnabled;
    if (body.scriptureNotes !== undefined) updateData.scriptureNotes = body.scriptureNotes;

    // Phase 1: enforce status lifecycle (draft → active → completed only)
    if (body.status !== undefined) {
      const currentStatus = existing.status;
      const newStatus = body.status as string;

      const allowedTransitions: Record<string, string[]> = {
        draft: ["active"],
        active: ["completed"],
        completed: [],
      };
      const allowed =
        allowedTransitions[currentStatus]?.includes(newStatus) || newStatus === currentStatus;
      if (!allowed) {
        return NextResponse.json(
          {
            error: "Invalid status transition",
            detail: `Cannot change status from ${currentStatus} to ${newStatus}. Allowed: draft→active, active→completed.`,
          },
          { status: 400 }
        );
      }

      updateData.status = newStatus;

      if (newStatus === "active" && currentStatus === "draft") {
        updateData.startedAt = body.startedAt ? new Date(body.startedAt as string) : new Date();
      }
      if (newStatus === "completed" && currentStatus === "active") {
        updateData.completedAt = body.completedAt
          ? new Date(body.completedAt as string)
          : new Date();
      }
    }
    if (body.startedAt !== undefined && !("startedAt" in updateData)) {
      updateData.startedAt = body.startedAt ? new Date(body.startedAt) : null;
    }
    if (body.completedAt !== undefined && !("completedAt" in updateData)) {
      updateData.completedAt = body.completedAt ? new Date(body.completedAt) : null;
    }

    // Handle fields update (upsert logic)
    if (body.fields !== undefined) {
      if (await experimentHasCheckIns(id)) {
        return NextResponse.json(
          {
            error: "Experiment structure is locked",
            detail: "You cannot modify fields after check-ins have been recorded.",
          },
          { status: 400 }
        );
      }
      // Delete fields that are not in the new list
      const existingFieldIds = body.fields.map((f: any) => f.id).filter(Boolean);

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
    return NextResponse.json({ error: "Failed to update experiment" }, { status: 500 });
  }
}

/**
 * DELETE /api/experiments/[id]
 * Personal only: delete experiment. Cascade deletes fields and check-ins.
 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await requireExperimentOwner(id, userId);
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
    return NextResponse.json({ error: "Failed to delete experiment" }, { status: 500 });
  }
}
