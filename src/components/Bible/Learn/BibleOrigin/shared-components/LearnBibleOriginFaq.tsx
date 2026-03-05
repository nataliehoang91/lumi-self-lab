"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export interface LearnBibleOriginFaqProps {
  faqTitle: string;
  faq: readonly FaqItem[];
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnBibleOriginFaq({ faqTitle, faq, locale }: LearnBibleOriginFaqProps) {
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  return (
    <section className="mb-14">
      <BibleHeading
        level="h2"
        className={cn(
          "text-foreground mb-4 text-xl font-semibold md:text-2xl",
          titleFont
        )}
      >
        {faqTitle}
      </BibleHeading>
      <LearnAccordion items={faq.map((f) => ({ term: f.q, def: f.a }))} locale={locale} />
    </section>
  );
}
