"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "./FadeIn";
import { JOURNEY_STRIP_CLASS, JOURNEY_ICON_CLASS } from "./constants";
import type { JourneyItem } from "./types";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";

export interface LangPageJourneyProps {
  title: string;
  subtitle: string;
  items: JourneyItem[];
}

export function LangPageJourney({ title, subtitle, items }: LangPageJourneyProps) {
  const { subBodyClassUp, h1Class, bodyTitleClass, bodyClassUp, buttonClass } =
    useBibleFontClasses();

  return (
    <section className="border-border/50 border-t px-6 py-4">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16">
            <p
              className={`text-muted-foreground mb-3 font-semibold tracking-[0.2em]
                uppercase dark:text-white ${subBodyClassUp}`}
            >
              {title}
            </p>
            <h2
              className={`text-foreground max-w-xl font-serif leading-tight font-semibold
                text-balance dark:text-white ${h1Class}`}
            >
              {subtitle}
            </h2>
          </div>
        </FadeIn>

        <div className="space-y-4 md:space-y-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.step} delay={i * 80}>
                <div
                  className="group border-border hover:border-foreground/40 bg-card
                    relative overflow-hidden rounded-2xl border px-12 py-8 transition-all
                    hover:shadow-md md:px-6 md:py-4"
                >
                  <div
                    className={cn(
                      "absolute -top-3 -bottom-3 left-0 w-2 rounded-l-2xl",
                      JOURNEY_STRIP_CLASS[item.accent]
                    )}
                  />
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex shrink-0 items-center gap-4 md:w-48 md:pl-8">
                      <div
                        className={cn(
                          `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
                          transition-colors`,
                          JOURNEY_ICON_CLASS[item.accent]
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p
                          className={`text-muted-foreground/60 font-mono
                          dark:text-gray-400 ${subBodyClassUp}`}
                        >
                          {item.step}
                        </p>
                        <p className={`text-foreground font-semibold ${bodyTitleClass}`}>
                          {item.label}
                        </p>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-foreground mb-1 font-medium dark:text-white
                        ${bodyTitleClass}`}
                      >
                        {item.headline}
                      </p>
                      <p
                        className={`text-muted-foreground leading-relaxed
                        dark:text-gray-400 ${bodyClassUp}`}
                      >
                        {item.body}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className={`border-border text-muted-foreground
                            hover:text-foreground hover:bg-primary-50 rounded-lg border
                            px-3 py-1 transition-colors dark:text-white ${subBodyClassUp}`}
                          >
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="t shrink-0">
                      <Link
                        href={item.cta.href}
                        className={`bg-second-400/40 border-second-400 flex items-center
                        justify-center gap-2 rounded-xl border px-5 py-2.5 font-medium
                        whitespace-nowrap transition-opacity hover:opacity-90
                        dark:text-white ${buttonClass}`}
                      >
                        {item.cta.label}
                        <ArrowRight className="h-3.5 w-3.5" />
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
