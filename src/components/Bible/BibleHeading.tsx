"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useBibleApp } from "./BibleAppContext";

type BibleHeadingLevel = "h1" | "h2";

interface BibleHeadingProps {
  level?: BibleHeadingLevel;
  className?: string;
  children: ReactNode;
}

export function BibleHeading({ level = "h1", className, children }: BibleHeadingProps) {
  const { fontSize } = useBibleApp();

  let sizeClass: string;

  if (level === "h1") {
    // Primary page title
    sizeClass =
      fontSize === "small"
        ? "text-xl md:text-2xl"
        : fontSize === "large"
          ? "text-3xl md:text-4xl"
          : "text-2xl md:text-3xl";
  } else {
    // Section heading – one step smaller than h1
    sizeClass =
      fontSize === "small"
        ? "text-lg md:text-xl"
        : fontSize === "large"
          ? "text-2xl md:text-3xl"
          : "text-xl md:text-2xl";
  }

  const Component = level === "h1" ? "h1" : "h2";

  return <Component className={cn(sizeClass, className)}>{children}</Component>;
}
