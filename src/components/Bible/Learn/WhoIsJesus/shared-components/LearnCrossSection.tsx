"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LearnCrossSectionProps {
  title: string;
  paragraph1: ReactNode;
  paragraph2: ReactNode;
  refText: string;
  bodyClassName?: string;
  refClassName?: string;
}

export function LearnCrossSection({
  title,
  paragraph1,
  paragraph2,
  refText,
  bodyClassName,
  refClassName,
}: LearnCrossSectionProps) {
  return (
    <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl" aria-labelledby="cross-section-title">
      <h2 id="cross-section-title" className="font-bible-english text-xl font-semibold text-foreground mb-3">
        {title}
      </h2>
      <p className={cn("text-sm text-muted-foreground leading-relaxed mb-3", bodyClassName)}>{paragraph1}</p>
      <p className={cn("text-sm text-muted-foreground leading-relaxed", bodyClassName)}>{paragraph2}</p>
      <p className={cn("text-xs font-mono text-muted-foreground/60 mt-4", refClassName)}>{refText}</p>
    </section>
  );
}
