"use client";

import type { ReactNode } from "react";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface GlossaryItem {
  term: string | ReactNode;
  def: string | ReactNode;
}

export interface LearnWhatIsBibleGlossaryProps {
  glossaryTitle: string;
  glossary: readonly GlossaryItem[];
}

export function LearnWhatIsBibleGlossary({
  glossaryTitle,
  glossary,
}: LearnWhatIsBibleGlossaryProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-14">
      <h2
        className={cn("font-bible-english font-semibold text-foreground mb-4", bodyClass)}
      >
        {glossaryTitle}
      </h2>
      <LearnAccordion items={glossary} />
    </section>
  );
}
