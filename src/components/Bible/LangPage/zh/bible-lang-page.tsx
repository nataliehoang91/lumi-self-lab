"use client";

import type { BibleBook } from "@/components/Bible/Read/types";
import { EnBibleLangPage } from "../en/bible-lang-page";

export interface ZhBibleLangPageProps {
  lang: string;
  books: BibleBook[];
}

/** Chinese: use English content for now. */
export function ZhBibleLangPage({ lang, books }: ZhBibleLangPageProps) {
  return <EnBibleLangPage lang={lang} books={books} />;
}
