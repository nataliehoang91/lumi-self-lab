"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface LearnProphecyItem {
  prophecy: string;
  ref: string;
  fulfilled: string;
}

export interface LearnProphecySectionProps {
  title: string;
  intro: ReactNode;
  items: LearnProphecyItem[];
  bodyClassName?: string;
  refClassName?: string;
}

export function LearnProphecySection({ title, intro, items, bodyClassName, refClassName }: LearnProphecySectionProps) {
  return (
    <section className="mb-10" aria-labelledby="prophecy-section-title">
      <h2 id="prophecy-section-title" className="font-bible-english text-xl font-semibold text-foreground mb-2">
        {title}
      </h2>
      <p className={cn("text-sm text-muted-foreground mb-5 leading-relaxed", bodyClassName)}>{intro}</p>
      <ul className="space-y-2 list-none p-0 m-0">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-4 px-4 py-3 bg-card border border-sage-dark/20 rounded-xl"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0 mt-2" aria-hidden />
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm text-foreground", bodyClassName)}>{item.prophecy}</p>
              <p className={cn("text-xs text-muted-foreground/70 mt-0.5 font-mono", refClassName)}>
                {item.ref} → {item.fulfilled}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
