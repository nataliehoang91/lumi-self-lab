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
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsFaithPrayerSection({
  prayerTitle,
  prayerIntro,
  steps,
  locale,
  bodyBright,
}: LearnWhatIsFaithPrayerSectionProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  return (
    <section className="mb-10">
      <h2 className={cn("text-foreground mb-2 text-2xl font-semibold", titleFont)}>
        {prayerTitle}
      </h2>
      <p className={cn(bodyColor, "mb-5", bodyClassUp, bodyFont)}>{prayerIntro}</p>
      <div className="space-y-2">
        {steps.map((p) => (
          <div
            key={p.letter}
            className="bg-card border-sage-dark/20 flex gap-4 rounded-xl border p-4"
          >
            <div
              className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center
                justify-center rounded-lg font-mono text-xs font-semibold"
            >
              {p.letter}
            </div>
            <div>
              <p className={cn("text-foreground font-bold", titleFont, bodyFont)}>
                {p.stepName}
              </p>
              <p
                className={cn(bodyColor, "mt-0.5 leading-relaxed", bodyClassUp, bodyFont)}
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
