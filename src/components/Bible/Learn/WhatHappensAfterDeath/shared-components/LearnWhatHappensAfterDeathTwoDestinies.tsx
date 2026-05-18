"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { useLocaleFonts } from "@/components/Bible/global/utils";
import { cn } from "@/lib/utils";

export interface TwoDestinyItem {
  title: string;
  description: ReactNode;
  verses: ReactNode;
}

export interface LearnWhatHappensAfterDeathTwoDestiniesProps {
  locale: "en" | "vi";
  heading: string;
  intro: ReactNode;
  items: readonly TwoDestinyItem[];
}

export function LearnWhatHappensAfterDeathTwoDestinies({
  locale,
  heading,
  intro,
  items,
}: LearnWhatHappensAfterDeathTwoDestiniesProps) {
  const { bodyClass, bodyClassUp, bodyTitleClass } = useBibleFontClasses();
  const { titleFont, bodyFont } = useLocaleFonts(locale);

  return (
    <section className="mb-10">
      <h2 className={cn(titleFont, "mb-5 text-2xl font-semibold")}>{heading}</h2>
      <p className={cn("mb-5 leading-relaxed", bodyClassUp)}>{intro}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="border-border bg-card flex h-full flex-col rounded-2xl border p-5"
          >
            <p className={cn(titleFont, "mb-2 font-semibold")}>{item.title}</p>
            <p className={cn(bodyFont, "mb-3 leading-relaxed", bodyClass)}>
              {item.description}
            </p>
            <p className={cn(bodyFont, "mt-auto text-right font-mono", bodyTitleClass)}>
              {item.verses}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
