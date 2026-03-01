"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

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
  const { bodyClass, verseClass, buttonClass } = useLearnFontClasses();

  return (
    <div className="mt-12 rounded-2xl px-8 pt-8 pb-6 flex flex-col bg-primary-light/10 gap-6 border border-primary-dark/30">
      <div className="text-left">
        <p
          className={cn("font-bible-english font-normal leading-relaxed text-balance", verseClass)}
        >
          &ldquo;{verseText}&rdquo;
        </p>
        <p className="text-xs font-sans tracking-[0.2em] uppercase mt-3">{verseRef}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <p className={cn("font-medium", bodyClass)}>{ctaTitle}</p>
          <p className={cn("mt-0.5 text-muted-foreground", bodyClass)}>{ctaSubtitle}</p>
        </div>
        <Link
          href={readHref}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap hover:opacity-90 bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            buttonClass
          )}
        >
          {ctaLabel} <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
