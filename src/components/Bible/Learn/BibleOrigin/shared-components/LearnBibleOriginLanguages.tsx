"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { LANG_SCRIPT } from "./constants";

export interface LearnBibleOriginLanguagesProps {
  originalLanguages: string;
  lang: readonly [string, string, string];
  langNote: readonly [string, string, string];
}

export function LearnBibleOriginLanguages({
  originalLanguages,
  lang,
  langNote,
}: LearnBibleOriginLanguagesProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <section className="mb-10">
      <BibleHeading
        level="h2"
        className="font-bible-english text-foreground mb-4 font-semibold"
      >
        {originalLanguages}
      </BibleHeading>
      <div className="grid grid-cols-3 gap-3">
        {LANG_SCRIPT.map((l, i) => (
          <div
            key={i}
            className="bg-card border-sage-dark/20 rounded-xl border p-4 text-center"
          >
            <p
              className="font-bible-english text-muted-foreground/30 text-xl leading-none
                select-none"
            >
              {l.script}
            </p>
            <p className="font-bible-english text-foreground mt-1 text-3xl font-semibold">
              {l.pct}
            </p>
            <p className={cn("text-foreground mt-1 font-medium", bodyClass)}>{lang[i]}</p>
            <p className={cn("text-muted-foreground mt-0.5 leading-snug", bodyClass)}>
              {langNote[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
