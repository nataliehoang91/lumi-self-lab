"use client";

import { EnBibleLangPage } from "../en/bible-lang-page";

export interface ZhBibleLangPageProps {
  lang: string;
}

/** Chinese: use English content for now. */
export function ZhBibleLangPage({ lang }: ZhBibleLangPageProps) {
  return <EnBibleLangPage lang={lang} />;
}
