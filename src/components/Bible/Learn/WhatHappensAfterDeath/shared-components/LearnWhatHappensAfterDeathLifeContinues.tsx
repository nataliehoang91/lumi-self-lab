"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { useLocaleFonts } from "@/components/Bible/global/utils";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";

export interface LearnWhatHappensAfterDeathLifeContinuesProps {
  locale: "en" | "vi";
  heading: string;
  lead: ReactNode;
  quote: ReactNode;
  reference: ReactNode;
  explanation: ReactNode;
}

export function LearnWhatHappensAfterDeathLifeContinues({
  locale,
  heading,
  lead,
  quote,
  reference,
  explanation,
}: LearnWhatHappensAfterDeathLifeContinuesProps) {
  const { bodyClassUp, bodyClass, bodyTitleClass } = useBibleFontClasses();
  const { bodyFont, titleFont } = useLocaleFonts(locale);

  return (
    <section className="mb-10">
      <h2 className={cn(titleFont, "mb-4 text-2xl font-semibold")}>{heading}</h2>
      <p className={cn(bodyFont, "mb-4 leading-relaxed", bodyClassUp)}>{lead}</p>
      <div className="flex gap-3 py-3">
        <p className={cn(bodyFont, "mb-1 leading-relaxed italic", bodyClass)}>{quote}</p>
        <p className={cn(bodyFont, "text-second-700", bodyTitleClass)}>( {reference} )</p>
      </div>
      <p className={cn(bodyFont, "leading-relaxed", bodyClassUp)}>{explanation}</p>
    </section>
  );
}
