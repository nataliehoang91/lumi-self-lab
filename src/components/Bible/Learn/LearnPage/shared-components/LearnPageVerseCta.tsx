"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnPageVerseCtaProps {
  verseText: string;
  verseRef: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaLabel: string;
  readHref: string;
  /** Optional direct link for the verse reference (defaults to readHref). */
  verseHref?: string;
  /** When "vi", use Vietnamese flashcard font for verse and body text. */
  locale?: "en" | "vi";
}

export function LearnPageVerseCta({
  verseText,
  verseRef,
  ctaTitle,
  ctaSubtitle,
  ctaLabel,
  readHref,
  verseHref,
  locale,
}: LearnPageVerseCtaProps) {
  const { bodyClass, verseClass, buttonClass } = useBibleFontClasses();
  const verseFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <div
      className="bg-primary-light/10 border-primary-dark/30 mt-12 flex flex-col gap-6
        rounded-2xl border px-8 pt-8 pb-6"
    >
      <div className="text-left">
        <p
          className={cn(
            "leading-relaxed font-normal text-balance",
            verseFont,
            verseClass
          )}
        >
          &ldquo;{verseText}&rdquo;
        </p>
        <p className="mt-3 font-sans text-xs tracking-[0.2em] uppercase">
          <Link
            href={verseHref ?? readHref}
            className="inline-flex items-center gap-1 underline underline-offset-4
              hover:underline"
          >
            {verseRef}
          </Link>
        </p>
      </div>
      <div
        className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center"
      >
        <div>
          <p className={cn("font-medium", bodyClass, bodyFont)}>{ctaTitle}</p>
          <p className={cn("text-muted-foreground mt-0.5", bodyClass, bodyFont)}>
            {ctaSubtitle}
          </p>
        </div>
        <Link
          href={readHref}
          className={cn(
            `bg-primary text-primary-foreground focus-visible:ring-ring group flex
            items-center justify-end gap-2 rounded-xl px-5 py-2.5 font-semibold
            whitespace-nowrap transition-all hover:opacity-90 focus-visible:ring-2
            focus-visible:ring-offset-2 focus-visible:outline-none lg:justify-center`,
            buttonClass,
            bodyFont
          )}
        >
          {ctaLabel}{" "}
          <ArrowRight
            className="h-3.5 w-3.5 shrink-0 transition-transform duration-200
              group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  );
}
