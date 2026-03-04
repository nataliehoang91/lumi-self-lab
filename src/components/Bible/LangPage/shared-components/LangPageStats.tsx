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
    <section className="border-border/50 border-y px-6 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 md:grid-cols-4">
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
