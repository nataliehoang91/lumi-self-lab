"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Shared hook
// ---------------------------------------------------------------------------

export function useSimulatedProgress(replayKey: number, durationMs = 2000) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    if (durationMs <= 0) {
      setProgress(100);
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const next = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(next);
      if (next < 100) {
        requestAnimationFrame(tick);
      }
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [replayKey, durationMs]);

  return { progress };
}

// ---------------------------------------------------------------------------
// 01. Verse skeleton loader
// ---------------------------------------------------------------------------

export function VerseSkeletonLoader({ verseCount = 6 }: { verseCount?: number }) {
  const items = Array.from({ length: verseCount }, (_, i) => i);

  return (
    <div className="space-y-4 animate-pulse">
      {items.map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-4 w-5 rounded bg-muted shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-[88%] rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-[72%] rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple reveal wrapper: shows skeleton while loading, then children.
export function ContentReveal({
  isLoading,
  skeleton,
  children,
}: {
  isLoading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  if (isLoading) return <>{skeleton}</>;
  return <div className="animate-fade-in">{children}</div>;
}

// ---------------------------------------------------------------------------
// 02. Minimal progress text loader
// ---------------------------------------------------------------------------

export function ProgressTextLoader({ book, chapter }: { book?: string; chapter?: number }) {
  const [replayKey] = useState(0);
  const { progress } = useSimulatedProgress(replayKey, 1800);

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-muted-foreground">
          {book ?? undefined} {chapter ?? undefined}
        </span>
        <span className="font-mono tabular-nums text-[11px] text-muted-foreground/80">
          {progress}%
        </span>
      </div>
      <div className="h-px w-full bg-border/40 overflow-hidden rounded-full">
        <div
          className="h-px bg-primary transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 03. Gradient shimmer loader
// ---------------------------------------------------------------------------

export function GradientShimmerLoader({ verseCount = 6 }: { verseCount?: number }) {
  const items = Array.from({ length: verseCount }, (_, i) => i);

  return (
    <div className="space-y-4 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10 animate-[shimmer_1.8s_infinite]" />
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i} className="flex gap-3">
            <div className="h-4 w-5 rounded bg-muted/70 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-[88%] rounded bg-muted/70" />
              <div className="h-3 w-full rounded bg-muted/70" />
              <div className="h-3 w-[72%] rounded bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 04. Micro panel loader (non‑blocking pill)
// ---------------------------------------------------------------------------

export function MicroPanelLoader({
  book,
  chapter,
  side,
}: {
  book?: string;
  chapter?: number;
  side: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium",
        "bg-muted/70 border-border/70 text-muted-foreground backdrop-blur-sm shadow-sm"
      )}
    >
      <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
      <span className="uppercase tracking-[0.12em] font-semibold">
        Loading {book ?? undefined} {chapter ?? undefined}
      </span>
      <span className="hidden sm:inline text-[10px] opacity-80">({side} panel)</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 05. Segmented progress bar
// ---------------------------------------------------------------------------

export function SegmentedProgressBar({
  progress,
  segments = 16,
}: {
  progress: number;
  segments?: number;
}) {
  const clamped = Math.max(0, Math.min(100, progress));
  const activeCount = Math.round((clamped / 100) * segments);
  const items = Array.from({ length: segments }, (_, i) => i);

  return (
    <div className="flex gap-[2px] h-[2px] w-full overflow-hidden rounded-full bg-border/40">
      {items.map((i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-full transition-colors duration-150",
            i < activeCount ? "bg-primary" : "bg-transparent"
          )}
        />
      ))}
    </div>
  );
}
