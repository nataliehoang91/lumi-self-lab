"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";
import type { ReactNode, RefObject } from "react";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: "none" | "short" | "medium";
}

const DELAY = {
  none: "",
  short: "delay-75",
  medium: "delay-150",
};

export function RevealSection({ children, className, delay = "none" }: RevealSectionProps) {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref as RefObject<HTMLElement>}
      className={cn(
        "transition-all duration-700 ease-out",
        DELAY[delay],
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className
      )}
    >
      {children}
    </section>
  );
}
