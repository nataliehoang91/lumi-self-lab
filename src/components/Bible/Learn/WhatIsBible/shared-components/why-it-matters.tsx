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
      className="bg-primary-light/10 theme-warm:bg-second/8 border-primary-dark/20 theme-warm:border-second/25 mb-12 gap-6 rounded-2xl border p-6 md:p-8"
    >
      <div className="bg-primary/15 theme-warm:bg-second/15 mb-4 inline-flex items-center rounded-full px-3 py-1">
        <span className="text-primary-700 theme-warm:text-second dark:text-primary text-xs font-semibold tracking-wide uppercase">
          {title}
        </span>
      </div>
      <h2 className={cn("text-foreground mb-4 text-2xl font-semibold leading-snug", titleFont)}>
        {title}
      </h2>
      {body && <p className={cn("text-lg leading-relaxed", bodyClassUp, bodyFont)}>{body}</p>}
      <div className="[&_p]:text-lg [&_p]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
