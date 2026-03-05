"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginIntroProps {
  moduleNum: string;
  title: string;
  intro: string;
}

export function LearnBibleOriginIntro({
  moduleNum,
  title,
  intro,
}: LearnBibleOriginIntroProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <div className="mb-12">
      <p className="text-second mb-3 font-mono text-xs">{moduleNum}</p>
      <BibleHeading
        level="h1"
        className="font-bible-english text-foreground leading-tight font-semibold
          text-balance"
      >
        {title}
      </BibleHeading>
      <p className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClass)}>
        {intro}
      </p>
    </div>
  );
}
