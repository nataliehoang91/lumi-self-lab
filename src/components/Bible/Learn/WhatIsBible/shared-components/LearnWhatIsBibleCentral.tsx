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
    <section
      className="bg-primary-light/10 border-primary-dark/30 mb-12 gap-6 rounded-xl border
        p-6"
    >
      <h2 className="font-bible-english text-foreground mb-3 text-xl font-semibold">
        {centralTitle}
      </h2>
      <p className={cn("leading-relaxed", bodyClass)}>{centralBody}</p>
    </section>
  );
}
