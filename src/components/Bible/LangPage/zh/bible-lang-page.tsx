"use client";

import { EnBibleLangPage } from "../en/bible-lang-page";

export interface ZhBibleLangPageProps {
  lang: string;
}

/** Chinese version: use English content for now; can add zh copy later. */
export function ZhBibleLangPage({ lang }: ZhBibleLangPageProps) {
  return <EnBibleLangPage lang={lang} />;
}
