"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type StatAccent = "primary" | "second" | "tertiary" | "sage";

const STAT_VALUE_CLASS: Record<StatAccent, string> = {
  primary: "text-primary",
  second: "text-second",
  tertiary: "text-tertiary",
  sage: "text-sage",
};

export interface AnimatedStatProps {
  value: string;
  label: string;
  accent?: StatAccent;
  valueClassName?: string;
  labelClassName?: string;
}

export function AnimatedStat({
  value,
  label,
  accent,
  valueClassName,
  labelClassName,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <p
        className={cn(
          "font-serif font-semibold",
          valueClassName ?? "text-4xl md:text-5xl",
          accent ? STAT_VALUE_CLASS[accent] : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className={cn("mt-1 text-muted-foreground", labelClassName ?? "text-sm")}>{label}</p>
    </div>
  );
}
