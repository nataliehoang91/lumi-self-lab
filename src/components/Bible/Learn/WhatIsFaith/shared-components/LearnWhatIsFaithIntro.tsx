"use client";

import type { ReactNode } from "react";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsFaithIntroProps {
  moduleNum: string;
  title: string;
  intro: ReactNode;
}

export function LearnWhatIsFaithIntro({
  moduleNum,
  title,
  intro,
}: LearnWhatIsFaithIntroProps) {
  const { bodyClass, h1Class } = useLearnFontClasses();

  return (
    <div className="mb-12">
      <p className="text-second mb-3 font-mono text-xs">{moduleNum}</p>
      <h1
        className={cn(
          "font-bible-english text-foreground leading-tight font-semibold text-balance",
          h1Class
        )}
      >
        {title}
      </h1>
      <p className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClass)}>
        {intro}
      </p>
    </div>
  );
}
