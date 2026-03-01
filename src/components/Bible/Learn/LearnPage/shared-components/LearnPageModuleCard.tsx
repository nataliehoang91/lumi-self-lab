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
      className="group flex flex-col px-6 py-4 bg-card border rounded-2xl hover:border-primary/60 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-6">
        <span className="font-mono text-sm font-semibold text-second pt-0.5 w-6 ">{num}</span>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-bold group-hover:text-foreground transition-colors",
              bodyTitleClass
            )}
          >
            {title}
          </p>
          <p className={cn("mt-2 leading-relaxed max-w-prose", bodyClass)}>{desc}</p>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <p className={cn("font-light pl-12 text-muted-foreground", subBodyClass)}>
          {min} {minLabel}
        </p>
        <span
          className={cn(
            "flex items-center gap-1.5 font-medium rounded-lg bg-primary-light/80 text-foreground px-3 py-1.5 shrink-0 transition-all group-hover:bg-primary/25 group-hover:border-primary/70",
            buttonClass
          )}
        >
          {readLabel}
          <ChevronRight
            className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
