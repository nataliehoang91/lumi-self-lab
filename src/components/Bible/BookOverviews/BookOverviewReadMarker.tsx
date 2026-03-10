"use client";

import { useEffect } from "react";
import { getBookOverviewReadKey, type OverviewLang } from "./bookOverviewReadStorage";

interface BookOverviewReadMarkerProps {
  lang: OverviewLang;
  slugEn: string;
}

export function BookOverviewReadMarker({ lang, slugEn }: BookOverviewReadMarkerProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = getBookOverviewReadKey(lang, slugEn);
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      // ignore storage failures
    }
  }, [lang, slugEn]);

  return null;
}

