"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

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
  const { bodyClass, subBodyClass } = useBibleFontClasses();

  return (
    <section
      className="bg-card border-sage-dark/20 mb-10 rounded-2xl border p-6"
      aria-labelledby="cross-section-title"
    >
      <h2
        id="cross-section-title"
        className="font-bible-english text-foreground mb-3 text-xl font-semibold"
      >
        {title}
      </h2>
      <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClass)}>
        {paragraph1}
      </p>
      <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
        {paragraph2}
      </p>
      <p className={cn("text-muted-foreground/60 mt-4 font-mono", subBodyClass)}>
        {refText}
      </p>
    </section>
  );
}
