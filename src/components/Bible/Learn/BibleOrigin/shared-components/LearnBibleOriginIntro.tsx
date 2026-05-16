"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginIntroProps {
  moduleNum: string;
  title: string;
  intro: ReactNode;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnBibleOriginIntro({
  moduleNum,
  title,
  intro,
  locale,
  bodyBright,
}: LearnBibleOriginIntroProps) {
  const { bodyClass, bodyClassUp, h1Class } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <div className="mb-12 max-w-2xl">
      <p className={cn("text-second mb-3 font-mono font-medium", bodyClass)}>
        {moduleNum}
      </p>
      <h1
        className={cn(
          "text-foreground leading-tight font-semibold text-balance",
          titleFont,
          h1Class
        )}
      >
        {title}
      </h1>
      <p className={cn(bodyColor, "mt-4 leading-relaxed", bodyFont, bodyClassUp)}>
        {intro}
      </p>
    </div>
  );
}
