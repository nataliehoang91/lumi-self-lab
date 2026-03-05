"use client";

import type { ReactNode } from "react";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface GlossaryItem {
  term: string | ReactNode;
  def: string | ReactNode;
}

export interface LearnWhatIsFaithGlossaryProps {
  glossaryTitle: string;
  glossary: readonly GlossaryItem[];
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnWhatIsFaithGlossary({
  glossaryTitle,
  glossary,
  locale,
}: LearnWhatIsFaithGlossaryProps) {
  const { bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";

  return (
    <section className="mb-14">
      <h2
        className={cn("text-foreground mb-4 font-semibold", titleFont, bodyClass)}
      >
        {glossaryTitle}
      </h2>
      <LearnAccordion items={glossary} locale={locale} />
    </section>
  );
}
