import type { LayoutMode, FontSize, Language } from "@/components/Bible/BibleAppContext";

const DEFAULT_INDEX = 0;
const DEFAULT_LAYOUT: LayoutMode = "all";
const DEFAULT_FONT: FontSize = "medium";
// Keep in sync with FlashCardShell.ALL_BATCH_SIZE (50).
const DEFAULT_LIMIT = 50;

export type FlashcardLayout = LayoutMode;

export interface FlashcardSearchParams {
  index: number;
  layout: LayoutMode;
  font: FontSize;
  lang?: Language;
  limit: number;
  collection?: string;
}

export function parseSearchParams(
  params: Record<string, string | undefined>
): FlashcardSearchParams {
  const indexRaw = params.index;
  let index = Number.parseInt(indexRaw ?? "", 10);
  if (!Number.isFinite(index) || index < 0) index = DEFAULT_INDEX;

  // For now, flashcards only use the \"all\" (grid) layout.
  // We intentionally ignore any layout param in the URL.
  const layout: LayoutMode = DEFAULT_LAYOUT;

  const fontRaw = params.font;
  const font: FontSize =
    fontRaw === "small" || fontRaw === "large" || fontRaw === "medium"
      ? (fontRaw as FontSize)
      : DEFAULT_FONT;

  const limitRaw = params.limit;
  let limit = Number.parseInt(limitRaw ?? "", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = DEFAULT_LIMIT;

  const langRaw = params.lang;
  const lang: Language | undefined =
    langRaw === "EN" || langRaw === "VI" || langRaw === "ZH"
      ? (langRaw as Language)
      : undefined;

  const collection = params.collection;

  return {
    index,
    layout,
    font,
    lang,
    limit,
    collection,
  };
}
