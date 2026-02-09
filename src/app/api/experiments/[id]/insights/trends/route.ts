/**
 * Phase 2A.2 — Insights Trends (READ-ONLY)
 *
 * Tables read: Experiment, ExperimentField, ExperimentCheckIn, ExperimentFieldResponse.
 * No Prisma schema changes. No writes. Ownership enforced via requireExperimentOwner.
 */

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Helpers: trend direction from time-ordered numeric values
// ---------------------------------------------------------------------------

const TREND_FLAT_THRESHOLD = 0.05; // 5% of range or relative change

function numericDirection(values: number[]): "increasing" | "decreasing" | "flat" {
  if (values.length < 2) return "flat";
  const n = values.length;
  const firstQuarterSize = Math.max(1, Math.floor(n * 0.25));
  const lastQuarterSize = Math.max(1, Math.floor(n * 0.25));
  const firstAvg =
    values.slice(0, firstQuarterSize).reduce((a, b) => a + b, 0) / firstQuarterSize;
  const lastAvg =
    values.slice(-lastQuarterSize).reduce((a, b) => a + b, 0) / lastQuarterSize;
  const range = Math.max(...values) - Math.min(...values) || 1;
  const normalizedDiff = (lastAvg - firstAvg) / range;
  if (normalizedDiff > TREND_FLAT_THRESHOLD) return "increasing";
  if (normalizedDiff < -TREND_FLAT_THRESHOLD) return "decreasing";
  return "flat";
}

// ---------------------------------------------------------------------------
// Zod: response shape
// ---------------------------------------------------------------------------

const directionSchema = z.enum(["increasing", "decreasing", "flat"]);
const moodTrendSchema = z.enum(["up", "down", "flat"]);
const yesRateTrendSchema = z.enum(["up", "down", "flat"]);

const dateCountSchema = z.object({ date: z.string(), count: z.number() });

const fieldTrendItemSchema = z.discriminatedUnion("type", [
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("text"),
    trend: z.object({ countOverTime: z.array(dateCountSchema) }),
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("number"),
    trend: z.object({ direction: directionSchema }),
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("yesno"),
    trend: z.object({ yesRateTrend: yesRateTrendSchema }),
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("emoji"),
    trend: z.object({ moodTrend: moodTrendSchema }),
  }),
  z.object({
    fieldId: z.string(),
    label: z.string(),
    type: z.literal("select"),
    trend: z.object({ dominantOverTime: z.array(z.string()).optional() }),
  }),
]);

const insightsTrendsResponseSchema = z.object({
  experimentId: z.string(),
  generatedAt: z.string(),
  fields: z.array(fieldTrendItemSchema),
});

// ---------------------------------------------------------------------------
// GET /api/experiments/[id]/insights/trends
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

    // checkIns are ordered by checkInDate asc (UTC-normalized)
    const checkInsOrdered = experiment.checkIns;
    const dateStrings = checkInsOrdered.map((c) =>
      c.checkInDate.toISOString().split("T")[0]
    );

    const fields: z.infer<typeof fieldTrendItemSchema>[] = [];

    for (const field of experiment.fields) {
      // Build time-ordered values: for each check-in, get this field's response
      const valuesByDate: Array<{ date: string; value: number | boolean | string }> = [];
      for (let i = 0; i < checkInsOrdered.length; i++) {
        const checkIn = checkInsOrdered[i];
        const date = dateStrings[i];
        const resp = checkIn.responses.find((r) => r.fieldId === field.id);
        if (!resp) continue;
        if (field.type === "number" && resp.responseNumber != null) {
          valuesByDate.push({ date, value: resp.responseNumber });
        } else if (field.type === "emoji" && resp.responseNumber != null) {
          valuesByDate.push({ date, value: resp.responseNumber });
        } else if (field.type === "yesno" && resp.responseBool !== null) {
          valuesByDate.push({ date, value: resp.responseBool });
        } else if (field.type === "select" && resp.selectedOption != null) {
          valuesByDate.push({ date, value: resp.selectedOption });
        }
      }

      if (field.type === "text") {
        const countOverTime = checkInsOrdered.map((checkIn, i) => ({
          date: dateStrings[i],
          count: checkIn.responses.filter(
            (r) => r.fieldId === field.id && r.responseText != null && r.responseText !== ""
          ).length,
        }));
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "text",
          trend: { countOverTime },
        });
        continue;
      }

      if (field.type === "number") {
        const nums = valuesByDate
          .map((x) => (typeof x.value === "number" ? x.value : NaN))
          .filter((n) => !Number.isNaN(n));
        const direction = numericDirection(nums);
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "number",
          trend: { direction },
        });
        continue;
      }

      if (field.type === "emoji") {
        const nums = valuesByDate
          .map((x) => (typeof x.value === "number" ? x.value : NaN))
          .filter((n) => !Number.isNaN(n));
        const direction = numericDirection(nums);
        const moodTrend: "up" | "down" | "flat" =
          direction === "increasing" ? "up" : direction === "decreasing" ? "down" : "flat";
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "emoji",
          trend: { moodTrend },
        });
        continue;
      }

      if (field.type === "yesno") {
        const bools = valuesByDate
          .map((x) => x.value)
          .filter((v): v is boolean => typeof v === "boolean");
        const n = bools.length;
        if (n < 2) {
          fields.push({
            fieldId: field.id,
            label: field.label,
            type: "yesno",
            trend: { yesRateTrend: "flat" },
          });
        } else {
          const firstQuarterSize = Math.max(1, Math.floor(n * 0.25));
          const lastQuarterSize = Math.max(1, Math.floor(n * 0.25));
          const firstRate =
            bools.slice(0, firstQuarterSize).filter(Boolean).length / firstQuarterSize;
          const lastRate =
            bools.slice(-lastQuarterSize).filter(Boolean).length / lastQuarterSize;
          const diff = lastRate - firstRate;
          const yesRateTrend: "up" | "down" | "flat" =
            diff > TREND_FLAT_THRESHOLD ? "up" : diff < -TREND_FLAT_THRESHOLD ? "down" : "flat";
          fields.push({
            fieldId: field.id,
            label: field.label,
            type: "yesno",
            trend: { yesRateTrend },
          });
        }
        continue;
      }

      if (field.type === "select") {
        const dominantOverTime = checkInsOrdered.map((checkIn) => {
          const resp = checkIn.responses.find((r) => r.fieldId === field.id);
          return resp?.selectedOption ?? "";
        });
        fields.push({
          fieldId: field.id,
          label: field.label,
          type: "select",
          trend: { dominantOverTime },
        });
        continue;
      }

      // Unknown type: treat as text
      const countOverTime = checkInsOrdered.map((checkIn, i) => ({
        date: dateStrings[i],
        count: checkIn.responses.filter((r) => r.fieldId === field.id).length,
      }));
      fields.push({
        fieldId: field.id,
        label: field.label,
        type: "text",
        trend: { countOverTime },
      });
    }

    const payload = {
      experimentId,
      generatedAt: new Date().toISOString(),
      fields,
    };

    const parsed = insightsTrendsResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error("Insights trends validation failed:", parsed.error);
      return NextResponse.json(
        { error: "Internal error building insights trends" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Error fetching insights trends:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights trends" },
      { status: 500 }
    );
  }
}
