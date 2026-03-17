"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { useLocaleFonts } from "@/components/Bible/global/utils";
import { Dot } from "lucide-react";

export interface LearnWhatHappensAfterDeathAccountabilityProps {
  locale: "en" | "vi";
  heading: string;
  quote: ReactNode;
  reference: ReactNode;
  body1: ReactNode;
  body2: ReactNode;
}

export function LearnWhatHappensAfterDeathAccountability({
  locale,
  heading,
  quote,
  reference,
  body1,
  body2,
}: LearnWhatHappensAfterDeathAccountabilityProps) {
  const { bodyClass, bodyClassUp, bodyTitleClass } = useBibleFontClasses();
  const { bodyFont, titleFont } = useLocaleFonts(locale);
  return (
    <section className="bg-card border-border mb-10 rounded-2xl border p-6">
      <h2 className={cn(titleFont, "mb-4 text-2xl font-semibold")}>{heading}</h2>
      <div
        className="border-second-200 bg-second-50 dark:bg-second-900/50 my-4 rounded-lg
          border-l-4 px-4 py-3"
      >
        <div className="flex items-end">
          <p className={cn(bodyFont, "leading-relaxed italic", bodyClass)}>{quote}</p>
          <Dot />{" "}
          <p className={cn("self-end font-mono", bodyFont, bodyTitleClass)}>
            {reference}
          </p>
        </div>
      </div>
      <p className={cn("mb-4 leading-relaxed", bodyClassUp)}>{body1}</p>
      <p className={cn("leading-relaxed", bodyClassUp)}>{body2}</p>
    </section>
  );
}
