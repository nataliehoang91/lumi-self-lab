"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginReliableProps {
  reliableTitle: string;
  reliableP1: ReactNode;
  reliableP2: ReactNode;
  reliableP3?: ReactNode;
  locale?: "en" | "vi";
}

export function LearnBibleOriginReliable({
  reliableTitle,
  reliableP1,
  reliableP2,
  reliableP3,
  locale,
}: LearnBibleOriginReliableProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section
      className="bg-primary-light/10 theme-warm:bg-second/8 border-primary-dark/20 theme-warm:border-second/25 mb-10 rounded-2xl border p-6 md:p-8"
    >
      {/* Pill label */}
      <div className="bg-primary/15 theme-warm:bg-second/15 mb-4 inline-flex items-center rounded-full px-3 py-1">
        <span className="text-primary-700 theme-warm:text-second dark:text-primary text-xs font-semibold tracking-wide uppercase">
          {reliableTitle}
        </span>
      </div>

      <h2 className={cn("text-foreground mb-4 text-3xl font-bold leading-snug", titleFont)}>
        {reliableTitle}
      </h2>

      <div className={cn("space-y-4 text-lg leading-relaxed", bodyClassUp, bodyFont)}>
        <p>{reliableP1}</p>
        <p>{reliableP2}</p>
        {reliableP3 && <p>{reliableP3}</p>}
      </div>
    </section>
  );
}
