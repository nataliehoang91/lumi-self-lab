"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { LANG_SCRIPT } from "./constants";

export interface LearnBibleOriginLanguagesProps {
  originalLanguages: string;
  lang: readonly [string, string, string];
  langNote: readonly [string, string, string];
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnBibleOriginLanguages({
  originalLanguages,
  lang,
  langNote,
  locale,
}: LearnBibleOriginLanguagesProps) {
  const { bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section className="mb-10">
      <BibleHeading
        level="h2"
        className={cn("text-foreground mb-4 font-semibold", titleFont)}
      >
        {originalLanguages}
      </BibleHeading>
      <div className="grid grid-cols-3 gap-3">
        {LANG_SCRIPT.map((l, i) => (
          <div
            key={i}
            className="bg-card border-sage-dark/20 space-y-3 rounded-xl border p-4
              text-center"
          >
            <p
              className={cn(
                "text-muted-foreground text-xl leading-none select-none",
                titleFont
              )}
            >
              {l.script}
            </p>
            <p className={cn("text-foreground mt-1 text-3xl font-semibold", titleFont)}>
              {l.pct}
            </p>
            <p className={cn("text-foreground mt-1 font-medium", bodyClass, bodyFont)}>{lang[i]}</p>
            <p className={cn("text-muted-foreground mt-0.5 leading-snug", bodyClass, bodyFont)}>
              {langNote[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
