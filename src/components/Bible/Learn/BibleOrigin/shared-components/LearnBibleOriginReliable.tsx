"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginReliableProps {
  reliableTitle: string;
  reliableP1: string;
  reliableP2: string;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnBibleOriginReliable({
  reliableTitle,
  reliableP1,
  reliableP2,
  locale,
}: LearnBibleOriginReliableProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section
      className="bg-primary-light/10 border-primary-dark/30 animate-in fade-in mb-10 gap-6
        space-y-4 rounded-2xl border p-6 duration-300"
    >
      <BibleHeading
        level="h2"
        className={cn("text-foreground text-xl font-semibold md:text-2xl", titleFont)}
      >
        {reliableTitle}
      </BibleHeading>
      <p className={cn("leading-relaxed", bodyFont, bodyClassUp)}>{reliableP1}</p>
      <p className={cn("leading-relaxed", bodyFont, bodyClassUp)}>{reliableP2}</p>
    </section>
  );
}
