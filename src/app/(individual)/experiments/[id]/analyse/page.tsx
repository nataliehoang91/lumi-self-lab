"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { ReviewResultResponse } from "@/lib/review-result-schema";

const MAX_REFLECTIONS = 3;

const LOADING_MESSAGES = [
  "Reading your check-in history…",
  "Identifying patterns across your data…",
  "Calculating correlations between fields…",
  "Evaluating your hypothesis against the data…",
  "Crafting your personalised analysis…",
];

type StoredReflections = { reflections: string[]; count: number };

type PageState =
  | { phase: "loading" }
  | { phase: "generating"; data: ReviewResultResponse; stored: StoredReflections }
  | { phase: "error"; message: string }
  | { phase: "done"; data: ReviewResultResponse; stored: StoredReflections };

function LoadingScreen({ generating }: { generating?: boolean }) {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length),
      2200
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-8 w-8 animate-pulse text-primary" />
        </div>
      </div>
      <div>
        <p className="text-foreground text-lg font-semibold">
          {generating ? "Claude is generating a new analysis…" : "Loading your analysis…"}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">{LOADING_MESSAGES[msgIndex]}</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function TrendIcon({ direction }: { direction: string }) {
  if (direction === "up") return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (direction === "down") return <TrendingDown className="h-4 w-4 text-rose-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function ReflectionText({ text }: { text: string }) {
  return (
    <div className="space-y-4">
      {text
        .split("\n\n")
        .filter(Boolean)
        .map((block, i) => {
          const headingMatch =
            block.match(/^#{1,3}\s+(.+)$/) ?? block.match(/^\*\*([A-Z][A-Z\s&.]+)\*\*$/);
          if (headingMatch) {
            return (
              <p key={i} className="text-foreground mt-2 text-xs font-bold uppercase tracking-widest">
                {headingMatch[1]}
              </p>
            );
          }
          return (
            <p key={i} className="text-muted-foreground text-sm leading-relaxed">
              {block.replace(/\*\*(.+?)\*\*/g, "$1")}
            </p>
          );
        })}
    </div>
  );
}

