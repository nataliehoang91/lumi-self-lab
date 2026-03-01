"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";

export interface FaqItem {
  q: string;
  a: string;
}

export interface LearnBibleOriginFaqProps {
  faqTitle: string;
  faq: readonly FaqItem[];
}

export function LearnBibleOriginFaq({ faqTitle, faq }: LearnBibleOriginFaqProps) {
  return (
    <section className="mb-14">
      <BibleHeading
        level="h2"
        className="font-bible-english font-semibold text-foreground mb-4 text-xl md:text-2xl"
      >
        {faqTitle}
      </BibleHeading>
      <LearnAccordion items={faq.map((f) => ({ term: f.q, def: f.a }))} />
    </section>
  );
}
