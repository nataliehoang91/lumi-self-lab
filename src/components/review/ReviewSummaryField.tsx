"use client";

/**
 * Renders one field from the review summary (per-field aggregates).
 * Phase B.1 — simple text + numbers, no charts.
 */

type TextSummary = { responseCount: number };
type NumberSummary = { count: number; min: number; max: number; avg: number };
type YesnoSummary = { count: number; yesCount: number; noCount: number; yesPercentage: number };
type EmojiSummary = { count: number; avgScore: number; distribution: Record<string, number> };
type SelectSummary = { count: number; optionCounts: Record<string, number> };

type SummaryField =
  | { fieldId: string; label: string; type: "text"; summary: TextSummary }
  | { fieldId: string; label: string; type: "number"; summary: NumberSummary }
  | { fieldId: string; label: string; type: "yesno"; summary: YesnoSummary }
  | { fieldId: string; label: string; type: "emoji"; summary: EmojiSummary }
  | { fieldId: string; label: string; type: "select"; summary: SelectSummary };

export function ReviewSummaryField({ field }: { field: SummaryField }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <h4 className="font-medium text-foreground">{field.label}</h4>
      <p className="text-muted-foreground text-sm capitalize">{field.type}</p>
      <div className="mt-2 text-sm text-foreground">
        {field.type === "text" && (
          <span>{field.summary.responseCount} response(s)</span>
        )}
        {field.type === "number" && (
          <span>
            n={field.summary.count}; min={field.summary.min}, max={field.summary.max}, avg=
            {field.summary.avg.toFixed(1)}
          </span>
        )}
        {field.type === "yesno" && (
          <span>
            Yes: {field.summary.yesCount}, No: {field.summary.noCount} (
            {field.summary.yesPercentage}% yes)
          </span>
        )}
        {field.type === "emoji" && (
          <span>
            n={field.summary.count}, avg score={field.summary.avgScore.toFixed(1)}
            {Object.keys(field.summary.distribution).length > 0 &&
              `; distribution: ${Object.entries(field.summary.distribution)
                .map(([k, v]) => `${k}:${v}`)
                .join(", ")}`}
          </span>
        )}
        {field.type === "select" && (
          <span>
            n={field.summary.count};{" "}
            {Object.entries(field.summary.optionCounts)
              .map(([opt, count]) => `${opt}: ${count}`)
              .join(", ")}
          </span>
        )}
      </div>
    </div>
  );
}
