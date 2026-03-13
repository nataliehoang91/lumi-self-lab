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
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsFaithGraceSection({
  graceTitle,
  graceBody,
  graceQuote,
  graceRef,
  graceFootnoteHref,
  locale,
  bodyBright,
}: LearnWhatIsFaithGraceSectionProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <section className="mb-10">
      <h2 className={cn("text-foreground mb-3 text-2xl font-semibold", titleFont)}>
        {graceTitle}
      </h2>
      <p className={cn(bodyColor, "mb-3 leading-relaxed", bodyClassUp, bodyFont)}>
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
          className={cn(
            "mt-4",
            bodyClass,
            locale === "vi" && "font-vietnamese-flashcard"
          )}
        />
      </div>
    </section>
  );
}
