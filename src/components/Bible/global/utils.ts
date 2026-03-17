"use client";

import {
  ENGLISH_MAIN_FONT,
  VIETNAMESE_MAIN_FONT,
} from "@/components/Bible/global/constants";

export function useLocaleFonts(locale?: "en" | "vi") {
  const isVi = locale === "vi";
  const titleFont = isVi ? VIETNAMESE_MAIN_FONT : ENGLISH_MAIN_FONT;
  const bodyFont = isVi ? VIETNAMESE_MAIN_FONT : ENGLISH_MAIN_FONT;

  return { titleFont, bodyFont };
}
