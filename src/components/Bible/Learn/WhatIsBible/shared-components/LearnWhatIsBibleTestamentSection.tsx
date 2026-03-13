"use client";

import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

import type { TestamentSectionConfig } from "./constants";

export interface LearnWhatIsBibleTestamentSectionProps {
  title: string;
  intro: React.ReactNode | string;
  sectionNames: readonly [string, string, string, string];
  sectionDescs: readonly [
    string | React.ReactNode,
    string | React.ReactNode,
    string | React.ReactNode,
    string | React.ReactNode,
  ];
  sections: readonly TestamentSectionConfig[];
  /** Localised label for a single book (e.g. "book", "sách"). Defaults to "book". */
  bookLabelSingular?: string;
  /** Localised label for multiple books (e.g. "books", "sách"). Defaults to "books". */
  bookLabelPlural?: string;
  /** Use full-contrast body text (Bible learn read). Default muted. */
  bodyBright?: boolean;
}

export function LearnWhatIsBibleTestamentSection({
  title,
  intro,
  sectionNames,
  sectionDescs,
  sections,
  bookLabelSingular,
  bookLabelPlural,
  bodyBright,
}: LearnWhatIsBibleTestamentSectionProps) {
  const { bodyClassUp, bodyClass } = useBibleFontClasses();
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  const singular = bookLabelSingular ?? "book";
  const plural = bookLabelPlural ?? "books";

  return (
    <section className="mb-12">
      <h2 className="font-bible-english text-foreground mb-2 text-2xl font-semibold">
        {title}
      </h2>
      {typeof intro === "string" ? (
        <p className={cn(bodyColor, "mb-5 leading-relaxed", bodyClassUp)}>{intro}</p>
      ) : (
        intro
      )}
      <div className="space-y-2">
        {sections.map((s, i) => (
          <div
            key={i}
            className="bg-card border-sage-dark/20 flex gap-4 rounded-xl border p-4"
          >
            <div
              className="bg-second/30 flex h-14 w-14 shrink-0 flex-col items-center
                justify-center rounded-full font-mono text-xs leading-tight font-semibold"
            >
              <span className="text-xs">{s.books}</span>
              <span className="opacity-80">{s.books === 1 ? singular : plural}</span>
            </div>
            <div className="min-w-0">
              <p className={cn("text-foreground font-medium", bodyClassUp)}>
                {sectionNames[s.nameKey]}
              </p>
              <p className={cn(bodyColor, "mt-0.5 leading-relaxed", bodyClassUp)}>
                {sectionDescs[s.descKey]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