export default function AnalysePage() {
  const params = useParams();
  const router = useRouter();
  const experimentId = params.id as string;
  const [state, setState] = useState<PageState>({ phase: "loading" });
  const [activeVersion, setActiveVersion] = useState(0); // index into reflections array
  const ranRef = useRef(false);

  // On mount: load review data + stored reflections. Never auto-call Claude.
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      try {
        const [reviewRes, storedRes] = await Promise.all([
          fetch(`/api/experiments/${experimentId}/review/result`, { cache: "no-store" }),
          fetch(`/api/experiments/${experimentId}/insights/reflection`),
        ]);

        if (!reviewRes.ok) {
          setState({ phase: "error", message: "Could not load experiment data." });
          return;
        }

        const data = (await reviewRes.json()) as ReviewResultResponse;
        const stored: StoredReflections = storedRes.ok
          ? ((await storedRes.json()) as StoredReflections)
          : { reflections: [], count: 0 };

        setState({ phase: "done", data, stored });
        // Default to showing the latest version
        setActiveVersion(Math.max(0, stored.reflections.length - 1));
      } catch {
        setState({ phase: "error", message: "Something went wrong. Please try again." });
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);

  const handleGenerate = async () => {
    if (state.phase !== "done") return;
    if (state.stored.count >= MAX_REFLECTIONS) return;

    const { data, stored } = state;
    setState({ phase: "generating", data, stored });

    try {
      const res = await fetch(`/api/experiments/${experimentId}/insights/reflection`, {
        method: "POST",
      });

      if (res.status === 429) {
        setState({ phase: "done", data, stored: { ...stored, count: MAX_REFLECTIONS } });
        return;
      }

      if (res.ok) {
        const body = (await res.json()) as StoredReflections;
        setState({ phase: "done", data, stored: body });
        setActiveVersion(body.reflections.length - 1); // show the new one
      } else {
        setState({ phase: "done", data, stored });
      }
    } catch {
      setState({ phase: "done", data, stored });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/experiments/${experimentId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Experiment
          </Link>
        </Button>
      </div>

      {state.phase === "loading" && <LoadingScreen />}
      {state.phase === "generating" && <LoadingScreen generating />}

      {state.phase === "error" && (
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <p className="text-foreground font-semibold">{state.message}</p>
            <p className="text-muted-foreground mt-1 text-sm">Check your connection and try again.</p>
          </div>
          <Button onClick={() => { ranRef.current = false; setState({ phase: "loading" }); }} className="rounded-2xl">
            Try again
          </Button>
        </div>
      )}

      {(state.phase === "done") && (() => {
        const { data, stored } = state;
        const { experiment, stats, summary, trends } = data;
        const { reflections, count } = stored;
        const atLimit = count >= MAX_REFLECTIONS;
        const hasReflections = reflections.length > 0;
        const currentReflection = reflections[activeVersion] ?? null;
        const completionPct =
          stats.completionRate != null
            ? `${(stats.completionRate * 100).toFixed(0)}%`
            : null;

        return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge className="rounded-full border-primary/20 bg-primary/10 text-primary">
                  Analysis Complete
                </Badge>
                <Badge variant="outline" className="rounded-full capitalize">
                  {experiment.status}
                </Badge>
              </div>
              <h1 className="text-foreground text-3xl font-bold">{experiment.title}</h1>
              {experiment.hypothesis && (
                <p className="text-muted-foreground mt-2 text-sm italic">
                  Hypothesis: {experiment.hypothesis}
                </p>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center">
                <p className="text-foreground text-2xl font-bold">{stats.totalCheckIns}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">Check-ins</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-foreground text-2xl font-bold">{stats.daysCovered}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">Days covered</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-foreground text-2xl font-bold">{completionPct ?? "—"}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">Completion</p>
              </Card>
            </div>

            {/* AI Reflection card */}
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/[0.02] p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-foreground font-semibold">AI Reflection</span>
                    <span className="text-muted-foreground ml-2 text-xs">by Claude</span>
                  </div>
                </div>

                {/* Generate / limit */}
                {!atLimit ? (
                  <Button
                    size="sm"
                    onClick={handleGenerate}
                    className="h-8 shrink-0 rounded-xl text-xs"
                  >
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    {hasReflections ? "Generate new" : "Generate analysis"}
                  </Button>
                ) : (
                  <span className="text-muted-foreground shrink-0 text-xs">All {MAX_REFLECTIONS} runs used</span>
                )}
              </div>

              {/* Version tabs (only show if >1 version) */}
              {reflections.length > 1 && (
                <div className="mb-5 flex gap-1.5">
                  {reflections.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVersion(i)}
                      className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                        activeVersion === i
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      Run {i + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Content */}
              {currentReflection ? (
                <ReflectionText text={currentReflection} />
              ) : (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">No analysis yet</p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Click "Generate analysis" to have Claude analyse your check-in data.
                    </p>
                  </div>
                </div>
              )}

              {/* Run counter dots */}
              <div className="mt-6 flex items-center gap-1.5 border-t border-primary/10 pt-4">
                {Array.from({ length: MAX_REFLECTIONS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      i < count ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
                <span className="text-muted-foreground ml-1.5 text-[11px]">
                  {count}/{MAX_REFLECTIONS} runs used
                </span>
              </div>
            </Card>

            {/* Per-field Summary */}
            {summary.fields.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <BarChart2 className="text-foreground h-5 w-5" />
                  <h2 className="text-foreground text-lg font-semibold">Field Summary</h2>
                </div>
                <div className="space-y-3">
                  {summary.fields.map((field) => (
                    <Card key={field.fieldId} className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-foreground text-sm font-medium">{field.label}</p>
                        <Badge variant="outline" className="rounded-full text-xs capitalize">
                          {field.type}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground space-y-1.5 text-sm">
                        {field.type === "number" && (
                          <>
                            <p>Average: <span className="text-foreground font-semibold">{field.summary.avg.toFixed(1)}</span></p>
                            <p>Range: <span className="text-foreground font-semibold">{field.summary.min} – {field.summary.max}</span></p>
                            <p className="text-xs">{field.summary.count} responses</p>
                          </>
                        )}
                        {field.type === "emoji" && (
                          <>
                            <p>Average mood: <span className="text-foreground font-semibold">{field.summary.avgScore.toFixed(1)}</span></p>
                            <p className="text-xs">{field.summary.count} responses</p>
                          </>
                        )}
                        {field.type === "yesno" && (
                          <>
                            <p>Yes: <span className="text-foreground font-semibold">{field.summary.yesCount}</span> ({field.summary.yesPercentage.toFixed(0)}%)</p>
                            <p>No: <span className="text-foreground font-semibold">{field.summary.noCount}</span></p>
                          </>
                        )}
                        {field.type === "select" && Object.entries(field.summary.optionCounts)
                          .sort(([, a], [, b]) => b - a)
                          .map(([option, count]) => (
                            <p key={option}>{option}: <span className="text-foreground font-semibold">{count}</span></p>
                          ))}
                        {field.type === "text" && (
                          <p className="text-xs">{field.summary.responseCount} responses</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Per-field Trends */}
            {trends.fields.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="text-foreground h-5 w-5" />
                  <h2 className="text-foreground text-lg font-semibold">Trends Over Time</h2>
                </div>
                <div className="space-y-3">
                  {trends.fields.map((field) => {
                    const trendDir =
                      field.type === "number" ? field.trend.direction :
                      field.type === "emoji" ? field.trend.moodTrend :
                      field.type === "yesno" ? field.trend.yesRateTrend : "flat";
                    const trendLabel =
                      trendDir === "increasing" || trendDir === "up" ? "improving" :
                      trendDir === "decreasing" || trendDir === "down" ? "declining" : "stable";
                    const iconDir =
                      trendDir === "increasing" || trendDir === "up" ? "up" :
                      trendDir === "decreasing" || trendDir === "down" ? "down" : "flat";
                    return (
                      <Card key={field.fieldId} className="p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-foreground text-sm font-medium">{field.label}</p>
                          <div className="flex items-center gap-1.5">
                            <TrendIcon direction={iconDir} />
                            <span className="text-muted-foreground text-xs capitalize">{trendLabel}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3 pb-8">
              <Button variant="outline" className="flex-1 rounded-2xl" onClick={() => router.push(`/experiments/${experimentId}`)}>
                Back to Experiment
              </Button>
              <Button className="flex-1 rounded-2xl" onClick={() => router.push("/experiments")}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                All Experiments
              </Button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
