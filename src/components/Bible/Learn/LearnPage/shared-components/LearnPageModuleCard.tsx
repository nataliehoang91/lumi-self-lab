"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLearnFontClasses } from "@/components/Bible/Learn/useLearnFontClasses";

export interface LearnPageModuleCardProps {
  num: string;
  title: string;
  desc: ReactNode;
  min: number;
  minLabel: string;
  readLabel: string;
  href: string;
  ariaLabel: string;
}

export function LearnPageModuleCard({
  num,
  title,
  desc,
  min,
  minLabel,
  readLabel,
  href,
  ariaLabel,
}: LearnPageModuleCardProps) {
  const { bodyClass, bodyTitleClass, subBodyClass, buttonClass } = useLearnFontClasses();

  return (
    <Link
      href={href}
      className="group bg-card hover:border-primary/60 focus-visible:ring-ring flex
        flex-col rounded-2xl border px-6 py-4 transition-all hover:shadow-sm
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-6">
        <span className={cn("text-second w-6 pt-0.5 font-mono font-semibold", bodyClass)}>
          {num}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "group-hover:text-foreground font-bold transition-colors",
              bodyTitleClass
            )}
          >
            {title}
          </p>
          <p className={cn("mt-2 max-w-prose leading-relaxed", bodyClass)}>{desc}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <p className={cn("text-muted-foreground pl-12 font-light", subBodyClass)}>
          {min} {minLabel}
        </p>
        <span
          className={cn(
            `bg-primary-light/80 text-foreground group-hover:bg-primary/25
            group-hover:border-primary/70 flex shrink-0 items-center gap-1.5 rounded-lg
            px-3 py-1.5 font-medium transition-all`,
            buttonClass
          )}
        >
          {readLabel}
          <ChevronRight
            className="h-5 w-5 shrink-0 transition-transform duration-200
              group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
