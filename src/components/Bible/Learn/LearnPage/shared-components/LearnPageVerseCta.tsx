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
}

export function LearnPageVerseCta({
  verseText,
  verseRef,
  ctaTitle,
  ctaSubtitle,
  ctaLabel,
  readHref,
}: LearnPageVerseCtaProps) {
  const { bodyClass, verseClass, buttonClass } = useBibleFontClasses();

  return (
    <div
      className="bg-primary-light/10 border-primary-dark/30 mt-12 flex flex-col gap-6
        rounded-2xl border px-8 pt-8 pb-6"
    >
      <div className="text-left">
        <p
          className={cn(
            "font-bible-english leading-relaxed font-normal text-balance",
            verseClass
          )}
        >
          &ldquo;{verseText}&rdquo;
        </p>
        <p className="mt-3 font-sans text-xs tracking-[0.2em] uppercase">{verseRef}</p>
      </div>
      <div
        className="flex flex-col justify-between gap-4 pt-2 sm:flex-row sm:items-center"
      >
        <div>
          <p className={cn("font-medium", bodyClass)}>{ctaTitle}</p>
          <p className={cn("text-muted-foreground mt-0.5", bodyClass)}>{ctaSubtitle}</p>
        </div>
        <Link
          href={readHref}
          className={cn(
            `bg-primary text-primary-foreground focus-visible:ring-ring flex items-center
            gap-2 rounded-xl px-5 py-2.5 font-semibold whitespace-nowrap transition-all
            hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2
            focus-visible:outline-none`,
            buttonClass
          )}
        >
          {ctaLabel} <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
