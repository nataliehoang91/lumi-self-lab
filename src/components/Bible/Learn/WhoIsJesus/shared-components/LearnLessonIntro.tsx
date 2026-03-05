"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnLessonIntroProps {
  moduleNum: string;
  title: string;
  intro1: string | ReactNode;
  intro1Quote: string | ReactNode;
  /** Intro paragraph after the quote (e.g. with <strong>Jesus</strong> inline). */
  children: string | ReactNode;
}

export function LearnLessonIntro({
  moduleNum,
  title,
  intro1,
  intro1Quote,
  children,
}: LearnLessonIntroProps) {
  const { h1Class, introClass } = useBibleFontClasses();

  return (
    <div className="mb-12 space-y-6">
      <p
        className="text-second mb-3 font-mono text-xs"
        aria-label={moduleNum.replace(" / ", " of ")}
      >
        {moduleNum}
      </p>
      <h1
        className={cn(
          "font-bible-english text-foreground leading-tight font-semibold text-balance",
          h1Class
        )}
      >
        {title}
      </h1>

      {typeof intro1 === "string" ? (
        <p className={cn("text-muted-foreground mt-4 leading-relaxed", introClass)}>
          {intro1}
        </p>
      ) : (
        intro1
      )}

      <blockquote className="border-primary/40 mt-3 border-l-2 pl-4 not-italic" cite="">
        <p className={cn("text-foreground leading-relaxed font-semibold", introClass)}>
          &ldquo;{intro1Quote}&rdquo;
        </p>
      </blockquote>

      {typeof children === "string" ? (
        <p className={cn("text-muted-foreground mt-4 leading-relaxed", introClass)}>
          {children}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
