import type { Language } from "@/components/Bible/BibleAppContext";

const VALID_VERSION_IDS = ["vi", "niv", "kjv", "zh"] as const;
export type ReadVersionId = (typeof VALID_VERSION_IDS)[number];

export type TestamentParam = "ot" | "nt";
const VALID_TESTAMENT: TestamentParam[] = ["ot", "nt"];

export function isReadVersionId(s: string): s is ReadVersionId {
  return VALID_VERSION_IDS.includes(s as ReadVersionId);
}

export function isTestamentParam(s: string): s is TestamentParam {
  return VALID_TESTAMENT.includes(s as TestamentParam);
}

/** Default version when none in URL: from app language. */
export function defaultVersionFromLanguage(lang: Language): ReadVersionId {
  if (lang === "VI") return "vi";
  if (lang === "ZH") return "zh";
  return "niv"; // EN
}

export interface ReadSearchParams {
  version1: ReadVersionId | null;
  version2: ReadVersionId | null;
  sync: boolean;
  book1Id: string | null;
  chapter1: number;
  testament1: TestamentParam;
  book2Id: string | null;
  chapter2: number;
  testament2: TestamentParam;
  insights: boolean;
  focus: boolean;
  verse1: number | null;
  verse2: number | null;
  /** End verse for range highlight (e.g. verse1=43, verseEnd=44 → highlight 43–44). */
  verseEnd: number | null;
  /** Multiple verse numbers to highlight (e.g. verses=3,5,7). Takes precedence over verse1/verseEnd when present. */
  verses: number[];
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = parseInt(value ?? "", 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

export function parseReadSearchParams(
  searchParams: Record<string, string | undefined>,
  language: Language
): ReadSearchParams {
  const v1Raw = (searchParams.version1 ?? searchParams.v1 ?? "").trim().toLowerCase();
  const v2Raw = (searchParams.version2 ?? searchParams.v2 ?? "").trim().toLowerCase();
  const syncRaw = searchParams.sync;

  // Map language-like "en" to default English version so links with version1=en work
  const version1: ReadVersionId | null = isReadVersionId(v1Raw)
    ? v1Raw
    : v1Raw === "en"
      ? "niv"
      : null;
  const version2: ReadVersionId | null = !v2Raw
    ? null
    : isReadVersionId(v2Raw)
      ? v2Raw
      : v2Raw === "en"
        ? "niv"
        : null;
  const sync = syncRaw === "true" ? true : syncRaw === "false" ? false : true;

  const book1Id = (searchParams.book1 ?? searchParams.book ?? "").trim() || null;
  const chapter1 = parsePositiveInt(searchParams.chapter1 ?? searchParams.chapter, 1);
  const t1Raw = (searchParams.testament1 ?? searchParams.testament ?? "")
    .trim()
    .toLowerCase();
  const testament1 = isTestamentParam(t1Raw) ? t1Raw : "ot";

  const book2Id = (searchParams.book2 ?? "").trim() || null;
  const chapter2 = parsePositiveInt(searchParams.chapter2, 1);
  const t2Raw = (searchParams.testament2 ?? "").trim().toLowerCase();
  const testament2 = isTestamentParam(t2Raw) ? t2Raw : "ot";

  const insights = searchParams.insights === "true";
  const focus = searchParams.focus === "true";

  // verses (comma-separated) for multiple highlights; else verse1/verseEnd range or single verse
  const versesRaw = (searchParams.verses ?? "").trim();
  let verses: number[] = [];
  if (versesRaw) {
    verses = versesRaw
      .split(",")
      .map((s) => parsePositiveInt(s.trim(), 0))
      .filter((n) => n >= 1);
    verses = [...new Set(verses)].sort((a, b) => a - b);
  }
  const verse1Raw =
    parsePositiveInt(searchParams.verse1, 0) || parsePositiveInt(searchParams.verse, 0);
  const verse2Raw = parsePositiveInt(searchParams.verse2, 0);
  const verseEndRaw = parsePositiveInt(searchParams.verseEnd, 0);
  let verse1: number | null = verse1Raw >= 1 ? verse1Raw : null;
  const verse2 = verse2Raw >= 1 ? verse2Raw : null;
  let verseEnd: number | null =
    verseEndRaw >= 1 && verse1 != null && verseEndRaw >= verse1 ? verseEndRaw : null;
  if (verses.length > 0) {
    verse1 = verses[0];
    verseEnd = verses.length > 1 && verses[verses.length - 1]! > verse1 ? verses[verses.length - 1]! : null;
  } else if (verse1 != null && verseEnd != null) {
    const start = verse1;
    const end = verseEnd;
    verses = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  } else if (verse1 != null) {
    verses = [verse1];
  }

  return {
    version1,
    version2,
    sync,
    book1Id,
    chapter1,
    testament1,
    book2Id,
    chapter2,
    testament2,
    insights,
    focus,
    verse1,
    verse2,
    verseEnd,
    verses,
  };
}

export function buildReadSearchParams(params: {
  version1?: ReadVersionId | null;
  version2?: ReadVersionId | null;
  sync?: boolean;
  book1Id?: string | null;
  chapter1?: number;
  testament1?: TestamentParam;
  book2Id?: string | null;
  chapter2?: number;
  testament2?: TestamentParam;
  insights?: boolean;
  focus?: boolean;
  verse1?: number | null;
  verse2?: number | null;
  verseEnd?: number | null;
  verses?: number[];
}): string {
  const sp = new URLSearchParams();
  if (params.version1 != null) sp.set("version1", params.version1);
  if (params.version2 != null) sp.set("version2", params.version2);
  if (params.sync !== undefined) sp.set("sync", String(params.sync));
  if (params.book1Id) sp.set("book1", params.book1Id);
  if (params.chapter1 != null && params.chapter1 >= 1)
    sp.set("chapter1", String(params.chapter1));
  if (params.testament1) sp.set("testament1", params.testament1);
  if (params.book2Id) sp.set("book2", params.book2Id);
  if (params.chapter2 != null && params.chapter2 >= 1)
    sp.set("chapter2", String(params.chapter2));
  if (params.testament2) sp.set("testament2", params.testament2);
  if (params.insights === true) sp.set("insights", "true");
  if (params.focus === true) sp.set("focus", "true");
  if (params.verses != null && params.verses.length > 0) {
    sp.set("verses", params.verses.join(","));
    if (params.verses[0] != null) sp.set("verse1", String(params.verses[0]));
  } else {
    if (params.verse1 != null && params.verse1 >= 1)
      sp.set("verse1", String(params.verse1));
    if (
      params.verseEnd != null &&
      params.verseEnd >= 1 &&
      params.verse1 != null &&
      params.verseEnd >= params.verse1
    )
      sp.set("verseEnd", String(params.verseEnd));
  }
  if (params.verse2 != null && params.verse2 >= 1)
    sp.set("verse2", String(params.verse2));
  return sp.toString();
}
