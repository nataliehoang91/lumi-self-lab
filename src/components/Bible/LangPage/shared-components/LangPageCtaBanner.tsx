"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";
import { cn } from "@/lib/utils";

export interface LangPageCtaBannerProps {
  title: string;
  paragraph: string;
  newLabel: string;
  bibleLabel: string;
  learnHref: string;
  readHref: string;
}

export function LangPageCtaBanner({
  title,
  paragraph,
  newLabel,
  bibleLabel,
  learnHref,
  readHref,
}: LangPageCtaBannerProps) {
  const { h1Class, bodyClass, buttonClass } = useLearnFontClasses();

  return (
    <section className="px-6 py-24">
      <FadeIn>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h2
            className={`text-foreground font-serif leading-tight font-semibold
              text-balance ${h1Class}`}
          >
            {title}
          </h2>
          <p
            className={`text-muted-foreground mx-auto max-w-xl leading-relaxed text-pretty
              ${bodyClass}`}
          >
            {paragraph}
          </p>
          <div
            className="mx-auto flex max-w-xs flex-col items-stretch justify-center gap-3
              md:mx-auto md:px-12"
          >
            <Link
              href={learnHref}
              className={cn(
                `bg-primary-dark flex items-center justify-center gap-2 rounded-xl px-4
                py-2.5 text-lg font-semibold text-white transition-opacity
                hover:opacity-90`,
                buttonClass
              )}
            >
              {newLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-muted-foreground text-base font-medium">or</span>
            <Link
              href={readHref}
              className={cn(
                `bg-second-400/40 border-second-400 text-second-900 hover:bg-second-400/60
                flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5
                text-lg font-semibold transition-colors dark:text-white`,
                buttonClass
              )}
            >
              {bibleLabel}
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
