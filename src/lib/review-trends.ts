/**
 * Phase A.2 — Review trends aggregation (READ-ONLY).
 * Shared by GET /api/experiments/[id]/review/trends and GET .../review/result.
 */

import type { CheckInRow, ExperimentForReview } from "./review-summary";

const TREND_FLAT_THRESHOLD = 0.05;

/** Experiment with check-ins that have checkInDate (for time ordering). */
export type ExperimentForTrends = Omit<ExperimentForReview, "checkIns"> & {
  checkIns: Array<CheckInRow & { checkInDate: Date }>;
};

function numericDirection(values: number[]): "increasing" | "decreasing" | "flat" {
  if (values.length < 2) return "flat";
  const n = values.length;
  const firstQuarterSize = Math.max(1, Math.floor(n * 0.25));
  const lastQuarterSize = Math.max(1, Math.floor(n * 0.25));
  const firstAvg = values.slice(0, firstQuarterSize).reduce((a, b) => a + b, 0) / firstQuarterSize;
  const lastAvg = values.slice(-lastQuarterSize).reduce((a, b) => a + b, 0) / lastQuarterSize;
  const range = Math.max(...values) - Math.min(...values) || 1;
  const normalizedDiff = (lastAvg - firstAvg) / range;
  if (normalizedDiff > TREND_FLAT_THRESHOLD) return "increasing";
  if (normalizedDiff < -TREND_FLAT_THRESHOLD) return "decreasing";
  return "flat";
}

export type ReviewTrendsField =
  | {
      fieldId: string;
      label: string;
      type: "text";
      trend: { countOverTime: Array<{ date: string; count: number }> };
    }
  | {
      fieldId: string;
      label: string;
      type: "number";
      trend: { direction: "increasing" | "decreasing" | "flat" };
    }
  | {
      fieldId: string;
      label: string;
      type: "emoji";
      trend: { moodTrend: "up" | "down" | "flat" };
    }
  | {
      fieldId: string;
      label: string;
      type: "yesno";
      trend: { yesRateTrend: "up" | "down" | "flat" };
    }
  | {
      fieldId: string;
      label: string;
      type: "select";
      trend: { dominantOverTime?: string[] };
    };

export function computeReviewTrendsFields(experiment: ExperimentForTrends): ReviewTrendsField[] {
  const checkInsOrdered = experiment.checkIns;
  const dateStrings = checkInsOrdered.map((c) => c.checkInDate.toISOString().split("T")[0]);

  const fields: ReviewTrendsField[] = [];

  for (const field of experiment.fields) {
    const valuesByDate: Array<{ date: string; value: number | boolean | string }> = [];
    for (let i = 0; i < checkInsOrdered.length; i++) {
      const checkIn = checkInsOrdered[i] as CheckInRow & { checkInDate: Date };
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
          (r) => r.fieldId === field.id && r.responseText != null && r.responseText.trim() !== ""
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
        const lastRate = bools.slice(-lastQuarterSize).filter(Boolean).length / lastQuarterSize;
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

    const countOverTime = checkInsOrdered.map((checkIn, i) => ({
      date: dateStrings[i],
      count: checkIn.responses.filter(
        (r) => r.fieldId === field.id && r.responseText != null && r.responseText.trim() !== ""
      ).length,
    }));
    fields.push({
      fieldId: field.id,
      label: field.label,
      type: "text",
      trend: { countOverTime },
    });
  }

  return fields;
}
