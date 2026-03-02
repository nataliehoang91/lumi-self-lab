"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

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
    <section className="py-24 px-6">
      <FadeIn>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2
            className={`font-serif font-semibold text-foreground leading-tight text-balance ${h1Class}`}
          >
            {title}
          </h2>
          <p
            className={`text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty ${bodyClass}`}
          >
            {paragraph}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={learnHref}
              className={`px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ${buttonClass}`}
            >
              {newLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={readHref}
              className={`px-8 py-4 border border-second bg-transparent rounded-xl font-medium text-second hover:bg-second hover:text-second-foreground transition-colors ${buttonClass}`}
            >
              {bibleLabel}
            </Link>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
