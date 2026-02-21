/**
 * Shared types and helpers for vertical/horizontal flash card UIs.
 */

export type Language = "EN" | "VI" | "ZH";

export type EnVersion = "KJV" | "NIV";

export type UIStrings = { clickToReveal: string };

export interface VerseLike {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  verseEnd?: number | null;
  titleEn?: string | null;
  titleVi?: string | null;
  titleZh?: string | null;
  contentVIE1923?: string | null;
  contentKJV?: string | null;
  contentNIV?: string | null;
  contentZH?: string | null;
  content?: string | null;
}

export function normalizeQuotes(text: string): string {
  return text.replace(/`/g, "'");
}

export function speakText(text: string, lang: Language): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const trimmed = text.trim();
  if (!trimmed) return;
  const utterance = new SpeechSynthesisUtterance(trimmed);
  if (lang === "VI") utterance.lang = "vi-VN";
  else if (lang === "ZH") utterance.lang = "zh-CN";
  else utterance.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

/** Capitalize first letter for Vietnamese display (e.g. "anh" → "Anh"). */
function capitalizeFirstLetterVi(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return text;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function getDisplayContent(
  verse: VerseLike,
  cardLanguage: Language,
  enVersion: EnVersion
): string {
  if (cardLanguage === "VI") {
    const raw = verse.contentVIE1923?.trim() || verse.content?.trim() || "";
    return capitalizeFirstLetterVi(normalizeQuotes(raw));
  }
  if (cardLanguage === "ZH") {
    const raw = verse.contentZH?.trim() || verse.content?.trim() || "";
    return normalizeQuotes(raw);
  }
  if (enVersion === "KJV") {
    const raw = verse.contentKJV?.trim() || verse.content?.trim() || "";
    return normalizeQuotes(raw);
  }
  const raw = verse.contentNIV?.trim() || verse.content?.trim() || "";
  return normalizeQuotes(raw);
}

export function getDisplayTitle(verse: VerseLike, cardLanguage: Language): string {
  const ref =
    verse.verseEnd != null && verse.verseEnd > verse.verse
      ? `${verse.chapter}:${verse.verse}-${verse.verseEnd}`
      : `${verse.chapter}:${verse.verse}`;
  if (cardLanguage === "VI" && verse.titleVi?.trim()) return verse.titleVi.trim();
  if (cardLanguage === "ZH" && verse.titleZh?.trim()) return verse.titleZh.trim();
  if (cardLanguage === "EN" && verse.titleEn?.trim()) return verse.titleEn.trim();
  return `${verse.book} ${ref}`;
}

/**
 * KJV uses {supplied word} or {marginal note: Gr. ...}. Parse into parts and footnotes.
 * Returns { parts: (string | number)[], notes: string[] } so we can render "text ¹ more ²" with notes at bottom.
 */
export function parseKJVNotes(text: string): { parts: (string | number)[]; notes: string[] } {
  const notes: string[] = [];
  const parts: (string | number)[] = [];
  const re = /\{([^}]*)\}/g;
  let lastEnd = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    parts.push(text.slice(lastEnd, m.index));
    const inner = m[1].trim();
    const num = notes.length + 1;
    const noteText = inner.includes(":")
      ? inner.replace(/^[^:]+:\s*/, "").trim()
      : inner
        ? `${inner}`
        : "";
    notes.push(noteText || `Note ${num}`);
    parts.push(num);
    lastEnd = m.index + m[0].length;
  }
  if (lastEnd < text.length) parts.push(text.slice(lastEnd));
  return { parts: parts.filter((p) => p !== ""), notes };
}

export function hasKJVNotes(text: string): boolean {
  return typeof text === "string" && text.includes("{") && text.includes("}");
}

export interface FlashCardCommonProps {
  verse: VerseLike;
  isFlipped: boolean;
  onFlip: () => void;
  cardLanguage: Language;
  onCardLanguageChange: (lang: Language) => void;
  t: UIStrings;
  /** When true, card fits container (e.g. grid cell) with no min width. */
  flexible?: boolean;
}
