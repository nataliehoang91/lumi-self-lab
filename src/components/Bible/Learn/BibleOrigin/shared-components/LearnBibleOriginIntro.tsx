"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginIntroProps {
  moduleNum: string;
  title: string;
  intro: string;
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
  const { bodyClass, subBodyClassUp, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <div className="mb-12">
      <p className={cn("text-second mb-3 font-mono font-medium", bodyClass)}>
        {moduleNum}
      </p>
      <BibleHeading
        level="h1"
        className={cn(
          "text-foreground leading-tight font-semibold text-balance",
          titleFont
        )}
      >
        {title}
      </BibleHeading>
      <p className={cn(bodyColor, "mt-4 leading-relaxed", bodyFont, bodyClassUp)}>
        {intro}
      </p>
    </div>
  );
}
