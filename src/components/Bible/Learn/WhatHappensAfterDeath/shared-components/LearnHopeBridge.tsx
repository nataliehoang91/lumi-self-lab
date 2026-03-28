"use client";

import type { ReactNode } from "react";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { useLocaleFonts } from "@/components/Bible/global/utils";
import { cn } from "@/lib/utils";

export interface LearnHopeBridgeProps {
  locale: "en" | "vi";
  children: ReactNode;
  className?: string;
}

export function LearnHopeBridge({ locale, children, className }: LearnHopeBridgeProps) {
  const { subtitleClass } = useBibleFontClasses();
  const { bodyFont } = useLocaleFonts(locale);

  return (
    <p className={cn("mt-8 mb-8 max-w-3xl leading-relaxed", subtitleClass, bodyFont)}>
      {children}
    </p>
  );
}
