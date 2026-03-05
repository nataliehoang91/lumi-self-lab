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
  linkLabel: string;
  /** When "vi", use Vietnamese flashcard font. */
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
  const { bodyClass } = useBibleFontClasses();
  const titleFont = locale === "vi" ? "font-vietnamese-flashcard" : "font-bible-english";
  const bodyFont = locale === "vi" ? "font-vietnamese-flashcard" : undefined;

  return (
    <section
      className="bg-primary-light/10 border-primary-dark/30 mb-10 gap-6 rounded-2xl border
        p-6"
      aria-labelledby="why-cta-title"
    >
      <h2 id="why-cta-title" className={cn("mb-3 text-xl font-semibold", titleFont)}>
        {title}
      </h2>
      <p className={cn("leading-relaxed opacity-80", bodyClass, bodyFont)}>{paragraph1}</p>
      <p className={cn("mt-3 leading-relaxed opacity-80", bodyClass, bodyFont)}>{paragraph2}</p>
      <Link
        href={linkHref}
        className={cn(
          `focus-visible:ring-ring mt-5 inline-flex items-center gap-2 rounded-lg
          font-medium opacity-90 transition-opacity hover:opacity-100 focus-visible:ring-2
          focus-visible:ring-offset-2 focus-visible:outline-none`,
          bodyClass,
          bodyFont
        )}
      >
        {linkLabel} <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
      </Link>
    </section>
  );
}
