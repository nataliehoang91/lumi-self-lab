"use client";

import Link from "next/link";
import { ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";
import { Card } from "@/components/ui/card";
import { useBibleFontClasses } from "../../useBibleFontClasses";
import { useLocaleFonts } from "@/components/Bible/global/utils";

export interface DailyVerseProps {
  label: string;
  text: string;
  verseRef: string;
  verseRefHref?: string;
  readHref: string;
  readLabel: string;
  labelClassName?: string;
  quoteClassName?: string;
  refClassName?: string;
  linkClassName?: string;
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
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(`"${text}" — ${verseRef}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card
      className="border-primary-100 bg-primary-300/5 dark:border-muted-foreground/25
        dark:bg-muted/50 rounded-lg border px-12 py-6 text-center"
    >
      <div className="mb-8 flex items-center justify-center gap-3">
        <p
          className={cn(
            "text-muted-foreground dark:text-foreground/80 font-medium tracking-[0.18em] uppercase",
            bodyClass,
            titleFont,
            labelClassName
          )}
        >
          {label}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
          aria-label="Copy verse"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
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
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Card>
  );
}
