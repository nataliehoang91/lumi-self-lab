"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface PrayerStep {
  letter: string;
  stepName: string;
  desc: string;
}

export interface LearnWhatIsFaithPrayerSectionProps {
  prayerTitle: string;
  prayerIntro: string;
  steps: readonly PrayerStep[];
  /** When "vi", use Vietnamese flashcard font. */
  locale?: "en" | "vi";
}

export function LearnWhatIsFaithPrayerSection({
  prayerTitle,
  prayerIntro,
  steps,
  locale,
}: LearnWhatIsFaithPrayerSectionProps) {
  const { bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section className="mb-10">
      <h2 className={cn("text-foreground mb-2 text-2xl font-semibold", titleFont)}>
        {prayerTitle}
      </h2>
      <p className={cn("text-muted-foreground mb-5", bodyClass, bodyFont)}>
        {prayerIntro}
      </p>
      <div className="space-y-2">
        {steps.map((p) => (
          <div
            key={p.letter}
            className="bg-card border-sage-dark/20 flex gap-4 rounded-xl border p-4"
          >
            <div
              className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0
                  items-center justify-center rounded-lg font-mono text-xs font-semibold"
            >
              {p.letter}
            </div>
            <div>
              <p className={cn("text-foreground font-medium", bodyClass, bodyFont)}>
                {p.stepName}
              </p>
              <p
                className={cn(
                  "text-muted-foreground mt-0.5 leading-relaxed",
                  bodyClass,
                  bodyFont
                )}
              >
                {p.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
