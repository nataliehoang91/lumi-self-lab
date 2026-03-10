export type OverviewLang = "en" | "vi";

export function getBookOverviewReadKey(lang: OverviewLang, slugEn: string): string {
  return `book-overview-read:${lang}:${slugEn.toLowerCase()}`;
}

