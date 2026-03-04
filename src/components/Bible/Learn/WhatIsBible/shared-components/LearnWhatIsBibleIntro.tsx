"use client";

import type { ReactNode } from "react";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsBibleIntroProps {
  moduleNum: string;
  title: string;
  /** 7 parts: [0] text, [1] strong, [2] text, [3] strong, [4] text, [5] strong, [6] text or ReactNode */
  introParts: readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string | ReactNode,
  ];
}

export function LearnWhatIsBibleIntro({
  moduleNum,
  title,
  introParts,
}: LearnWhatIsBibleIntroProps) {
  const { bodyClass, h1Class } = useLearnFontClasses();

  return (
    <div className="mb-12">
      <p className="text-second mb-3 font-mono text-sm">{moduleNum}</p>
      <h1
        className={cn(
          "font-bible-english text-foreground leading-tight font-semibold text-balance",
          h1Class
        )}
      >
        {title}
      </h1>
      <p className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClass)}>
        {introParts[0]}
        <strong className="text-foreground font-semibold">{introParts[1]}</strong>
        {introParts[2]}
        <strong className="text-foreground font-semibold">{introParts[3]}</strong>
        {introParts[4]}
        <strong className="text-foreground font-semibold">{introParts[5]}</strong>
        {introParts[6]}
      </p>
    </div>
  );
}
