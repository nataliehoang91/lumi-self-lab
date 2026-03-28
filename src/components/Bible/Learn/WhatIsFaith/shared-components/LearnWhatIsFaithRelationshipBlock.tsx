"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnWhatIsFaithRelationshipBlockProps {
  title: string;
  /** First body paragraph (may include inline links). */
  main: ReactNode;
  /** Second paragraph, separated by a top border. */
  footer: ReactNode;
  /** When "vi", title uses Vietnamese flashcard font. */
  locale?: "en" | "vi";
  className?: string;
}

export function LearnWhatIsFaithRelationshipBlock({
  title,
  main,
  footer,
  locale = "en",
  className,
}: LearnWhatIsFaithRelationshipBlockProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const titleFont =
    locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";

  return (
    <blockquote
      className={cn(
        `bg-primary-light/5 border-l-primary mb-12 space-y-4 rounded-r-xl border-l-4
        py-2 pr-6 pl-6 not-italic`,
        className
      )}
    >
      <p className={cn(titleFont, "leading-snug font-semibold", bodyClassUp)}>{title}</p>
      <p className={cn("leading-relaxed", bodyClassUp)}>{main}</p>
      <p className={cn("border-border border-t pt-4 leading-relaxed", bodyClassUp)}>
        {footer}
      </p>
    </blockquote>
  );
}
