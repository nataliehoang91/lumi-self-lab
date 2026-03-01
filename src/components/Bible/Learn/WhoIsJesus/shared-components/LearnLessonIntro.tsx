"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LearnLessonIntroProps {
  moduleNum: string;
  title: string;
  intro1: ReactNode;
  intro1Quote: ReactNode;
  /** Intro paragraph after the quote (e.g. with <strong>Jesus</strong> inline). */
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  /** Optional class for intro paragraphs and blockquote (e.g. fontSize from useBibleApp). */
  introClassName?: string;
}

export function LearnLessonIntro({
  moduleNum,
  title,
  intro1,
  intro1Quote,
  children,
  className,
  titleClassName,
  introClassName,
}: LearnLessonIntroProps) {
  return (
    <div className={cn("mb-12", className)}>
      <p className="text-xs font-mono text-second mb-3" aria-label={moduleNum.replace(" / ", " of ")}>
        {moduleNum}
      </p>
      <h1
        className={cn(
          "font-bible-english font-semibold text-foreground leading-tight text-balance",
          titleClassName
        )}
      >
        {title}
      </h1>

      <p className={cn("mt-4 text-muted-foreground leading-relaxed", introClassName)}>{intro1}</p>

      <blockquote className="mt-3 pl-4 border-l-2 border-primary/40 not-italic" cite="">
        <p className={cn("font-semibold text-foreground leading-relaxed", introClassName)}>
          &ldquo;{intro1Quote}&rdquo;
        </p>
      </blockquote>

      <p className={cn("mt-4 text-muted-foreground leading-relaxed", introClassName)}>{children}</p>
    </div>
  );
}
