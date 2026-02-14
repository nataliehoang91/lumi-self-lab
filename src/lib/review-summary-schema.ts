/**
 * Phase A.1 — Review Summary response schema (Zod).
 * Used by GET /api/experiments/[id]/review/summary and review/result.
 */

import { z } from "zod";

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

export const fieldSummaryItemSchema = z.discriminatedUnion("type", [
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

export const reviewSummaryResponseSchema = z.object({
  experimentId: z.string(),
  generatedAt: z.string(),
  fields: z.array(fieldSummaryItemSchema),
});

export type ReviewSummaryResponse = z.infer<typeof reviewSummaryResponseSchema>;
