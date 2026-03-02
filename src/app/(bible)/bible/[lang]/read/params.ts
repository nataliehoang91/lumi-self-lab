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

  const version1: ReadVersionId | null = isReadVersionId(v1Raw)
    ? v1Raw
    : null;
  const version2: ReadVersionId | null =
    v2Raw && isReadVersionId(v2Raw) ? v2Raw : null;
  const sync =
    syncRaw === "true" ? true : syncRaw === "false" ? false : true;

  const book1Id = (searchParams.book1 ?? searchParams.book ?? "").trim() || null;
  const chapter1 = parsePositiveInt(searchParams.chapter1 ?? searchParams.chapter, 1);
  const t1Raw = (searchParams.testament1 ?? searchParams.testament ?? "").trim().toLowerCase();
  const testament1 = isTestamentParam(t1Raw) ? t1Raw : "ot";

  const book2Id = (searchParams.book2 ?? "").trim() || null;
  const chapter2 = parsePositiveInt(searchParams.chapter2, 1);
  const t2Raw = (searchParams.testament2 ?? "").trim().toLowerCase();
  const testament2 = isTestamentParam(t2Raw) ? t2Raw : "ot";

  const insights = searchParams.insights === "true";
  const focus = searchParams.focus === "true";

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
}): string {
  const sp = new URLSearchParams();
  if (params.version1 != null) sp.set("version1", params.version1);
  if (params.version2 != null) sp.set("version2", params.version2);
  if (params.sync !== undefined) sp.set("sync", String(params.sync));
  if (params.book1Id) sp.set("book1", params.book1Id);
  if (params.chapter1 != null && params.chapter1 >= 1) sp.set("chapter1", String(params.chapter1));
  if (params.testament1) sp.set("testament1", params.testament1);
  if (params.book2Id) sp.set("book2", params.book2Id);
  if (params.chapter2 != null && params.chapter2 >= 1) sp.set("chapter2", String(params.chapter2));
  if (params.testament2) sp.set("testament2", params.testament2);
  if (params.insights === true) sp.set("insights", "true");
  if (params.focus === true) sp.set("focus", "true");
  return sp.toString();
}
