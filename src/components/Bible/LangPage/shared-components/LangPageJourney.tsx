"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "./FadeIn";
import { JOURNEY_STRIP_CLASS, JOURNEY_ICON_CLASS } from "./constants";
import type { JourneyItem } from "./types";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LangPageJourneyProps {
  title: string;
  subtitle: string;
  items: JourneyItem[];
}

export function LangPageJourney({ title, subtitle, items }: LangPageJourneyProps) {
  const { subBodyClass, h1Class, bodyTitleClass, bodyClass, buttonClass } = useLearnFontClasses();

  return (
    <section className="py-20 px-6 border-t border-border/50">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="mb-16">
            <p
              className={`font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3 ${subBodyClass}`}
            >
              {title}
            </p>
            <h2
              className={`font-serif font-semibold text-foreground text-balance leading-tight max-w-xl ${h1Class}`}
            >
              {subtitle}
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.step} delay={i * 80}>
                <div className="group relative border border-border hover:border-foreground/40 rounded-2xl p-6 md:p-8 bg-card hover:shadow-md transition-all overflow-hidden">
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl",
                      JOURNEY_STRIP_CLASS[item.accent]
                    )}
                  />
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex items-center gap-4 md:w-48 shrink-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          JOURNEY_ICON_CLASS[item.accent]
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p
                          className={`font-mono text-muted-foreground/60 ${subBodyClass}`}
                        >
                          {item.step}
                        </p>
                        <p className={`font-semibold text-foreground ${bodyTitleClass}`}>
                          {item.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-foreground mb-1 ${bodyTitleClass}`}>
                        {item.headline}
                      </p>
                      <p className={`text-muted-foreground leading-relaxed ${bodyClass}`}>
                        {item.body}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {item.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className={`px-3 py-1 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${subBodyClass}`}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Link
                        href={item.cta.href}
                        className={`flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity whitespace-nowrap ${buttonClass}`}
                      >
                        {item.cta.label}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
