"use client";

import { useEffect } from "react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { EnBibleLangPage } from "./en/bible-lang-page";
import { VnBibleLangPage } from "./vn/bible-lang-page";
import type { BibleBook } from "@/components/Bible/Read/types";
import type { VerseOfDay } from "@/app/actions/bible/read";

export interface BibleLangPageWithLoaderProps {
  locale: string;
  books: BibleBook[];
  verseOfDay?: VerseOfDay | null;
}

const LOCALE_TO_LANGUAGE = { en: "EN", vi: "VI" } as const;

export function BibleLangPageWithLoader({
  locale,
  books,
  verseOfDay,
}: BibleLangPageWithLoaderProps) {
  const { setGlobalLanguage } = useBibleApp();

  useEffect(() => {
    const lang = LOCALE_TO_LANGUAGE[locale as keyof typeof LOCALE_TO_LANGUAGE] ?? "EN";
    setGlobalLanguage(lang);
  }, [locale, setGlobalLanguage]);

  return locale === "vi" ? (
    <VnBibleLangPage lang={locale} books={books} verseOfDay={verseOfDay} />
  ) : (
    <EnBibleLangPage lang={locale} books={books} verseOfDay={verseOfDay} />
  );
}
