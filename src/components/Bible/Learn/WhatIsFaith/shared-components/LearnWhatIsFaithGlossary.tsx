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
}

export function LearnWhatIsFaithGlossary({
  glossaryTitle,
  glossary,
}: LearnWhatIsFaithGlossaryProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <section className="mb-14">
      <h2
        className={cn("font-bible-english text-foreground mb-4 font-semibold", bodyClass)}
      >
        {glossaryTitle}
      </h2>
      <LearnAccordion items={glossary} />
    </section>
  );
}
