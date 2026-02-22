import type { Language } from "@/components/Bible/BibleAppContext";

const VALID_VERSION_IDS = ["vi", "niv", "kjv", "zh"] as const;
export type ReadVersionId = (typeof VALID_VERSION_IDS)[number];

export function isReadVersionId(s: string): s is ReadVersionId {
  return VALID_VERSION_IDS.includes(s as ReadVersionId);
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
    : defaultVersionFromLanguage(language);
  const version2: ReadVersionId | null =
    v2Raw && isReadVersionId(v2Raw) ? v2Raw : null;
  const sync =
    syncRaw === "true" ? true : syncRaw === "false" ? false : true;

  return { version1, version2, sync };
}

export function buildReadSearchParams(params: {
  version1?: ReadVersionId | null;
  version2?: ReadVersionId | null;
  sync?: boolean;
}): string {
  const sp = new URLSearchParams();
  if (params.version1 != null && params.version1 !== "")
    sp.set("version1", params.version1);
  if (params.version2 != null && params.version2 !== "")
    sp.set("version2", params.version2);
  if (params.sync !== undefined) sp.set("sync", String(params.sync));
  return sp.toString();
}
