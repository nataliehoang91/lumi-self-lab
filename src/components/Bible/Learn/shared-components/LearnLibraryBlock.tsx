"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { useLocaleFonts } from "@/components/Bible/global/utils";

export interface LearnLibraryBlockProps {
  /** When "vi", use Vietnamese flashcard font; otherwise English Bible serif. */
  locale?: "en" | "vi";
  title: ReactNode;
  firstParagraph: ReactNode;
  secondParagraph: ReactNode;
}

export function LearnLibraryBlock({
  locale,
  title,
  firstParagraph,
  secondParagraph,
}: LearnLibraryBlockProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const { titleFont, bodyFont } = useLocaleFonts(locale);

  const bodyClass = cn("leading-relaxed", bodyClassUp, bodyFont);

  return (
    <blockquote
      className="bg-primary-light/5 border-l-primary mb-12 space-y-4 rounded-r-xl
        border-l-4 py-4 pr-6 pl-6 not-italic"
    >
      <p className={cn("leading-snug font-semibold", bodyClassUp, titleFont)}>{title}</p>
      <p className={cn(bodyClass)}>{firstParagraph}</p>
      <p className={cn("border-border border-t pt-4", bodyClassUp, bodyFont)}>
        {secondParagraph}
      </p>
    </blockquote>
  );
}
