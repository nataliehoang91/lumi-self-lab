"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";
import { Card } from "@/components/ui/card";
import { useBibleFontClasses } from "../../useBibleFontClasses";
import { useLocaleFonts } from "@/components/Bible/global/utils";

export interface DailyVerseProps {
  label: string;
  text: string;
  verseRef: string;
  /** When set, verseRef is rendered as a link to this verse (e.g. read page). */
  verseRefHref?: string;
  readHref: string;
  readLabel: string;
  /** Optional overrides; if omitted, sizes come from font system. */
  labelClassName?: string;
  quoteClassName?: string;
  refClassName?: string;
  linkClassName?: string;
  /** When "vi", use Vietnamese main font for label and link. */
  locale?: "en" | "vi";
}

export function DailyVerse({
  label,
  text,
  verseRef,
  verseRefHref,
  readHref,
  readLabel,
  labelClassName,
  linkClassName,
  locale,
}: DailyVerseProps) {
  const { bodyClass } = useBibleFontClasses();
  const { titleFont, bodyFont } = useLocaleFonts(locale);

  return (
    <Card
      className="border-primary-100 bg-primary-300/5 dark:border-muted-foreground/25
        dark:bg-muted/50 rounded-lg border px-12 py-6 text-center"
    >
      <p
        className={cn(
          `text-muted-foreground dark:text-foreground/80 mb-8 font-medium
          tracking-[0.18em] uppercase`,
          bodyClass,
          titleFont,
          labelClassName
        )}
      >
        {label}
      </p>
      <QuoteCard
        verseAlign="center"
        footnoteAlign="center"
        quoteIconAlign="left"
        quote={text}
        footnote={verseRef}
        footnoteHref={verseRefHref}
        className="justify-center"
        locale={locale}
      />
      <Link
        href={readHref}
        className={cn(
          `text-foreground/70 hover:text-foreground dark:text-foreground/85
          dark:hover:text-foreground group mt-8 inline-flex items-center gap-2
          transition-colors`,
          bodyClass,
          bodyFont,
          linkClassName
        )}
      >
        {readLabel}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </Card>
  );
}
