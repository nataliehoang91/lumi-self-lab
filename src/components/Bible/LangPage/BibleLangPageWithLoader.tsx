"use client";

import { useEffect } from "react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { EnBibleLangPage } from "./en/bible-lang-page";
import { VnBibleLangPage } from "./vn/bible-lang-page";
import type { BibleBook } from "@/components/Bible/Read/types";

export interface BibleLangPageWithLoaderProps {
  locale: string;
  books: BibleBook[];
}

const LOCALE_TO_LANGUAGE = { en: "EN", vi: "VI", zh: "ZH" } as const;

export function BibleLangPageWithLoader({
  locale,
  books,
}: BibleLangPageWithLoaderProps) {
  const { setGlobalLanguage } = useBibleApp();

  // Persist selected language to localStorage (syncs with BibleAppContext / navbar)
  useEffect(() => {
    const lang = LOCALE_TO_LANGUAGE[locale as keyof typeof LOCALE_TO_LANGUAGE] ?? "EN";
    setGlobalLanguage(lang);
  }, [locale, setGlobalLanguage]);

  return locale === "vi" ? (
    <VnBibleLangPage lang={locale} books={books} />
  ) : (
    <EnBibleLangPage lang={locale} books={books} />
  );
}
