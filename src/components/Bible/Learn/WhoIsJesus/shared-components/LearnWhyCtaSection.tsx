"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LearnWhyCtaSectionProps {
  title: string;
  paragraph1: ReactNode;
  paragraph2: ReactNode;
  linkHref: string;
  linkLabel: string;
}

export function LearnWhyCtaSection({
  title,
  paragraph1,
  paragraph2,
  linkHref,
  linkLabel,
}: LearnWhyCtaSectionProps) {
  const { bodyClass } = useLearnFontClasses();

  return (
    <section
      className="bg-primary-light/10 border-primary-dark/30 mb-10 gap-6 rounded-2xl border
        p-6"
      aria-labelledby="why-cta-title"
    >
      <h2 id="why-cta-title" className="font-bible-english mb-3 text-xl font-semibold">
        {title}
      </h2>
      <p className={cn("leading-relaxed opacity-80", bodyClass)}>{paragraph1}</p>
      <p className={cn("mt-3 leading-relaxed opacity-80", bodyClass)}>{paragraph2}</p>
      <Link
        href={linkHref}
        className={cn(
          `focus-visible:ring-ring mt-5 inline-flex items-center gap-2 rounded-lg
          font-medium opacity-90 transition-opacity hover:opacity-100 focus-visible:ring-2
          focus-visible:ring-offset-2 focus-visible:outline-none`,
          bodyClass
        )}
      >
        {linkLabel} <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
      </Link>
    </section>
  );
}
