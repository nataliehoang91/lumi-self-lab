"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LearnWhatIsFaithRepentanceSectionProps {
  repentanceTitle: string;
  repentanceBody: string;
  repentanceRef: string;
  /** When set, repentanceRef is rendered as a link to the verse (e.g. read page). */
  repentanceRefHref?: string;
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsFaithRepentanceSection({
  repentanceTitle,
  repentanceBody,
  repentanceRef,
  repentanceRefHref,
  locale,
  bodyBright,
}: LearnWhatIsFaithRepentanceSectionProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";
  const refColor = bodyBright ? "text-foreground/70" : "text-muted-foreground/60";

  return (
    <section className="bg-card border-sage-dark/20 mb-10 rounded-2xl border p-6">
      <h2 className={cn("text-foreground mb-3 text-xl font-semibold", titleFont)}>
        {repentanceTitle}
      </h2>
      <p className={cn(bodyColor, "leading-relaxed", bodyClassUp, bodyFont)}>
        {repentanceBody}
      </p>
      <p className={cn(refColor, "mt-4 font-mono text-xs", bodyClass)}>
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
