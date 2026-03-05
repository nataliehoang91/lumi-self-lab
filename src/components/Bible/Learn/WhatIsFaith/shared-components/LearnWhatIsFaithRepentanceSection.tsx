"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsFaithRepentanceSectionProps {
  repentanceTitle: string;
  repentanceBody: string;
  repentanceRef: string;
  /** When set, repentanceRef is rendered as a link to the verse (e.g. read page). */
  repentanceRefHref?: string;
}

export function LearnWhatIsFaithRepentanceSection({
  repentanceTitle,
  repentanceBody,
  repentanceRef,
  repentanceRefHref,
}: LearnWhatIsFaithRepentanceSectionProps) {
  const { bodyClass } = useBibleFontClasses();

  return (
    <section className="bg-card border-sage-dark/20 mb-10 rounded-2xl border p-6">
      <h2 className="font-bible-english text-foreground mb-3 text-xl font-semibold">
        {repentanceTitle}
      </h2>
      <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
        {repentanceBody}
      </p>
      <p className="text-muted-foreground/60 mt-4 font-mono text-xs">
        {repentanceRefHref ? (
          <a
            href={repentanceRefHref}
            className="text-second-600 hover:text-second-800 font-mono underline
              underline-offset-4 transition-colors"
          >
            {repentanceRef}
          </a>
        ) : (
          repentanceRef
        )}
      </p>
    </section>
  );
}
