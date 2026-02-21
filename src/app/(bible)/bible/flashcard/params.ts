import type { Language, FontSize, LayoutMode } from "@/components/Bible/BibleAppContext";

const LAYOUTS = ["vertical", "horizontal", "all"] as const;
const FONTS = ["small", "medium", "large"] as const;
const LANGS = ["EN", "VI", "ZH"] as const;

export function parseSearchParams(searchParams: Record<string, string | undefined>) {
  const index = Math.max(0, parseInt(searchParams.index ?? "0", 10) || 0);
  const layout = LAYOUTS.includes((searchParams.layout as LayoutMode) ?? "all")
    ? (searchParams.layout as LayoutMode)
    : "all";
  const font = FONTS.includes((searchParams.font as FontSize) ?? "medium")
    ? (searchParams.font as FontSize)
    : "medium";
  const lang = LANGS.includes((searchParams.lang as Language) ?? "EN")
    ? (searchParams.lang as Language)
    : "EN";
  const limit = Math.min(
    200,
    Math.max(10, parseInt(searchParams.limit ?? "50", 10) || 50)
  );
  /** Collection id to filter by; empty string = show all verses. */
  const collection = (searchParams.collection ?? "").trim();
  return { index, layout, font, lang, limit, collection };
}

export function buildFlashcardSearchParams(params: {
  index?: number;
  layout?: LayoutMode;
  font?: FontSize;
  lang?: Language;
  limit?: number;
  collection?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.index !== undefined) sp.set("index", String(params.index));
  if (params.layout) sp.set("layout", params.layout ?? "");
  if (params.font) sp.set("font", params.font ?? "");
  if (params.lang) sp.set("lang", params.lang ?? "");
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.collection !== undefined) sp.set("collection", params.collection);
  return sp.toString();
}
