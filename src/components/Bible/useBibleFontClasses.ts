"use client";

import { useBibleApp } from "@/components/Bible/BibleAppContext";

/**
 * Shared font-size classes for the Bible app (landing, learn, read, etc.).
 * Uses the app font size setting so body, headings, and verse scale consistently.
 */
export function useBibleFontClasses() {
  const { fontSize } = useBibleApp();

  /** Prominent labels / small section headings. */
  const bodyTitleClass =
    fontSize === "small"
      ? "text-[15px] md:text-sm"
      : fontSize === "large"
        ? "text-lg md:text-[18px]"
        : "text-base md:text-[15px]";

  /** One step up from bodyTitleClass, for key Lang journey headings. */
  const langBodyTitleClass =
    fontSize === "small"
      ? "text-base md:text-[15px]"
      : fontSize === "large"
        ? "text-xl md:text-[20px]"
        : "text-lg md:text-[17px]";

  const bodyClass =
    fontSize === "small"
      ? "text-sm md:text-[13px]"
      : fontSize === "large"
        ? "text-lg md:text-[17px]"
        : "text-base md:text-[15px]";

  const subBodyClass =
    fontSize === "small"
      ? "text-[11px] md:text-[11px]"
      : fontSize === "large"
        ? "text-sm md:text-[13px]"
        : "text-xs md:text-[12px]";

  /** One size up from bodyClass (e.g. for landing Journey section). */
  const bodyClassUp =
    fontSize === "small"
      ? "text-base md:text-sm"
      : fontSize === "large"
        ? "text-xl md:text-lg"
        : "text-lg md:text-base";

  /** One size up from subBodyClass (e.g. for landing Journey section). */
  const subBodyClassUp =
    fontSize === "small"
      ? "text-xs md:text-[11px]"
      : fontSize === "large"
        ? "text-base md:text-sm"
        : "text-sm md:text-xs";

  const h1Class =
    fontSize === "small"
      ? "text-[26px] md:text-3xl"
      : fontSize === "large"
        ? "text-4xl md:text-[40px]"
        : "text-[32px] md:text-[34px]";

  const subtitleClass =
    fontSize === "small"
      ? "text-base md:text-[17px]"
      : fontSize === "large"
        ? "text-2xl md:text-[22px]"
        : "text-xl md:text-[20px]";

  const verseClass =
    fontSize === "small"
      ? "text-base md:text-lg"
      : fontSize === "large"
        ? "text-xl md:text-2xl"
        : "text-lg md:text-xl";

  /** Same as bodyClass; use for intro paragraphs and lesson body text. */
  const introClass = bodyClass;

  const buttonClass =
    fontSize === "small"
      ? "text-xs md:text-[11px]"
      : fontSize === "large"
        ? "text-base md:text-[15px]"
        : "text-sm md:text-[13px]";

  /** Slightly larger buttons for Lang hero primary CTAs. */
  const langButtonClass =
    fontSize === "small"
      ? "text-sm md:text-[13px]"
      : fontSize === "large"
        ? "text-lg md:text-[17px]"
        : "text-base md:text-[15px]";

  /** Large hero title (e.g. LangPage). */
  const heroTitleClass =
    fontSize === "small"
      ? "text-[36px] md:text-5xl lg:text-6xl"
      : fontSize === "large"
        ? "text-6xl md:text-7xl lg:text-[84px]"
        : "text-5xl md:text-[56px] lg:text-[64px]";

  /** Stat value (big number). */
  const statValueClass =
    fontSize === "small"
      ? "text-2xl md:text-3xl"
      : fontSize === "large"
        ? "text-4xl md:text-5xl"
        : "text-3xl md:text-4xl";

  /** Stat value one size smaller. */
  const statValueClassDown =
    fontSize === "small"
      ? "text-xl md:text-2xl"
      : fontSize === "large"
        ? "text-3xl md:text-4xl"
        : "text-2xl md:text-3xl";

  return {
    bodyClass,
    bodyClassUp,
    bodyTitleClass,
    langBodyTitleClass,
    subBodyClass,
    subBodyClassUp,
    h1Class,
    subtitleClass,
    verseClass,
    introClass,
    buttonClass,
    langButtonClass,
    heroTitleClass,
    statValueClass,
    statValueClassDown,
  };
}
