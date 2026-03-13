"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

export interface LangPageHeroProps {
  eyebrow: string;
  title1: string;
  title2: string;
  subtitle: string;
  ctaStartLabel: string;
  ctaBibleLabel: string;
  orLabel: string;
  learnHref: string;
  readHref: string;
  children?: React.ReactNode;
}

export function LangPageHero({
  title1,
  title2,
  subtitle,
  ctaStartLabel,
  ctaBibleLabel,
  orLabel,
  learnHref,
  readHref,
  children,
}: LangPageHeroProps) {
  const { heroTitleClass, subtitleClass, langButtonClass } = useBibleFontClasses();

  return (
    <section
      className="relative flex min-h-[80vh] flex-col items-center justify-center
        overflow-hidden px-6 pt-24 pb-16"
    >
      {/* <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-border/30"
            style={{ top: `${(i + 1) * 14}%` }}
          />
        ))}
      </div> */}

      <div className="relative z-10 mx-auto max-w-4xl space-y-8 text-center">
        {/* <div
          className={`border-second/60 bg-second inline-flex items-center gap-2
            rounded-full border px-4 py-1.5 font-semibold tracking-wide text-white
            uppercase ${subBodyClass}`}
        >
          {eyebrow}
        </div> */}

        <h1
          className={`text-primary-dark font-serif leading-[1.05] font-semibold
            tracking-tight text-balance ${heroTitleClass}`}
        >
          {title1}
          <br />
          <span className="text-gray-500">{title2}</span>
        </h1>

        <p
          className={`text-foreground mx-auto mt-16 mb-10 max-w-xl font-serif
            leading-relaxed text-pretty ${subtitleClass}`}
        >
          {subtitle}
        </p>

        <div
          className="mx-auto flex max-w-xs flex-col items-stretch justify-center gap-3
            md:px-12"
        >
          <Link
            href={learnHref}
            className={cn(
              `bg-primary-dark flex items-center justify-center gap-2 rounded-xl px-2
              py-2.5 font-semibold text-white transition-opacity hover:opacity-90`,
              langButtonClass
            )}
          >
            {ctaStartLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-muted-foreground text-base font-medium">{orLabel}</span>
          <Link
            href={readHref}
            className={cn(
              `bg-second-400/40 border-second-400 text-second-900 hover:bg-second-400/60
              flex items-center justify-center gap-2 rounded-xl border px-2 py-2.5
              font-semibold transition-colors dark:text-white`,
              langButtonClass
            )}
          >
            {ctaBibleLabel}
          </Link>
        </div>
      </div>

      {children}
    </section>
  );
}
