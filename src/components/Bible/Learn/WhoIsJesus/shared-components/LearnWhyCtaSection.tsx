"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LearnWhyCtaSectionProps {
  title: string;
  paragraph1: ReactNode;
  paragraph2: ReactNode;
  linkHref: string;
  linkLabel?: string;
  locale?: "en" | "vi";
}

export function LearnWhyCtaSection({
  title,
  paragraph1,
  paragraph2,
  linkHref,
  linkLabel,
  locale,
}: LearnWhyCtaSectionProps) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section
      className="bg-primary-light/10 theme-warm:bg-second/8 border-primary-dark/20 theme-warm:border-second/25 mb-10 rounded-2xl border p-6 md:p-8"
      aria-labelledby="why-cta-title"
    >
      {/* Pill label */}
      <div className="bg-primary/15 theme-warm:bg-second/15 mb-4 inline-flex items-center rounded-full px-3 py-1">
        <span className="text-primary-700 theme-warm:text-second dark:text-primary text-xs font-semibold tracking-wide uppercase">
          {title}
        </span>
      </div>

      <h2
        id="why-cta-title"
        className={cn("text-foreground mb-4 text-3xl font-bold leading-snug", titleFont)}
      >
        {title}
      </h2>

      <div className="[&_p]:text-lg [&_p]:leading-relaxed">
        <div className={cn("text-lg leading-relaxed", bodyClassUp, bodyFont)}>
          {paragraph1}
        </div>
        <div className={cn("mt-4 text-lg leading-relaxed", bodyClassUp, bodyFont)}>
          {paragraph2}
        </div>
      </div>

      {linkLabel && (
        <Link
          href={linkHref}
          className={cn(
            "mt-6 inline-flex items-center gap-2 rounded-lg font-semibold transition-opacity hover:opacity-80",
            "text-primary theme-warm:text-second",
            bodyClass,
            bodyFont
          )}
        >
          {linkLabel} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      )}
    </section>
  );
}
