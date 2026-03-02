"use client";

import { useState, useEffect } from "react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { LandingLoader } from "./LandingLoader";
import { EnBibleLangPage } from "./en/bible-lang-page";
import { VnBibleLangPage } from "./vn/bible-lang-page";

export interface BibleLangPageWithLoaderProps {
  locale: string;
}

const LOCALE_TO_LANGUAGE = { en: "EN", vi: "VI", zh: "ZH" } as const;

export function BibleLangPageWithLoader({ locale }: BibleLangPageWithLoaderProps) {
  const [showContent, setShowContent] = useState(false);
  const { setGlobalLanguage } = useBibleApp();

  // Persist selected language to localStorage (syncs with BibleAppContext / navbar)
  useEffect(() => {
    const lang = LOCALE_TO_LANGUAGE[locale as keyof typeof LOCALE_TO_LANGUAGE] ?? "EN";
    setGlobalLanguage(lang);
  }, [locale, setGlobalLanguage]);

  return (
    <>
      {!showContent && (
        <LandingLoader
          onComplete={() => {
            setShowContent(true);
          }}
        />
      )}
      {showContent &&
        (locale === "vi" ? <VnBibleLangPage lang={locale} /> : <EnBibleLangPage lang={locale} />)}
    </>
  );
}
