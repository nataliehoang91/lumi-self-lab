/**
 * Phase A.1 — Review summary aggregation (READ-ONLY).
 * Shared by GET /api/experiments/[id]/review/summary and GET .../review/result.
 */

export type ReviewSummaryField =
  | { fieldId: string; label: string; type: "text"; summary: { responseCount: number } }
  | {
      fieldId: string;
      label: string;
      type: "number";
      summary: { count: number; min: number; max: number; avg: number };
    }
  | {
      fieldId: string;
      label: string;
      type: "yesno";
      summary: { count: number; yesCount: number; noCount: number; yesPercentage: number };
    }
  | {
      fieldId: string;
      label: string;
      type: "emoji";
      summary: { count: number; avgScore: number; distribution: Record<string, number> };
    }
  | {
      fieldId: string;
      label: string;
      type: "select";
      summary: { count: number; optionCounts: Record<string, number> };
    };

type ResponseRow = {
  fieldId: string;
  responseText: string | null;
  responseNumber: number | null;
  responseBool: boolean | null;
  selectedOption: string | null;
};

type FieldRow = { id: string; label: string; type: string };

export type CheckInRow = { responses: ResponseRow[] };

export type ExperimentForReview = {
  id: string;
  fields: FieldRow[];
  checkIns: CheckInRow[];
};

export function computeReviewSummaryFields(
  experiment: ExperimentForReview
): ReviewSummaryField[] {
  const byFieldId = new Map<string, ResponseRow[]>();

  for (const checkIn of experiment.checkIns) {
    for (const r of checkIn.responses) {
      const list = byFieldId.get(r.fieldId) ?? [];
      list.push({
        fieldId: r.fieldId,
        responseText: r.responseText,
        responseNumber: r.responseNumber,
        responseBool: r.responseBool,
        selectedOption: r.selectedOption,
      });
      byFieldId.set(r.fieldId, list);
    }
  }

  const fields: ReviewSummaryField[] = [];

  for (const field of experiment.fields) {
    const responses = byFieldId.get(field.id) ?? [];

    if (field.type === "text") {
      const responseCount = responses.filter(
        (r) => r.responseText != null && r.responseText.trim() !== ""
      ).length;
      fields.push({
        fieldId: field.id,
        label: field.label,
        type: "text",
        summary: { responseCount },
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
      const vals = responses
        .map((r) => r.responseBool)
        .filter((v) => v === true || v === false);
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

    const responseCount = responses.filter(
      (r) => r.responseText != null && r.responseText.trim() !== ""
    ).length;
    fields.push({
      fieldId: field.id,
      label: field.label,
      type: "text",
      summary: { responseCount },
    });
  }

  return fields;
}
