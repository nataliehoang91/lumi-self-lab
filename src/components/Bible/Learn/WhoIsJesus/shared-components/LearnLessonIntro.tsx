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
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnLessonIntro({
  moduleNum,
  title,
  intro1,
  intro1Quote,
  children,
  locale,
  bodyBright,
}: LearnLessonIntroProps) {
  const { h1Class, bodyClassUp, bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const introFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <div className="mb-12 space-y-6">
      <p className={cn("text-second mb-3 font-mono font-medium", bodyClass)}>
        {moduleNum}
      </p>
      <h1
        className={cn(
          "text-foreground leading-tight font-semibold text-balance",
          titleFont,
          h1Class
        )}
      >
        {title}
      </h1>

      {typeof intro1 === "string" ? (
        <p className={cn(bodyColor, "mt-4 leading-relaxed", bodyClassUp, introFont)}>
          {intro1}
        </p>
      ) : (
        intro1
      )}

      <blockquote className="border-primary/40 mt-3 border-l-2 pl-4 not-italic" cite="">
        <p
          className={cn(
            "text-foreground leading-relaxed font-semibold",
            bodyClassUp,
            introFont
          )}
        >
          &ldquo;{intro1Quote}&rdquo;
        </p>
      </blockquote>

      {typeof children === "string" ? (
        <p className={cn(bodyColor, "mt-4 leading-relaxed", bodyClassUp, introFont)}>
          {children}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
