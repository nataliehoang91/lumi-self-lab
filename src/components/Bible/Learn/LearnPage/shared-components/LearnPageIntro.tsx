"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnPageIntroProps {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
  /** When "vi", use Vietnamese flashcard font for title and subtitle. */
  locale?: "en" | "vi";
}

export function LearnPageIntro({ eyebrow, title, subtitle, locale }: LearnPageIntroProps) {
  const { h1Class, subtitleClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const subtitleFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <div className="mb-16">
      <p
        className={cn(
          "text-muted-foreground mb-4 text-xs font-semibold tracking-[0.2em] uppercase",
          subtitleFont
        )}
      >
        {eyebrow}
      </p>
      <h1
        className={cn(
          "leading-tight font-semibold text-balance",
          titleFont,
          h1Class
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "text-muted-foreground mt-4 max-w-xl leading-relaxed font-light",
          subtitleClass,
          subtitleFont
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
