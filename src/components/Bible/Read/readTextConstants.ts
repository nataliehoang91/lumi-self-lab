/**
 * Read-page-only text settings (Bible verse content).
 * Separate from app-wide BibleAppContext fontSize (navbar/learn/flashcards).
 */

export const READ_FONT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type ReadFontSize = (typeof READ_FONT_SIZES)[number];

/** rem values for verse text; M = 1rem base */
export const READ_FONT_SIZE_REM: Record<ReadFontSize, number> = {
  XS: 0.75,
  S: 0.8125,
  M: 1,
  L: 1.125,
  XL: 1.25,
  XXL: 1.375,
};

export interface ReadFontFaceOption {
  id: string;
  label: string;
  /** Tailwind class for font (e.g. font-bible-english) or use fontFamily for system */
  className?: string;
  fontFamily?: string;
}

/** English (NIV/KJV): serif & display fonts from reference design. No Vietnamese fonts. */
export const READ_FONT_FACES_EN: ReadFontFaceOption[] = [
  { id: "lora", label: "Lora", className: "font-bible-english" },
  { id: "georgia", label: "Georgia", fontFamily: "Georgia, ui-serif, serif" },
  {
    id: "playfair",
    label: "Playfair",
    fontFamily: "var(--font-playfair), ui-serif, serif",
  },
  { id: "source-serif", label: "Serif", fontFamily: "ui-serif, Georgia, serif" },
  {
    id: "libre-baskerville",
    label: "Libre",
    fontFamily: "var(--font-libre-baskerville), ui-serif, serif",
  },
  { id: "chivo", label: "Chivo", fontFamily: "var(--font-chivo), sans-serif" },
  { id: "sora", label: "Sora", fontFamily: "var(--font-sora), sans-serif" },
];

/** Vietnamese: Google Fonts suggested for Vietnamese (good diacritics, UI-friendly). All use subset "vietnamese". */
export const READ_FONT_FACES_VI: ReadFontFaceOption[] = [
  {
    id: "be-vietnam-pro",
    label: "Be Vietnam Pro",
    fontFamily: "var(--font-be-vietnam-pro), sans-serif",
  },
  { id: "roboto", label: "Roboto", fontFamily: "var(--font-roboto), sans-serif" },
  {
    id: "noto-sans",
    label: "Noto Sans",
    fontFamily: "var(--font-noto-sans), sans-serif",
  },
  {
    id: "open-sans",
    label: "Open Sans",
    fontFamily: "var(--font-open-sans), sans-serif",
  },
  { id: "inter", label: "Inter", fontFamily: "var(--font-inter), sans-serif" },
  { id: "merriweather", label: "Merriweather", className: "font-vietnamese" },
  { id: "noto-serif", label: "Noto Serif", className: "font-vietnamese-flashcard" },
];
