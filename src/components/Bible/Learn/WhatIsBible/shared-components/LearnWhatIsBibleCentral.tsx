"use client";

import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsBibleCentralProps {
  centralTitle: string;
  centralBody: string;
}

export function LearnWhatIsBibleCentral({
  centralTitle,
  centralBody,
}: LearnWhatIsBibleCentralProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section className="mb-12 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-xl">
      <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
        {centralTitle}
      </h2>
      <p className={cn("leading-relaxed", bodyClass)}>{centralBody}</p>
    </section>
  );
}
