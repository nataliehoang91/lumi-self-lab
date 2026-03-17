"use client";

import { cn } from "@/lib/utils";
import { QuoteIcon } from "lucide-react";
import { useLocaleFonts } from "@/components/Bible/global/utils";
import { useBibleFontClasses } from "../Bible/useBibleFontClasses";

export type QuoteCardAlign = "left" | "center" | "right";

export interface QuoteCardProps {
  /** Main quote text, including any quotation marks you want rendered. */
  quote: string;
  /** Small label on the bottom right, e.g. reference or author. */
  footnote?: string;
  /** When set, footnote is rendered as a link opening in a new tab (e.g. to verse). */
  footnoteHref?: string;
  /** Alignment for the quote icon. */
  quoteIconAlign?: QuoteCardAlign;
  /** Alignment for the verse/quote text. */
  verseAlign?: QuoteCardAlign;
  /** Alignment for the footnote. */
  footnoteAlign?: QuoteCardAlign;
  /** Shorthand: sets all three alignments when provided. */
  align?: QuoteCardAlign;
  className?: string;
  /** Optional extra class for the quote text. */
  quoteClassName?: string;
  /** Optional extra class for the footnote text. */
  footnoteClassName?: string;
  /** When "vi", use Vietnamese main font for quote and footnote. */
  locale?: "en" | "vi";
}

const LAYOUT_ROW: Record<QuoteCardAlign, string> = {
  left: "flex flex-row items-start gap-2",
  center: "flex flex-col items-center gap-1",
  right: "flex flex-row-reverse items-start gap-2",
};

const TEXT_ALIGN: Record<QuoteCardAlign, string> = {
  left: "text-left",
  center: "items-center text-center",
  right: "text-right",
};

export function QuoteCard({
  quote,
  footnote,
  footnoteHref,
  quoteIconAlign,
  footnoteAlign,
  align = "left",
  className,
  locale,
}: QuoteCardProps) {
  const iconAlign = quoteIconAlign ?? align;
  const footnoteAlignResolved = footnoteAlign ?? align;
  const { bodyClass, bodyClassUp, mainVerseQuoteClass, bodyTitleClass } =
    useBibleFontClasses();
  const { titleFont, bodyFont } = useLocaleFonts(locale);

  const layoutRow = LAYOUT_ROW[iconAlign];

  return (
    <div className={cn("flex gap-2", layoutRow, className)}>
      <div
        className="text-primary dark:text-foreground/75 text-3xl leading-none select-none"
        aria-hidden="true"
      >
        <QuoteIcon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className={cn("flex flex-col gap-4")}>
        <p
          className={cn(
            "md:text-md text-lg leading-relaxed font-semibold text-pretty",
            titleFont,
            mainVerseQuoteClass
          )}
        >
          {quote}
        </p>
        {footnote && (
          <p
            className={cn(
              "text-muted-foreground dark:text-foreground/80 mt-0 -ml-6 font-mono text-sm",
              TEXT_ALIGN[footnoteAlignResolved],
              bodyFont,
              bodyTitleClass
            )}
          >
            {footnoteHref ? (
              <a
                href={footnoteHref}
                className="text-second-600 hover:text-second-800 dark:text-second-400
                  dark:hover:text-second-300 theme-warm:text-second-500
                  dark:theme-warm:text-second-600 theme-warm:hover:text-second-700
                  font-mono underline underline-offset-4 transition-colors"
              >
                {footnote}
              </a>
            ) : (
              footnote
            )}
          </p>
        )}
      </div>
    </div>
  );
}
