"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DailyVerseProps {
  label: string;
  text: string;
  verseRef: string;
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
  readHref,
  readLabel,
  labelClassName,
  quoteClassName,
  refClassName,
  linkClassName,
}: DailyVerseProps) {
  return (
    <div className="relative border border-border/70 border-l-4 border-l-sage rounded-2xl px-8 py-8 bg-card/60 backdrop-blur-sm max-w-2xl mx-auto text-center">
      <p
        className={cn(
          "font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4",
          labelClassName ?? "text-xs"
        )}
      >
        {label}
      </p>
      <blockquote
        className={cn(
          "font-serif text-foreground leading-relaxed text-balance",
          quoteClassName ?? "text-xl md:text-2xl"
        )}
      >
        &ldquo;{text}&rdquo;
      </blockquote>
      <p className={cn("mt-4 text-muted-foreground font-medium", refClassName ?? "text-sm")}>
        {verseRef}
      </p>
      <Link
        href={readHref}
        className={cn(
          "mt-5 inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors group",
          linkClassName ?? "text-sm"
        )}
      >
        {readLabel}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
