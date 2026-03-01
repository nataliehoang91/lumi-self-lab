"use client";

import { useBibleApp } from "@/components/Bible/BibleAppContext";

/**
 * Shared font-size classes for all bible/learn pages.
 * Uses the app font size setting so body, headings, and verse scale consistently.
 */
export function useLearnFontClasses() {
  const { fontSize } = useBibleApp();

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";

  const h1Class =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";

  const subtitleClass =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";

  const verseClass =
    fontSize === "small"
      ? "text-lg md:text-xl"
      : fontSize === "large"
        ? "text-2xl md:text-3xl"
        : "text-xl md:text-2xl";

  /** Same as bodyClass; use for intro paragraphs and lesson body text. */
  const introClass = bodyClass;

  return { bodyClass, h1Class, subtitleClass, verseClass, introClass };
}
