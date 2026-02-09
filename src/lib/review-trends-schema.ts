/**
 * Phase A.2 — Review Trends response schema (Zod).
 * Used by GET /api/experiments/[id]/review/trends.
 */

import { z } from "zod";

export const directionSchema = z.enum(["increasing", "decreasing", "flat"]);
export const moodTrendSchema = z.enum(["up", "down", "flat"]);
export const yesRateTrendSchema = z.enum(["up", "down", "flat"]);

export const dateCountSchema = z.object({
  date: z.string(),
  count: z.number(),
});

export const fieldTrendItemSchema = z.discriminatedUnion("type", [
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
    type: z.literal("emoji"),
    trend: z.object({ moodTrend: moodTrendSchema }),
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
    type: z.literal("select"),
    trend: z.object({ dominantOverTime: z.array(z.string()).optional() }),
  }),
]);

export const reviewTrendsResponseSchema = z.object({
  experimentId: z.string(),
  generatedAt: z.string(),
  fields: z.array(fieldTrendItemSchema),
});

export type ReviewTrendsResponse = z.infer<typeof reviewTrendsResponseSchema>;
export type FieldTrendItem = z.infer<typeof fieldTrendItemSchema>;
