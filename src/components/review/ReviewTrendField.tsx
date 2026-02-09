"use client";

/**
 * Renders one field from the review trends (per-field trend).
 * Phase B.1 — simple text + numbers, no charts.
 */

type TrendField =
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

export function ReviewTrendField({ field }: { field: TrendField }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <h4 className="font-medium text-foreground">{field.label}</h4>
      <p className="text-muted-foreground text-sm capitalize">{field.type}</p>
      <div className="mt-2 text-sm text-foreground">
        {field.type === "text" && (
          <span>
            {field.trend.countOverTime.length} day(s); counts:{" "}
            {field.trend.countOverTime.map((d) => `${d.date}:${d.count}`).join(", ")}
          </span>
        )}
        {field.type === "number" && (
          <span>Direction: {field.trend.direction}</span>
        )}
        {field.type === "emoji" && (
          <span>Mood trend: {field.trend.moodTrend}</span>
        )}
        {field.type === "yesno" && (
          <span>Yes-rate trend: {field.trend.yesRateTrend}</span>
        )}
        {field.type === "select" && field.trend.dominantOverTime && (
          <span>
            Over time: {field.trend.dominantOverTime.join(" → ")}
          </span>
        )}
        {field.type === "select" && !field.trend.dominantOverTime?.length && (
          <span>—</span>
        )}
      </div>
    </div>
  );
}
