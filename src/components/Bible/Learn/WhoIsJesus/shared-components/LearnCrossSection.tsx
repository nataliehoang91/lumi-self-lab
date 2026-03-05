"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnCrossSectionProps {
  title: string;
  paragraph1: ReactNode;
  paragraph2: ReactNode;
  /** Reference(s), e.g. string "1 Cor 15:3–8" or <BibleVerseLink>…</BibleVerseLink>. */
  refText: ReactNode;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnCrossSection({
  title,
  paragraph1,
  paragraph2,
  refText,
  locale,
}: LearnCrossSectionProps) {
  const { bodyClass, subBodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section
      className="bg-card border-sage-dark/20 mb-10 rounded-2xl border p-6"
      aria-labelledby="cross-section-title"
    >
      <h2
        id="cross-section-title"
        className={cn("text-foreground mb-3 text-xl font-semibold", titleFont)}
      >
        {title}
      </h2>
      <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClass, bodyFont)}>
        {paragraph1}
      </p>
      <p className={cn("text-muted-foreground leading-relaxed", bodyClass, bodyFont)}>
        {paragraph2}
      </p>
      <p className={cn("text-muted-foreground/60 mt-4 font-mono", subBodyClass)}>
        {refText}
      </p>
    </section>
  );
}
