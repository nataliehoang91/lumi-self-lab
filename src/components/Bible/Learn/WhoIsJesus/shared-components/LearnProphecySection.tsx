"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnProphecyItem {
  prophecy: string;
  /** OT reference (string or e.g. <BibleVerseLink>). */
  ref: ReactNode;
  /** Fulfilment reference (string or e.g. <BibleVerseLink>). */
  fulfilled: ReactNode;
}

export interface LearnProphecySectionProps {
  title: string;
  intro: ReactNode;
  items: LearnProphecyItem[];
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnProphecySection({ title, intro, items, locale }: LearnProphecySectionProps) {
  const { bodyClass, subBodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section className="mb-10" aria-labelledby="prophecy-section-title">
      <h2
        id="prophecy-section-title"
        className={cn("text-foreground mb-2 text-xl font-semibold", titleFont)}
      >
        {title}
      </h2>
      <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass, bodyFont)}>
        {intro}
      </p>
      <ul className="m-0 list-none space-y-2 p-0">
        {items.map((item, i) => (
          <li
            key={i}
            className="bg-card border-sage-dark/20 flex items-start gap-4 rounded-xl
              border px-4 py-3"
          >
            <span
              className="bg-muted-foreground/40 mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className={cn("text-foreground", bodyClass, bodyFont)}>{item.prophecy}</p>
              <p
                className={cn("text-muted-foreground/70 mt-0.5 font-mono", subBodyClass)}
              >
                {item.ref} → {item.fulfilled}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
