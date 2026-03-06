"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsFaithIntroProps {
  moduleNum: string;
  title: string;
  intro: ReactNode;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsFaithIntro({
  moduleNum,
  title,
  intro,
  locale,
  bodyBright,
}: LearnWhatIsFaithIntroProps) {
  const { bodyClass, h1Class, subBodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const introFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <div className="mb-12">
      <p className={cn("text-second mb-3 font-mono font-medium", subBodyClassUp)}>
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
        className={cn(bodyColor, "mt-4 leading-relaxed", bodyClass, introFont)}
      >
        {intro}
      </p>
    </div>
  );
}
