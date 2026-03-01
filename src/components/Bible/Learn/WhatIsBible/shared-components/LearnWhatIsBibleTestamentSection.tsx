"use client";

import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

import type { TestamentSectionConfig } from "./constants";

export interface LearnWhatIsBibleTestamentSectionProps {
  title: string;
  intro: React.ReactNode | string;
  sectionNames: readonly [string, string, string, string];
  sectionDescs: readonly [
    string | React.ReactNode,
    string | React.ReactNode,
    string | React.ReactNode,
    string | React.ReactNode,
  ];
  sections: readonly TestamentSectionConfig[];
}

export function LearnWhatIsBibleTestamentSection({
  title,
  intro,
  sectionNames,
  sectionDescs,
  sections,
}: LearnWhatIsBibleTestamentSectionProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-12">
      <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">{title}</h2>
      {typeof intro === "string" ? (
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>{intro}</p>
      ) : (
        intro
      )}
      <div className="space-y-2">
        {sections.map((s, i) => (
          <div key={i} className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-second/30 flex items-center justify-center shrink-0 text-sm font-semibold font-mono">
              {s.books}
            </div>
            <div className="min-w-0">
              <p className={cn("font-medium text-foreground", bodyClass)}>
                {sectionNames[s.nameKey]}
              </p>
              <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                {sectionDescs[s.descKey]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
