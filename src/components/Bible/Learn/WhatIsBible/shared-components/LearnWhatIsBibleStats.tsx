"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { STATS } from "./constants";

export interface LearnWhatIsBibleStatsProps {
  statLabels: readonly [string, string, string, string];
}

export function LearnWhatIsBibleStats({ statLabels }: LearnWhatIsBibleStatsProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={i}
          className="bg-card border-sage-dark/20 rounded-xl border px-4 py-4 text-center"
        >
          <p className="font-bible-english text-primary-dark text-3xl font-semibold">
            {s.v}
          </p>
          <p className={cn("mt-1 font-semibold", bodyClass)}>{statLabels[s.labelKey]}</p>
        </div>
      ))}
    </div>
  );
}
