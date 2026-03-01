"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LearnLessonIntroProps {
  moduleNum: string;
  title: string;
  intro1: ReactNode;
  intro1Quote: ReactNode;
  /** Intro paragraph after the quote (e.g. with <strong>Jesus</strong> inline). */
  children: ReactNode;
}

export function LearnLessonIntro({
  moduleNum,
  title,
  intro1,
  intro1Quote,
  children,
}: LearnLessonIntroProps) {
  const { h1Class, introClass } = useLearnFontClasses();

  return (
    <div className="mb-12">
      <p className="text-xs font-mono text-second mb-3" aria-label={moduleNum.replace(" / ", " of ")}>
        {moduleNum}
      </p>
      <h1
        className={cn(
          "font-bible-english font-semibold text-foreground leading-tight text-balance",
          h1Class
        )}
      >
        {title}
      </h1>

      <p className={cn("mt-4 text-muted-foreground leading-relaxed", introClass)}>{intro1}</p>

      <blockquote className="mt-3 pl-4 border-l-2 border-primary/40 not-italic" cite="">
        <p className={cn("font-semibold text-foreground leading-relaxed", introClass)}>
          &ldquo;{intro1Quote}&rdquo;
        </p>
      </blockquote>

      <p className={cn("mt-4 text-muted-foreground leading-relaxed", introClass)}>{children}</p>
    </div>
  );
}
