"use client";

import { AnimatedStat, type StatAccent } from "./AnimatedStat";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LangPageStatItem {
  value: string;
  label: string;
  accent: StatAccent;
}

export interface LangPageStatsProps {
  stats: LangPageStatItem[];
}

export function LangPageStats({ stats }: LangPageStatsProps) {
  const { statValueClass, subBodyClass } = useLearnFontClasses();

  return (
    <section className="border-y border-border/50 py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((item) => (
          <AnimatedStat
            key={item.label}
            value={item.value}
            label={item.label}
            accent={item.accent}
            valueClassName={statValueClass}
            labelClassName={subBodyClass}
          />
        ))}
      </div>
    </section>
  );
}
