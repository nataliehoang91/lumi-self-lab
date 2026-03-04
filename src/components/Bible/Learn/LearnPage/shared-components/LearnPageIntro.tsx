"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LearnPageIntroProps {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
}

export function LearnPageIntro({ eyebrow, title, subtitle }: LearnPageIntroProps) {
  const { h1Class, subtitleClass } = useLearnFontClasses();

  return (
    <div className="mb-16">
      <p
        className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.2em]
          uppercase"
      >
        {eyebrow}
      </p>
      <h1
        className={cn(
          "font-bible-english leading-tight font-semibold text-balance",
          h1Class
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "text-muted-foreground mt-4 max-w-xl leading-relaxed font-light",
          subtitleClass
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
