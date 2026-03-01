"use client";

import { useBibleApp } from "@/components/Bible/BibleAppContext";

/**
 * Shared font-size classes for all bible/learn pages.
 * Uses the app font size setting so body, headings, and verse scale consistently.
 */
export function useLearnFontClasses() {
  const { fontSize } = useBibleApp();

  const bodyTitleClass =
    fontSize === "small" ? "text-md" : fontSize === "large" ? "text-xl" : "text-lg";

  const bodyClass = fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-md";

  const subBodyClass =
    fontSize === "small" ? "text-[0.6875rem]" : fontSize === "large" ? "text-sm" : "text-xs";

  const h1Class =
    fontSize === "small"
      ? "text-2xl md:text-3xl"
      : fontSize === "large"
        ? "text-4xl md:text-5xl"
        : "text-3xl md:text-4xl";

  const subtitleClass =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";

  const verseClass =
    fontSize === "small"
      ? "text-md md:text-lg"
      : fontSize === "large"
        ? "text-xl md:text-2xl"
        : "text-lg md:text-xl";

  /** Same as bodyClass; use for intro paragraphs and lesson body text. */
  const introClass = bodyClass;

  const buttonClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-md" : "text-sm";

  return {
    bodyClass,
    bodyTitleClass,
    subBodyClass,
    h1Class,
    subtitleClass,
    verseClass,
    introClass,
    buttonClass,
  };
}
