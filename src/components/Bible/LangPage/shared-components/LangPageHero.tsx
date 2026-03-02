"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LangPageHeroProps {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaStartLabel: string;
  ctaBibleLabel: string;
  learnHref: string;
  readHref: string;
  children?: React.ReactNode;
}

export function LangPageHero({
  eyebrow,
  title1,
  title2,
  subtitle,
  ctaStartLabel,
  ctaBibleLabel,
  learnHref,
  readHref,
  children,
}: LangPageHeroProps) {
  const { subBodyClass, heroTitleClass, subtitleClass, buttonClass } = useLearnFontClasses();

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-border/30"
            style={{ top: `${(i + 1) * 14}%` }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-second/60 bg-second/10 font-medium text-second tracking-wide uppercase ${subBodyClass}`}
        >
          {eyebrow}
        </div>

        <h1
          className={`font-serif font-semibold text-foreground leading-[1.05] tracking-tight text-balance ${heroTitleClass}`}
        >
          {title1}
          <br />
          <span className="text-primary">{title2}</span>
        </h1>

        <p className={`max-w-xl mx-auto text-muted-foreground leading-relaxed text-pretty ${subtitleClass}`}>
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={learnHref}
            className={`px-7 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${buttonClass}`}
          >
            {ctaStartLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={readHref}
            className={`px-7 py-3.5 border border-second bg-transparent rounded-xl font-medium text-second hover:bg-second hover:text-second-foreground transition-colors ${buttonClass}`}
          >
            {ctaBibleLabel}
          </Link>
        </div>
      </div>

      {children}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-10 bg-foreground/40 animate-pulse" />
      </div>
    </section>
  );
}
