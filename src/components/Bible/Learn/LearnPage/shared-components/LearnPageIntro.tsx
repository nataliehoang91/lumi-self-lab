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
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
        {eyebrow}
      </p>
      <h1 className={cn("font-bible-english font-semibold leading-tight text-balance", h1Class)}>
        {title}
      </h1>
      <p
        className={cn(
          "mt-4 font-light text-muted-foreground leading-relaxed max-w-xl",
          subtitleClass
        )}
      >
        {subtitle}
      </p>
    </div>
  );
}
