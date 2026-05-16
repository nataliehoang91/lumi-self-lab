"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { BookOpen, CheckCircle2 } from "lucide-react";

/** English keys for badge styling only; label text stays localized via `confidence`. */
export type ProphecyConfidenceLevel = "very_clear" | "widely_discussed";

export interface LearnProphecyItem {
  title: string;
  confidenceLevel: ProphecyConfidenceLevel;
  /** Localized badge (e.g. "Rất rõ", "Very clear"). */
  confidence: string;
  explanation: string;
  otLink: ReactNode;
  ntLink: ReactNode;
  /** Verse text shown above the OT reference link. */
  otQuote?: string;
  /** Verse text shown above the NT reference link. */
  ntQuote?: string;
}

export interface LearnProphecySectionProps {
  title: string;
  intro: ReactNode;
  items: LearnProphecyItem[];
  locale?: "en" | "vi";
  bodyBright?: boolean;
  prophecyColumnLabel?: string;
  fulfilmentColumnLabel?: string;
}

export function LearnProphecySection({
  title,
  intro,
  items,
  locale = "en",
  bodyBright,
  prophecyColumnLabel,
  fulfilmentColumnLabel,
}: LearnProphecySectionProps) {
  const {
    bodyClass,
    bodyClassUp,
    subBodyClassUp,
    langBodyTitleClass,
    bodyTitleClassUp,
    bodyTitleClass,
  } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const bodyColor = bodyBright ? "text-foreground" : "text-muted-foreground";

  const otLabel = prophecyColumnLabel ?? (locale === "vi" ? "Lời tiên tri" : "Prophecy");
  const ntLabel = fulfilmentColumnLabel ?? (locale === "vi" ? "Ứng nghiệm" : "Fulfilled");

  const getConfidenceStyle = (level: ProphecyConfidenceLevel) =>
    level !== "very_clear"
      ? "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
      : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";

  return (
    <section className="mb-10" aria-labelledby="prophecy-section-title">
      <h2
        id="prophecy-section-title"
        className={cn(
          "text-foreground mb-3 font-serif text-2xl font-semibold",
          titleFont,
          langBodyTitleClass
        )}
      >
        {title}
      </h2>
      <p className={cn(bodyColor, "mb-6 leading-relaxed", bodyClassUp, bodyFont)}>
        {intro}
      </p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
            className="group border-border bg-card hover:border-border/80 overflow-hidden
              rounded-2xl border transition-all hover:shadow-md"
          >
            {/* Header */}
            <div className="border-border/50 bg-muted/30 border-b px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Number badge */}
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold",
                      "bg-primary/10 text-primary theme-warm:bg-second/15 theme-warm:text-second"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className={cn(
                      "text-foreground leading-snug font-semibold",
                      bodyFont,
                      bodyTitleClassUp
                    )}
                  >
                    {item.title}
                  </h3>
                </div>
                <span
                  className={cn(
                    `inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3
                    py-1 font-medium`,
                    getConfidenceStyle(item.confidenceLevel),
                    subBodyClassUp
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.confidence}
                </span>
              </div>
              <p
                className={cn(
                  "text-muted-foreground mt-2 max-w-2xl leading-relaxed text-pretty",
                  bodyFont,
                  bodyClass
                )}
              >
                {item.explanation}
              </p>
            </div>

            {/* Comparison Grid */}
            <div
              className="divide-border/50 grid grid-cols-1 divide-y md:grid-cols-2
                md:divide-x md:divide-y-0"
            >
              {/* OT Prophecy */}
              <div className="bg-bourbon/5 p-4 md:min-h-0">
                <div className="text-second-600 mb-2 flex items-center gap-2">
                  <BookOpen className="text-bourbon h-4 w-4" />
                  <p
                    className={cn(
                      `text-bourbon font-semibold tracking-wide uppercase underline
                      underline-offset-4`,
                      subBodyClassUp
                    )}
                  >
                    {otLabel}
                  </p>
                </div>
                {item.otQuote ? (
                  <p
                    className={cn(
                      "text-foreground mt-4 leading-relaxed font-medium italic",
                      bodyTitleClass,
                      locale === "vi" ? "font-vietnamese" : "font-serif"
                    )}
                  >
                    &ldquo;{item.otQuote}&rdquo;
                  </p>
                ) : null}
                <div
                  className={cn(
                    "text-right",
                    subBodyClassUp,
                    item.otQuote ? "mt-3" : "mt-0"
                  )}
                >
                  {item.otLink}
                </div>
              </div>

              {/* NT Fulfillment */}
              <div className="p-4 md:min-h-0">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p
                    className={cn(
                      `font-semibold tracking-wide text-emerald-700 uppercase underline
                      underline-offset-4 dark:text-emerald-400`,
                      subBodyClassUp
                    )}
                  >
                    {ntLabel}
                  </p>
                </div>
                {item.ntQuote ? (
                  <p
                    className={cn(
                      "text-foreground mt-4 leading-relaxed font-medium italic",
                      bodyTitleClass,
                      locale === "vi" ? "font-vietnamese" : "font-serif"
                    )}
                  >
                    &ldquo;{item.ntQuote}&rdquo;
                  </p>
                ) : null}
                <div
                  className={cn(
                    "text-right",
                    subBodyClassUp,
                    item.ntQuote ? "mt-3" : "mt-0"
                  )}
                >
                  {item.ntLink}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
