"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LearnCrossSectionProps {
  title: string;
  paragraph1: ReactNode;
  paragraph2: ReactNode;
  refText: string;
}

export function LearnCrossSection({
  title,
  paragraph1,
  paragraph2,
  refText,
}: LearnCrossSectionProps) {
  const { bodyClass, subBodyClass } = useLearnFontClasses();

  return (
    <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl" aria-labelledby="cross-section-title">
      <h2 id="cross-section-title" className="font-bible-english text-xl font-semibold text-foreground mb-3">
        {title}
      </h2>
      <p className={cn("text-muted-foreground leading-relaxed mb-3", bodyClass)}>{paragraph1}</p>
      <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>{paragraph2}</p>
      <p className={cn("font-mono text-muted-foreground/60 mt-4", subBodyClass)}>{refText}</p>
    </section>
  );
}
