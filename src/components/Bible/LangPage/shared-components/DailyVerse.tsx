"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface DailyVerseProps {
  label: string;
  text: string;
  verseRef: string;
  readHref: string;
  readLabel: string;
}

export function DailyVerse({ label, text, verseRef, readHref, readLabel }: DailyVerseProps) {
  return (
    <div className="relative border border-border/70 border-l-4 border-l-sage rounded-2xl px-8 py-8 bg-card/60 backdrop-blur-sm max-w-2xl mx-auto text-center">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground mb-4">
        {label}
      </p>
      <blockquote className="font-serif text-xl md:text-2xl text-foreground leading-relaxed text-balance">
        &ldquo;{text}&rdquo;
      </blockquote>
      <p className="mt-4 text-sm text-muted-foreground font-medium">{verseRef}</p>
      <Link
        href={readHref}
        className="mt-5 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors group"
      >
        {readLabel}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
