"use client";

import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

const ScrollIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Main parchment body */}
    <rect
      x="10" y="16" width="28" height="16" rx="2"
      fill="currentColor" opacity="0.12"
      stroke="currentColor" strokeWidth="1.8"
    />
    {/* Left roller */}
    <ellipse cx="10" cy="24" rx="4" ry="8"
      fill="currentColor" opacity="0.1"
      stroke="currentColor" strokeWidth="1.6"
    />
    {/* Right roller */}
    <ellipse cx="38" cy="24" rx="4" ry="8"
      fill="currentColor" opacity="0.1"
      stroke="currentColor" strokeWidth="1.6"
    />
    {/* Text lines on parchment */}
    <line x1="16" y1="21" x2="32" y2="21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <line x1="16" y1="25" x2="29" y2="25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <line x1="16" y1="29" x2="26" y2="29" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const OpenBookIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {/* Left page */}
    <path
      d="M5 12 Q5 10 9 10 L24 10 L24 38 Q17 36 5 38 Z"
      fill="currentColor" opacity="0.12"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
    />
    {/* Right page */}
    <path
      d="M43 12 Q43 10 39 10 L24 10 L24 38 Q31 36 43 38 Z"
      fill="currentColor" opacity="0.12"
      stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
    />
    {/* Spine */}
    <line x1="24" y1="10" x2="24" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    {/* Cross above */}
    <line x1="24" y1="3" x2="24" y2="9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="21" y1="5.5" x2="27" y2="5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export interface BibleTestamentSplitBlockProps {
  otTitle: string;
  ntTitle: string;
  otLang: string;
  ntLang: string;
  otTagline: string;
  ntTagline: string;
  otDesc: string;
  ntDesc: string;
  locale?: "en" | "vi";
  /** Word used for "books" in the count badge — defaults to "sách". */
  bookCountWord?: string;
  /** Merged onto the outer section (e.g. spacing when an intro sits above). */
  className?: string;
}

export function BibleTestamentSplitBlock({
  otTitle,
  ntTitle,
  otLang,
  ntLang,
  otTagline,
  ntTagline,
  otDesc,
  ntDesc,
  locale,
  bookCountWord = "sách",
  className,
}: BibleTestamentSplitBlockProps) {
  const { bodyClassUp } = useBibleFontClasses();
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";

  return (
    <section className={cn("mt-12 mb-10", className)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Old Testament card — warm amber/earthy */}
        <div
          className={cn(
            "relative flex flex-col gap-4 rounded-2xl border p-6",
            "bg-amber-50/70 border-amber-200/80",
            "theme-warm:bg-second/8 theme-warm:border-second/30",
            "dark:bg-amber-950/20 dark:border-amber-800/30"
          )}
        >
          {/* Book count badge */}
          <span
            className={cn(
              "absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
              "bg-amber-200/70 text-amber-900",
              "theme-warm:bg-second/20 theme-warm:text-second-dark",
              "dark:bg-amber-800/40 dark:text-amber-200"
            )}
          >
            39 {bookCountWord}
          </span>

          <div className="text-amber-700 theme-warm:text-second dark:text-amber-400">
            <ScrollIcon />
          </div>

          <div>
            <p
              className={cn(
                "mb-1 text-xs font-semibold tracking-widest uppercase",
                "text-amber-600 dark:text-amber-500"
              )}
            >
              {otLang}
            </p>
            <h3
              className={cn(
                "text-2xl leading-tight font-bold",
                titleFont,
                "text-amber-950 dark:text-amber-100"
              )}
            >
              {otTitle}
            </h3>
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                "text-amber-800/80 dark:text-amber-300/80",
                bodyFont
              )}
            >
              {otTagline}
            </p>
          </div>

          <p
            className={cn(
              "text-sm leading-relaxed",
              bodyClassUp,
              bodyFont,
              "text-amber-900/70 dark:text-amber-200/60"
            )}
          >
            {otDesc}
          </p>
        </div>

        {/* New Testament card — cool blue */}
        <div
          className={cn(
            "relative flex flex-col gap-4 rounded-2xl border p-6",
            "bg-sky-50/70 border-sky-200/80",
            "theme-warm:bg-tertiary/8 theme-warm:border-tertiary/30",
            "dark:bg-sky-950/20 dark:border-sky-800/30"
          )}
        >
          {/* Book count badge */}
          <span
            className={cn(
              "absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
              "bg-sky-200/70 text-sky-900",
              "theme-warm:bg-tertiary/20 theme-warm:text-foreground",
              "dark:bg-sky-800/40 dark:text-sky-200"
            )}
          >
            27 {bookCountWord}
          </span>

          <div className="text-sky-600 theme-warm:text-tertiary dark:text-sky-400">
            <OpenBookIcon />
          </div>

          <div>
            <p
              className={cn(
                "mb-1 text-xs font-semibold tracking-widest uppercase",
                "text-sky-600 dark:text-sky-500"
              )}
            >
              {ntLang}
            </p>
            <h3
              className={cn(
                "text-2xl leading-tight font-bold",
                titleFont,
                "text-sky-950 dark:text-sky-100"
              )}
            >
              {ntTitle}
            </h3>
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                "text-sky-800/80 dark:text-sky-300/80",
                bodyFont
              )}
            >
              {ntTagline}
            </p>
          </div>

          <p
            className={cn(
              "text-sm leading-relaxed",
              bodyClassUp,
              bodyFont,
              "text-sky-900/70 dark:text-sky-200/60"
            )}
          >
            {ntDesc}
          </p>
        </div>
      </div>
    </section>
  );
}
