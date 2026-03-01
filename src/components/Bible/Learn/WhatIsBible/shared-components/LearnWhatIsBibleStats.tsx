"use client";

import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";
import { STATS } from "./constants";

export interface LearnWhatIsBibleStatsProps {
  statLabels: readonly [string, string, string, string];
}

export function LearnWhatIsBibleStats({ statLabels }: LearnWhatIsBibleStatsProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
      {STATS.map((s, i) => (
        <div
          key={i}
          className="bg-card border border-sage-dark/20 rounded-xl px-4 py-4 text-center"
        >
          <p className="font-bible-english text-3xl font-semibold text-primary-dark">{s.v}</p>
          <p className={cn("font-semibold mt-1", bodyClass)}>{statLabels[s.labelKey]}</p>
        </div>
      ))}
    </div>
  );
}
