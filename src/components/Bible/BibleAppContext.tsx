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
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export type Language = "EN" | "VI" | "ZH";
export type FontSize = "small" | "medium" | "large";
export type LayoutMode = "vertical" | "horizontal" | "all";

const BIBLE_PREFS_KEY = "bible-app-prefs";
const LANGS: Language[] = ["EN", "VI", "ZH"];
const FONTS: FontSize[] = ["small", "medium", "large"];
const LAYOUTS: LayoutMode[] = ["vertical", "horizontal", "all"];

function readStoredPrefs(): { language: Language; fontSize: FontSize } {
  if (typeof window === "undefined")
    return { language: "EN", fontSize: "medium" };
  try {
    const raw = window.localStorage.getItem(BIBLE_PREFS_KEY);
    if (!raw) return { language: "EN", fontSize: "medium" };
    const parsed = JSON.parse(raw) as Record<string, string>;
    const language =
      LANGS.includes(parsed.language as Language) ? (parsed.language as Language) : "EN";
    const fontSize =
      FONTS.includes(parsed.fontSize as FontSize) ? (parsed.fontSize as FontSize) : "medium";
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [globalLanguage, setGlobalLanguageState] = useState<Language>("EN");
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>("all");
  const shuffleRef = useRef<(() => void) | null>(null);
  const hasLoadedFromStorage = useRef(false);

  const isFlashcardPage = pathname?.includes("/flashcard") ?? false;

  // Sync state from URL when on flashcard page; otherwise from localStorage.
  useEffect(() => {
    if (isFlashcardPage && searchParams) {
      const lang = searchParams.get("lang");
      const font = searchParams.get("font");
      if (lang && LANGS.includes(lang as Language)) setGlobalLanguageState(lang as Language);
      if (font && FONTS.includes(font as FontSize)) setFontSizeState(font as FontSize);
      setLayoutModeState("all");
    } else {
      const { language, fontSize: size } = readStoredPrefs();
      setGlobalLanguageState(language);
      setFontSizeState(size);
    }
    hasLoadedFromStorage.current = true;
  }, [isFlashcardPage, searchParams]);

  // Persist to localStorage when not on flashcard (and after initial load).
  useEffect(() => {
    if (hasLoadedFromStorage.current && !isFlashcardPage) {
      writeStoredPrefs(globalLanguage, fontSize);
    }
  }, [globalLanguage, fontSize, isFlashcardPage]);

  const setGlobalLanguage = useCallback(
    (lang: Language) => {
      setGlobalLanguageState(lang);
      if (isFlashcardPage && pathname) {
        const next = new URLSearchParams(searchParams?.toString() ?? "");
        next.set("lang", lang);
        router.push(`${pathname}?${next.toString()}`);
      }
    },
    [isFlashcardPage, pathname, router, searchParams]
  );

  const setFontSize = useCallback(
    (size: FontSize) => {
      setFontSizeState(size);
      if (isFlashcardPage && pathname) {
        const next = new URLSearchParams(searchParams?.toString() ?? "");
        next.set("font", size);
        router.push(`${pathname}?${next.toString()}`);
      }
    },
    [isFlashcardPage, pathname, router, searchParams]
  );

  const setLayoutMode = useCallback(
    (mode: LayoutMode) => {
      setLayoutModeState(mode);
      if (isFlashcardPage && pathname) {
        const next = new URLSearchParams(searchParams?.toString() ?? "");
        next.set("layout", mode);
        if (mode === "all") next.set("index", "0");
        router.push(`${pathname}?${next.toString()}`);
      }
    },
    [isFlashcardPage, pathname, router, searchParams]
  );

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
