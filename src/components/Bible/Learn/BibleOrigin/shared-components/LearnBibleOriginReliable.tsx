"use client";

import { BibleHeading } from "@/components/Bible/BibleHeading";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LearnBibleOriginReliableProps {
  reliableTitle: string;
  reliableP1: string;
  reliableP2: string;
}

export function LearnBibleOriginReliable({
  reliableTitle,
  reliableP1,
  reliableP2,
}: LearnBibleOriginReliableProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-10 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
      <BibleHeading
        level="h2"
        className="font-bible-english font-semibold text-foreground text-xl md:text-2xl"
      >
        {reliableTitle}
      </BibleHeading>
      <p className={cn("leading-relaxed", bodyClass)}>{reliableP1}</p>
      <p className={cn("leading-relaxed", bodyClass)}>{reliableP2}</p>
    </section>
  );
}
