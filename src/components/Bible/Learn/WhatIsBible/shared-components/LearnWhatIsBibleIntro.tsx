"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsBibleIntroProps {
  moduleNum: string;
  title: string;
  /** When "vi", use Vietnamese flashcard font for title and intro. */
  locale?: "en" | "vi";
  /** Optional segmented intro with emphasised parts. */
  introParts?: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string | ReactNode,
  ];
  /** Simple intro as a single paragraph / node. Takes precedence over introParts. */
  intro?: ReactNode;
  /** Use full-contrast text for intro body (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsBibleIntro({
  moduleNum,
  title,
  locale,
  introParts,
  intro,
  bodyBright,
}: LearnWhatIsBibleIntroProps) {
  const { h1Class, bodyClass, subtitleClass } = useBibleFontClasses();
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
      <p
        className={cn(
          bodyColor,
          "mt-4 max-w-3xl leading-relaxed font-light opacity-90",
          subtitleClass,
          introFont
        )}
      >
        {intro ??
          (introParts && (
            <>
              {introParts[0]}
              <strong className="text-foreground font-semibold">{introParts[1]}</strong>
              {introParts[2]}
              <strong className="text-foreground font-semibold">{introParts[3]}</strong>
              {introParts[4]}
              <strong className="text-foreground font-semibold">{introParts[5]}</strong>
              {introParts[6]}
            </>
          ))}
      </p>
    </div>
  );
}
