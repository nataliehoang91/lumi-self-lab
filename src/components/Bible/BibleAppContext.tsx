"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "EN" | "VI" | "ZH";
export type FontSize = "small" | "medium" | "large";
export type LayoutMode = "vertical" | "horizontal" | "all";

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
