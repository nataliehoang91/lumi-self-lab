"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { STATS } from "./constants";

export interface LearnWhatIsBibleStatsProps {
  statLabels: readonly [string, string, string, string];
  /** When "vi", use Vietnamese font for labels. */
  locale?: "en" | "vi";
}

export function LearnWhatIsBibleStats({
  statLabels,
  locale,
}: LearnWhatIsBibleStatsProps) {
  const { bodyClass } = useBibleFontClasses();
  const labelFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={i}
          className="bg-card border-sage-dark/20 relative overflow-hidden rounded-xl border px-4 py-5 text-center"
        >
          <div className="bg-primary/70 theme-warm:bg-second/60 absolute inset-x-0 top-0 h-0.5 rounded-t-xl" />
          <p className="font-bible-english text-primary-dark theme-warm:text-second text-4xl font-bold tracking-tight">
            {s.v}
          </p>
          <p className={cn("mt-1.5 text-sm text-muted-foreground", bodyClass, labelFont)}>
            {statLabels[s.labelKey]}
          </p>
        </div>
      ))}
    </div>
  );
}
