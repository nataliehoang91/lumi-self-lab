"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type Language = "EN" | "VI" | "ZH";
export type FontSize = "small" | "medium" | "large";
export type LayoutMode = "vertical" | "horizontal" | "all";

const BIBLE_PREFS_KEY = "bible-app-prefs";

function readStoredPrefs(): { language: Language; fontSize: FontSize } {
  if (typeof window === "undefined")
    return { language: "EN", fontSize: "medium" };
  try {
    const raw = window.localStorage.getItem(BIBLE_PREFS_KEY);
    if (!raw) return { language: "EN", fontSize: "medium" };
    const parsed = JSON.parse(raw) as Record<string, string>;
    const language =
      parsed.language === "VI" || parsed.language === "ZH" ? parsed.language : "EN";
    const fontSize =
      parsed.fontSize === "small" || parsed.fontSize === "large" ? parsed.fontSize : "medium";
    return { language, fontSize };
  } catch {
    return { language: "EN", fontSize: "medium" };
  }
}

function writeStoredPrefs(language: Language, fontSize: FontSize) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      BIBLE_PREFS_KEY,
      JSON.stringify({ language, fontSize })
    );
  } catch {
    // ignore
  }
}

type BibleAppContextValue = {
  globalLanguage: Language;
  setGlobalLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  registerShuffle: (fn: () => void) => () => void;
  triggerShuffle: () => void;
};

const BibleAppContext = createContext<BibleAppContextValue | null>(null);

export function BibleAppProvider({ children }: { children: ReactNode }) {
  const [globalLanguage, setGlobalLanguage] = useState<Language>("EN");
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("vertical");
  const shuffleRef = useRef<(() => void) | null>(null);
  const hasLoadedFromStorage = useRef(false);

  // Load persisted prefs after mount (avoids hydration mismatch).
  useEffect(() => {
    const { language, fontSize: size } = readStoredPrefs();
    setGlobalLanguage(language);
    setFontSize(size);
    hasLoadedFromStorage.current = true;
  }, []);

  // Persist when user changes language or font size (only after we've loaded from storage).
  useEffect(() => {
    if (hasLoadedFromStorage.current) {
      writeStoredPrefs(globalLanguage, fontSize);
    }
  }, [globalLanguage, fontSize]);

  const registerShuffle = useCallback((fn: () => void) => {
    shuffleRef.current = fn;
    return () => {
      shuffleRef.current = null;
    };
  }, []);

  const triggerShuffle = useCallback(() => {
    shuffleRef.current?.();
  }, []);

  const value: BibleAppContextValue = {
    globalLanguage,
    setGlobalLanguage,
    fontSize,
    setFontSize,
    layoutMode,
    setLayoutMode,
    registerShuffle,
    triggerShuffle,
  };

  return (
    <BibleAppContext.Provider value={value}>{children}</BibleAppContext.Provider>
  );
}

export function useBibleApp() {
  const ctx = useContext(BibleAppContext);
  if (!ctx) throw new Error("useBibleApp must be used within BibleAppProvider");
  return ctx;
}
