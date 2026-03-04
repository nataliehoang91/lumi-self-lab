import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReviewResultResponse } from "@/lib/review-result-schema";
import { ReviewSummaryField } from "@/components/review/ReviewSummaryField";
import { ReviewTrendField } from "@/components/review/ReviewTrendField";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

async function fetchReviewResult(
  experimentId: string,
  cookie: string,
  baseUrl: string
): Promise<ReviewResultResponse | null> {
  const res = await fetch(`${baseUrl}/api/experiments/${experimentId}/review/result`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch review result");
  return res.json() as Promise<ReviewResultResponse>;
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const host =
    headersList.get("host") ?? headersList.get("x-forwarded-host") ?? "localhost:3005";
  const proto = headersList.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;
  const cookie = headersList.get("cookie") ?? "";

  const data = await fetchReviewResult(id, cookie, baseUrl);
  if (!data) notFound();

  const { experiment, stats, summary, trends } = data;

  const dateRange =
    experiment.startedAt && experiment.completedAt
      ? `${experiment.startedAt.split("T")[0]} to ${experiment.completedAt.split("T")[0]}`
      : experiment.startedAt
        ? `From ${experiment.startedAt.split("T")[0]}`
        : "—";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/experiments/${id}`} aria-label="Back to experiment">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-foreground text-2xl font-semibold">Review</h1>
      </div>

      {/* Header: title, status, date range, stats */}
      <section>
        <h2 className="sr-only">Experiment overview</h2>
        <div className="border-border bg-card space-y-2 rounded-md border p-4">
          <h3 className="text-foreground text-lg font-medium">{experiment.title}</h3>
          <p className="text-muted-foreground text-sm">
            Status: <span className="capitalize">{experiment.status}</span>
          </p>
          <p className="text-muted-foreground text-sm">Date range: {dateRange}</p>
          <p className="text-foreground text-sm">
            Total check-ins: {stats.totalCheckIns} · Days covered: {stats.daysCovered}
            {stats.completionRate != null &&
              ` · Completion rate: ${(stats.completionRate * 100).toFixed(0)}%`}
          </p>
        </div>
      </section>

      {/* Summary (per-field) */}
      <section>
        <h2 className="text-foreground mb-3 text-lg font-medium">Summary</h2>
        <div className="space-y-3">
          {summary.fields.length === 0 ? (
            <p className="text-muted-foreground text-sm">No fields.</p>
          ) : (
            summary.fields.map((field) => (
              <ReviewSummaryField key={field.fieldId} field={field} />
            ))
          )}
        </div>
      </section>

      {/* Trends (per-field) */}
      <section>
        <h2 className="text-foreground mb-3 text-lg font-medium">Trends</h2>
        <div className="space-y-3">
          {trends.fields.length === 0 ? (
            <p className="text-muted-foreground text-sm">No trends.</p>
          ) : (
            trends.fields.map((field) => (
              <ReviewTrendField key={field.fieldId} field={field} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
