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
    <section
      className="bg-primary-light/10 border-primary-dark/30 animate-in fade-in mb-10 gap-6
        space-y-4 rounded-2xl border p-6 duration-300"
    >
      <BibleHeading
        level="h2"
        className="font-bible-english text-foreground text-xl font-semibold md:text-2xl"
      >
        {reliableTitle}
      </BibleHeading>
      <p className={cn("leading-relaxed", bodyClass)}>{reliableP1}</p>
      <p className={cn("leading-relaxed", bodyClass)}>{reliableP2}</p>
    </section>
  );
}
