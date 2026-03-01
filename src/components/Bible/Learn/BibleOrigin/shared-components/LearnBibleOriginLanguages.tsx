"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
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
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-10">
      <BibleHeading level="h2" className="font-bible-english font-semibold text-foreground mb-4">
        {originalLanguages}
      </BibleHeading>
      <div className="grid grid-cols-3 gap-3">
        {LANG_SCRIPT.map((l, i) => (
          <div
            key={i}
            className="p-4 bg-card border border-sage-dark/20 rounded-xl text-center"
          >
            <p className="font-bible-english text-xl text-muted-foreground/30 select-none leading-none">
              {l.script}
            </p>
            <p className="font-bible-english text-3xl font-semibold text-foreground mt-1">
              {l.pct}
            </p>
            <p className={cn("font-medium text-foreground mt-1", bodyClass)}>{lang[i]}</p>
            <p className={cn("text-muted-foreground mt-0.5 leading-snug", bodyClass)}>
              {langNote[i]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
