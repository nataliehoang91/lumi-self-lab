"use client";

import { useBibleApp } from "@/components/Bible/BibleAppContext";

/**
 * Shared font-size classes for the Bible app (landing, learn, read, etc.).
 * Uses the app font size setting so body, headings, and verse scale consistently.
 */
export function useBibleFontClasses() {
  const { fontSize } = useBibleApp();

  /** Mobile: one size up for readability; md+: nominal size. */
  const bodyTitleClass =
    fontSize === "small"
      ? "text-lg md:text-md"
      : fontSize === "large"
        ? "text-2xl md:text-xl"
        : "text-xl md:text-lg";

  const bodyClass =
    fontSize === "small"
      ? "text-md md:text-sm"
      : fontSize === "large"
        ? "text-xl md:text-lg"
        : "text-lg md:text-md";

  const subBodyClass =
    fontSize === "small"
      ? "text-xs md:text-[0.6875rem]"
      : fontSize === "large"
        ? "text-base md:text-sm"
        : "text-sm md:text-xs";

  /** One size up from bodyClass (e.g. for landing Journey section). */
  const bodyClassUp =
    fontSize === "small"
      ? "text-lg md:text-md"
      : fontSize === "large"
        ? "text-2xl md:text-xl"
        : "text-xl md:text-lg";

  /** One size up from subBodyClass (e.g. for landing Journey section). */
  const subBodyClassUp =
    fontSize === "small"
      ? "text-sm md:text-xs"
      : fontSize === "large"
        ? "text-lg md:text-base"
        : "text-base md:text-sm";

  const h1Class =
    fontSize === "small"
      ? "text-2xl md:text-3xl"
      : fontSize === "large"
        ? "text-4xl md:text-5xl"
        : "text-3xl md:text-4xl";

  const subtitleClass =
    fontSize === "small"
      ? "text-lg md:text-base"
      : fontSize === "large"
        ? "text-2xl md:text-xl"
        : "text-xl md:text-lg";

  const verseClass =
    fontSize === "small"
      ? "text-md md:text-lg"
      : fontSize === "large"
        ? "text-xl md:text-2xl"
        : "text-lg md:text-xl";

  /** Same as bodyClass; use for intro paragraphs and lesson body text. */
  const introClass = bodyClass;

  const buttonClass =
    fontSize === "small"
      ? "text-sm md:text-xs"
      : fontSize === "large"
        ? "text-lg md:text-md"
        : "text-base md:text-sm";

  /** Large hero title (e.g. LangPage). */
  const heroTitleClass =
    fontSize === "small"
      ? "text-4xl md:text-5xl lg:text-6xl"
      : fontSize === "large"
        ? "text-6xl md:text-8xl lg:text-9xl"
        : "text-5xl md:text-7xl lg:text-8xl";

  /** Stat value (big number). */
  const statValueClass =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";

  /** Stat value one size smaller. */
  const statValueClassDown =
    fontSize === "small"
      ? "text-2xl md:text-3xl"
      : fontSize === "large"
        ? "text-4xl md:text-5xl"
        : "text-3xl md:text-4xl";

  return {
    bodyClass,
    bodyClassUp,
    bodyTitleClass,
    subBodyClass,
    subBodyClassUp,
    h1Class,
    subtitleClass,
    verseClass,
    introClass,
    buttonClass,
    heroTitleClass,
    statValueClass,
    statValueClassDown,
  };
}
