"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsBibleIntroProps {
  moduleNum: string;
  title: string;
  /** When "vi", use Vietnamese flashcard font for title and intro. */
  locale?: "en" | "vi";
  /** 7 parts: [0] text, [1] strong, [2] text, [3] strong, [4] text, [5] strong, [6] text or ReactNode */
  introParts: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string | ReactNode,
  ];
  /** Use full-contrast text for intro body (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsBibleIntro({
  moduleNum,
  title,
  locale,
  introParts,
  bodyBright,
}: LearnWhatIsBibleIntroProps) {
  const { bodyClassUp, h1Class, subBodyClassUp, bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const introFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <div className="mb-12">
      <p className={cn("text-second mb-3 font-mono font-medium", bodyClass)}>
        {moduleNum}
      </p>{" "}
      <h1
        className={cn(
          "text-foreground leading-tight font-semibold text-balance",
          titleFont,
          h1Class
        )}
      >
        {title}
      </h1>
      <p className={cn(bodyColor, "mt-4 leading-relaxed", bodyClassUp, introFont)}>
        {introParts[0]}
        <strong className="text-foreground font-semibold">{introParts[1]}</strong>
        {introParts[2]}
        <strong className="text-foreground font-semibold">{introParts[3]}</strong>
        {introParts[4]}
        <strong className="text-foreground font-semibold">{introParts[5]}</strong>
        {introParts[6]}
      </p>
    </div>
  );
}
