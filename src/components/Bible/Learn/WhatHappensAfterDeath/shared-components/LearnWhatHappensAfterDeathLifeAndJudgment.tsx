"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatHappensAfterDeathLifeAndJudgmentProps {
  locale: "en" | "vi";
  lifeHeading: string;
  lifeBody: ReactNode;
  judgmentHeading: string;
  judgmentQuote: ReactNode;
  judgmentBody: ReactNode;
}

export function LearnWhatHappensAfterDeathLifeAndJudgment({
  locale,
  lifeHeading,
  lifeBody,
  judgmentHeading,
  judgmentQuote,
  judgmentBody,
}: LearnWhatHappensAfterDeathLifeAndJudgmentProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const headingFont =
    locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";

  return (
    <>
      {/* Life Continues */}
      <section className="mb-10">
        <h2 className={cn(headingFont, "text-foreground mb-4 text-2xl font-semibold")}>
          {lifeHeading}
        </h2>
        <p className={cn("text-muted-foreground mb-4 leading-relaxed", bodyClassUp)}>
          {lifeBody}
        </p>
      </section>

      {/* Accountability */}
      <section className="border-border bg-card mb-10 rounded-2xl border p-6">
        <h2
          className={cn(
            headingFont,
            "text-foreground mb-3 text-xl font-semibold"
          )}
        >
          {judgmentHeading}
        </h2>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          {judgmentQuote}
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          {judgmentBody}
        </p>
      </section>
    </>
  );
}


