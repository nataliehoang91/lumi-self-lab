"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";

export interface LearnWhatIsFaithGraceSectionProps {
  graceTitle: string;
  graceBody: string;
  graceQuote: string;
  graceRef: string;
  /** When set, footnote (graceRef) is rendered as a link to the verse (e.g. read page). */
  graceFootnoteHref?: string;
}

export function LearnWhatIsFaithGraceSection({
  graceTitle,
  graceBody,
  graceQuote,
  graceRef,
  graceFootnoteHref,
}: LearnWhatIsFaithGraceSectionProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <section className="mb-10">
      <h2 className="font-bible-english text-foreground mb-3 text-2xl font-semibold">
        {graceTitle}
      </h2>
      <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClass)}>
        {graceBody}
      </p>
      <div
        className="md:bg-primary-50/20 md:border-primary-100 mx-auto justify-center
          rounded-xl bg-transparent px-6 py-6 md:border"
      >
        <QuoteCard
          quote={graceQuote}
          footnoteAlign="center"
          footnote={graceRef}
          footnoteHref={graceFootnoteHref}
          className="mt-4"
        />
      </div>
    </section>
  );
}
