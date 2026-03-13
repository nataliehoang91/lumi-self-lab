"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhyItMattersProps {
  title: string;
  body?: string;
  children: React.ReactNode;
  /** When "vi", use Vietnamese flashcard font for title and body. */
  locale?: "en" | "vi";
}

export function LearnWhyItMatters({
  title,
  body,
  children,
  locale,
}: LearnWhyItMattersProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section
      className="bg-primary-light/10 border-primary-dark/30 mb-12 gap-6 rounded-xl border
        p-6"
    >
      <h2 className={cn("text-foreground mb-3 text-xl font-semibold", titleFont)}>
        {title}
      </h2>
      {body && <p className={cn("leading-relaxed", bodyClassUp, bodyFont)}>{body}</p>}
      {children}
    </section>
  );
}
