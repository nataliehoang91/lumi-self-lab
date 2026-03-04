/**
 * Client-only: read Bible app locale from localStorage (same key as BibleAppContext).
 * Use in client components or effects; do not call from server.
 */

export type BibleLocaleSegment = "en" | "vi" | "zh";

const BIBLE_PREFS_KEY = "bible-app-prefs";
const STORED_TO_SEGMENT: Record<string, BibleLocaleSegment> = {
  EN: "en",
  VI: "vi",
  ZH: "zh",
};

/**
 * Returns the stored Bible locale segment if present and valid; otherwise null.
 * Safe to call only in browser (returns null when window is undefined).
 */
export function getStoredBibleLocale(): BibleLocaleSegment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BIBLE_PREFS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string>;
    const lang = parsed?.language;
    if (lang && lang in STORED_TO_SEGMENT) {
      return STORED_TO_SEGMENT[lang as keyof typeof STORED_TO_SEGMENT];
    }
    return null;
  } catch {
    return null;
  }
}
