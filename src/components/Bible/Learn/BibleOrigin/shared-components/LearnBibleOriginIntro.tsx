"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginIntroProps {
  moduleNum: string;
  title: string;
  intro: string;
}

export function LearnBibleOriginIntro({ moduleNum, title, intro }: LearnBibleOriginIntroProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <div className="mb-12">
      <p className="text-xs font-mono text-second mb-3">{moduleNum}</p>
      <BibleHeading
        level="h1"
        className="font-bible-english font-semibold text-foreground leading-tight text-balance"
      >
        {title}
      </BibleHeading>
      <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>{intro}</p>
    </div>
  );
}
