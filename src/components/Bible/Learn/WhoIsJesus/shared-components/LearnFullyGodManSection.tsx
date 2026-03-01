"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LearnFullyGodManSectionProps {
  sectionTitle: string;
  leftTitle: string;
  leftBody: ReactNode;
  leftRef: string;
  rightTitle: string;
  rightBody: ReactNode;
  rightRef: string;
  /** Optional class for body and ref text (e.g. text-sm from useBibleApp fontSize). */
  bodyClassName?: string;
  refClassName?: string;
}

export function LearnFullyGodManSection({
  sectionTitle,
  leftTitle,
  leftBody,
  leftRef,
  rightTitle,
  rightBody,
  rightRef,
  bodyClassName,
  refClassName,
}: LearnFullyGodManSectionProps) {
  return (
    <section className="mb-10" aria-labelledby="fully-section-title">
      <h2
        id="fully-section-title"
        className="font-bible-english text-2xl font-semibold text-foreground mb-4"
      >
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 bg-card border border-sage-dark/20 rounded-2xl">
          <p className="font-semibold text-foreground mb-2">{leftTitle}</p>
          <p className={cn("text-sm text-muted-foreground leading-relaxed", bodyClassName)}>
            {leftBody}
          </p>
          <p className={cn("text-xs text-muted-foreground/60 mt-3 font-mono", refClassName)}>
            {leftRef}
          </p>
        </div>
        <div className="p-5 bg-card border border-sage-dark/20 rounded-2xl">
          <p className="font-semibold text-foreground mb-2">{rightTitle}</p>
          <p className={cn("text-sm text-muted-foreground leading-relaxed", bodyClassName)}>
            {rightBody}
          </p>
          <p className={cn("text-xs text-muted-foreground/60 mt-3 font-mono", refClassName)}>
            {rightRef}
          </p>
        </div>
      </div>
    </section>
  );
}
