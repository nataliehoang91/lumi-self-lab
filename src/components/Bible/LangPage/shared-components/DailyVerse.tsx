"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";
import { Card } from "@/components/ui/card";

export interface DailyVerseProps {
  label: string;
  text: string;
  verseRef: string;
  /** When set, verseRef is rendered as a link to this verse (e.g. read page). */
  verseRefHref?: string;
  readHref: string;
  readLabel: string;
  labelClassName?: string;
  quoteClassName?: string;
  refClassName?: string;
  linkClassName?: string;
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
}: DailyVerseProps) {
  return (
    <Card
      className="border-primary-100 bg-primary-300/5 rounded-lg border px-12 py-6
        text-center"
    >
      <p
        className={cn(
          "text-muted-foreground mb-8 font-medium tracking-[0.18em] uppercase",
          labelClassName ?? "text-xs"
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
      />
      <Link
        href={readHref}
        className={cn(
          `text-foreground/70 hover:text-foreground group mt-8 inline-flex items-center
          gap-2 transition-colors`,
          linkClassName ?? "text-sm"
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
