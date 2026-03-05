"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnFullyGodManSectionProps {
  sectionTitle: string;
  leftTitle: string;
  leftBody: ReactNode;
  leftRef: ReactNode;
  rightTitle: string;
  rightBody: ReactNode;
  rightRef: ReactNode;
}

export function LearnFullyGodManSection({
  sectionTitle,
  leftTitle,
  leftBody,
  leftRef,
  rightTitle,
  rightBody,
  rightRef,
}: LearnFullyGodManSectionProps) {
  const { bodyClass, subBodyClass } = useBibleFontClasses();

  return (
    <section className="mb-10" aria-labelledby="fully-section-title">
      <h2
        id="fully-section-title"
        className="font-bible-english text-foreground mb-4 text-2xl font-semibold"
      >
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="bg-card border-sage-dark/20 rounded-2xl border p-5">
          <p className="text-foreground mb-2 font-semibold">{leftTitle}</p>
          <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
            {leftBody}
          </p>
          <p className={cn("text-muted-foreground/60 mt-3 font-mono", subBodyClass)}>
            {leftRef}
          </p>
        </div>
        <div className="bg-card border-sage-dark/20 rounded-2xl border p-5">
          <p className="text-foreground mb-2 font-semibold">{rightTitle}</p>
          <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
            {rightBody}
          </p>
          <p className={cn("text-muted-foreground/60 mt-3 font-mono", subBodyClass)}>
            {rightRef}
          </p>
        </div>
      </div>
    </section>
  );
}
