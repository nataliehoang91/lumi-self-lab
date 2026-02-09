/**
 * Phase A.3 — Review Result response schema (Zod).
 * Used by GET /api/experiments/[id]/review/result.
 */

import { z } from "zod";
import { reviewSummaryResponseSchema } from "./review-summary-schema";
import { reviewTrendsResponseSchema } from "./review-trends-schema";

export const experimentMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  hypothesis: z.string().nullable(),
  whyMatters: z.string().nullable(),
  status: z.string(),
  startedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
});

export const reviewResultStatsSchema = z.object({
  totalCheckIns: z.number(),
  daysCovered: z.number(),
  completionRate: z.number().optional(),
});

export const reviewResultResponseSchema = z.object({
  experiment: experimentMetaSchema,
  stats: reviewResultStatsSchema,
  summary: reviewSummaryResponseSchema,
  trends: reviewTrendsResponseSchema,
  generatedAt: z.string(),
});

export type ReviewResultResponse = z.infer<typeof reviewResultResponseSchema>;
