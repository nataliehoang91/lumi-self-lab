"use client";

import { useState, useEffect } from "react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { LandingLoader } from "./LandingLoader";
import { EnBibleLangPage } from "./en/bible-lang-page";
import { VnBibleLangPage } from "./vn/bible-lang-page";
import type { BibleBook } from "@/components/Bible/Read/types";

export interface BibleLangPageWithLoaderProps {
  locale: string;
  books: BibleBook[];
}

const LOCALE_TO_LANGUAGE = { en: "EN", vi: "VI", zh: "ZH" } as const;
const LOADER_DONE_KEY = "bible-lang-page-loader-done";

function getLoaderAlreadyDone(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(LOADER_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function BibleLangPageWithLoader({
  locale,
  books,
}: BibleLangPageWithLoaderProps) {
  const [showContent, setShowContent] = useState(() => getLoaderAlreadyDone());
  const { setGlobalLanguage } = useBibleApp();

  // Persist selected language to localStorage (syncs with BibleAppContext / navbar)
  useEffect(() => {
    const lang = LOCALE_TO_LANGUAGE[locale as keyof typeof LOCALE_TO_LANGUAGE] ?? "EN";
    setGlobalLanguage(lang);
  }, [locale, setGlobalLanguage]);

  const handleLoaderComplete = () => {
    try {
      sessionStorage.setItem(LOADER_DONE_KEY, "1");
    } catch {
      /* ignore */
    }
    setShowContent(true);
  };

  return (
    <>
      {!showContent && (
        <LandingLoader
          onComplete={handleLoaderComplete}
        />
      )}
      {showContent &&
        (locale === "vi" ? (
          <VnBibleLangPage lang={locale} books={books} />
        ) : (
          <EnBibleLangPage lang={locale} books={books} />
        ))}
    </>
  );
}
