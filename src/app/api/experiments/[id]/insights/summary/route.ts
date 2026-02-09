/**
 * Phase 2A.1 — Insights Summary (READ-ONLY)
 *
 * Tables read: Experiment, ExperimentField, ExperimentCheckIn, ExperimentFieldResponse.
 * No Prisma schema changes. No writes. Ownership enforced via requireExperimentOwner.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod: response shape
// ---------------------------------------------------------------------------

const textSummarySchema = z.object({ responseCount: z.number() });

const numberSummarySchema = z.object({
  count: z.number(),
  min: z.number(),
  max: z.number(),
  avg: z.number(),
});

const yesnoSummarySchema = z.object({
  count: z.number(),
  yesCount: z.number(),
  noCount: z.number(),
  yesPercentage: z.number(),
});

const emojiSummarySchema = z.object({
  count: z.number(),
  avgScore: z.number(),
  distribution: z.record(z.string(), z.number()),
});

const selectSummarySchema = z.object({
  count: z.number(),
  optionCounts: z.record(z.string(), z.number()),
});

const fieldSummaryItemSchema = z.discriminatedUnion("type", [
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("text"),
    summary: textSummarySchema,
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("number"),
    summary: numberSummarySchema,
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("yesno"),
    summary: yesnoSummarySchema,
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("emoji"),
    summary: emojiSummarySchema,
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("select"),
    summary: selectSummarySchema,
  }),
]);

const insightsSummaryResponseSchema = z.object({
  experimentId: z.string(),
  generatedAt: z.string(),
  fields: z.array(fieldSummaryItemSchema),
});

// ---------------------------------------------------------------------------
// GET /api/experiments/[id]/insights/summary
// ---------------------------------------------------------------------------

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

    const owned = await requireExperimentOwner(experimentId, userId);
    if (!owned) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    const experiment = await prisma.experiment.findFirst({
      where: { id: experimentId, clerkUserId: userId },
      include: {
        fields: { orderBy: { order: "asc" } },
        checkIns: {
          orderBy: { checkInDate: "asc" },
          include: {
            responses: { include: { field: true } },
          },
        },
      },
    });

    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    // Flatten responses and group by fieldId
    const byFieldId = new Map<
      string,
      Array<{
        responseText: string | null;
        responseNumber: number | null;
        responseBool: boolean | null;
        selectedOption: string | null;
      }>
    >();

    for (const checkIn of experiment.checkIns) {
      for (const r of checkIn.responses) {
        const list = byFieldId.get(r.fieldId) ?? [];
        list.push({
          responseText: r.responseText,
          responseNumber: r.responseNumber,
          responseBool: r.responseBool,
          selectedOption: r.selectedOption,
        });
        byFieldId.set(r.fieldId, list);
      }
    }

    const fields: z.infer<typeof fieldSummaryItemSchema>[] = [];

    for (const field of experiment.fields) {
      const responses = byFieldId.get(field.id) ?? [];

      if (field.type === "text") {
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "text",
          summary: { responseCount: responses.length },
        });
        continue;
      }

      if (field.type === "number") {
        const nums = responses
          .map((r) => r.responseNumber)
          .filter((n): n is number => n !== null && typeof n === "number");
        const count = nums.length;
        if (count === 0) {
          fields.push({
            fieldId: field.id,
            label: field.label,
            type: "number",
            summary: { count: 0, min: 0, max: 0, avg: 0 },
          });
        } else {
          const min = Math.min(...nums);
          const max = Math.max(...nums);
          const avg = nums.reduce((a, b) => a + b, 0) / count;
          fields.push({
            fieldId: field.id,
            label: field.label,
            type: "number",
            summary: { count, min, max, avg },
          });
        }
        continue;
      }

      if (field.type === "yesno") {
        const vals = responses.map((r) => r.responseBool).filter((v) => v === true || v === false);
        const count = vals.length;
        const yesCount = vals.filter((v) => v === true).length;
        const noCount = vals.filter((v) => v === false).length;
        const yesPercentage = count === 0 ? 0 : Math.round((yesCount / count) * 1000) / 10;
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "yesno",
          summary: { count, yesCount, noCount, yesPercentage },
        });
        continue;
      }

      if (field.type === "emoji") {
        const nums = responses
          .map((r) => r.responseNumber)
          .filter((n): n is number => n !== null && Number.isInteger(n));
        const count = nums.length;
        const distribution: Record<string, number> = {};
        for (const n of nums) {
          const key = String(n);
          distribution[key] = (distribution[key] ?? 0) + 1;
        }
        const avgScore = count === 0 ? 0 : nums.reduce((a, b) => a + b, 0) / count;
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "emoji",
          summary: { count, avgScore, distribution },
        });
        continue;
      }

      if (field.type === "select") {
        const optionCounts: Record<string, number> = {};
        for (const r of responses) {
          const opt = r.selectedOption ?? "";
          if (opt !== "") optionCounts[opt] = (optionCounts[opt] ?? 0) + 1;
        }
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "select",
          summary: { count: responses.length, optionCounts },
        });
        continue;
      }

      // Unknown type: treat as text-like
      fields.push({
        fieldId: field.id,
        label: field.label,
        type: "text",
        summary: { responseCount: responses.length },
      });
    }

    const payload = {
      experimentId,
      generatedAt: new Date().toISOString(),
      fields,
    };

    const parsed = insightsSummaryResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("Insights summary validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Internal error building insights summary" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Error fetching insights summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights summary" },
      { status: 500 }
    );
  }
}
