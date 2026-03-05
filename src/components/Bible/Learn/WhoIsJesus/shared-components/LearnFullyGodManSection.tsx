"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnFullyGodManSectionProps {
  sectionTitle: string;
  leftTitle: string;
  leftBody: ReactNode;
  leftRef?: ReactNode;
  rightTitle: string;
  rightBody: ReactNode;
  rightRef?: ReactNode;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnFullyGodManSection({
  sectionTitle,
  leftTitle,
  leftBody,
  leftRef,
  rightTitle,
  rightBody,
  rightRef,
  locale,
}: LearnFullyGodManSectionProps) {
  const { bodyClass, subBodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section className="mb-10" aria-labelledby="fully-section-title">
      <h2
        id="fully-section-title"
        className={cn("text-foreground mb-4 text-2xl font-semibold", titleFont)}
      >
        {sectionTitle}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="bg-card border-sage-dark/20 rounded-2xl border p-5">
          <p className={cn("text-foreground mb-2 font-semibold", bodyFont)}>{leftTitle}</p>
          <div className={cn("text-muted-foreground leading-relaxed", bodyClass, bodyFont)}>
            {leftBody}
          </div>
          {leftRef != null && leftRef !== undefined && (
            <p className={cn("text-muted-foreground/60 mt-3 font-mono", subBodyClass)}>
              {leftRef}
            </p>
          )}
        </div>
        <div className="bg-card border-sage-dark/20 rounded-2xl border p-5">
          <p className={cn("text-foreground mb-2 font-semibold", bodyFont)}>{rightTitle}</p>
          <div className={cn("text-muted-foreground leading-relaxed", bodyClass, bodyFont)}>
            {rightBody}
          </div>
          {rightRef != null && rightRef !== undefined && (
            <p className={cn("text-muted-foreground/60 mt-3 font-mono", subBodyClass)}>
              {rightRef}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
