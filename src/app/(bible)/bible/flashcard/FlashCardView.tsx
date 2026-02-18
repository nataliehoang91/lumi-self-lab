"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Shuffle,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVisibleCount } from "./useVisibleCount";
import { SingleFlashCard } from "./SingleFlashCard";

export type Language = "EN" | "VI" | "ZH";
export type FontSize = "small" | "medium" | "large";

export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  titleEn?: string | null;
  titleVi?: string | null;
  contentVIE1923?: string | null;
  contentKJV?: string | null;
  contentNIV?: string | null;
  contentZH?: string | null;
  content?: string | null;
  titleZh?: string | null;
  version?: string | null;
  language?: string | null;
  createdAt: string;
}

type LayoutMode = "vertical" | "horizontal";

const UI_STRINGS = {
  EN: {
    clickToReveal: "Click to reveal verse",
    verseOf: (current: number, total: number) => `Verse ${current} of ${total}`,
    useArrowKeys: "Use arrow keys",
    keyboardHint: "← → to navigate • Space to flip",
    useArrowKeysVertical: "↑ ↓ to navigate • Space to flip",
  },
  VI: {
    clickToReveal: "Nhấp để xem câu kinh thánh",
    verseOf: (current: number, total: number) => `Câu ${current} / ${total}`,
    useArrowKeys: "Sử dụng phím mũi tên",
    keyboardHint: "← → để điều hướng • Space để lật thẻ",
    useArrowKeysVertical: "↑ ↓ để điều hướng • Space để lật thẻ",
  },
  ZH: {
    clickToReveal: "點擊顯示經文",
    verseOf: (current: number, total: number) => `第 ${current} 節 / 共 ${total} 節`,
    useArrowKeys: "使用方向鍵",
    keyboardHint: "← → 導航 • 空格翻面",
    useArrowKeysVertical: "↑ ↓ 導航 • 空格翻面",
  },
};

export function FlashCardView() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalLanguage, setGlobalLanguage] = useState<Language>("EN");
  /** Per-card language (card id -> EN | VI). Unset cards use globalLanguage. */
  const [cardLanguageById, setCardLanguageById] = useState<Record<string, Language>>({});
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("vertical");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const visibleCount = useVisibleCount();
  const maxIndex = Math.max(0, verses.length - visibleCount);
  const visibleVerses = verses.slice(currentIndex, currentIndex + visibleCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/flash", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load verses");
        return res.json();
      })
      .then(setVerses)
      .catch(() => setError("Could not load verses."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex, visibleCount]);

  const toggleFlip = useCallback((verseId: string) => {
    if (!isAnimating) {
      setFlippedIds((prev) => {
        const next = new Set(prev);
        if (next.has(verseId)) next.delete(verseId);
        else next.add(verseId);
        return next;
      });
    }
  }, [isAnimating]);

  const handleNext = useCallback(() => {
    if (!isAnimating && currentIndex < maxIndex) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, currentIndex, maxIndex]);

  const handlePrevious = useCallback(() => {
    if (!isAnimating && currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((i) => i - 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, currentIndex]);

  const handleShuffle = useCallback(() => {
    if (!isAnimating && verses.length > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(Math.floor(Math.random() * Math.max(1, verses.length - visibleCount + 1)));
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, verses.length, visibleCount]);

  const goToIndex = useCallback(
    (idx: number) => {
      if (!isAnimating && idx >= 0 && idx <= maxIndex) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex(idx);
          setIsAnimating(false);
        }, 300);
      }
    },
    [isAnimating, maxIndex]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (layoutMode === "horizontal") {
        if (e.key === "ArrowLeft") handlePrevious();
        else if (e.key === "ArrowRight") handleNext();
      } else {
        if (e.key === "ArrowUp") handlePrevious();
        else if (e.key === "ArrowDown") handleNext();
      }
      if (e.key === " ") e.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [layoutMode, handlePrevious, handleNext]);

  const setLanguageForCard = useCallback((verseId: string, lang: Language) => {
    setCardLanguageById((prev) => ({ ...prev, [verseId]: lang }));
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <p
        className="rounded-xl bg-amber-50 p-4 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="rounded-xl bg-card border p-8 text-center text-muted-foreground shadow-lg">
        No verses yet. Add some in Admin.
      </div>
    );
  }

  /** UI strings use global language (navbar); per-card language only affects that card's labels. */
  const t = UI_STRINGS[globalLanguage];
  const isVertical = layoutMode === "vertical";

  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  return (
    <div className={cn("w-full max-w-6xl mx-auto flex flex-col min-h-0", fontSizeClass)}>
      {/* Navbar: title, EN/VI, layout, font size, shuffle, theme, Admin */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm shadow-sm shrink-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl">✝</span>
            </div>
            <h1 className="text-lg font-semibold truncate">Scripture Memory</h1>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* EN / VI / ZH toggle */}
            <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
              <Button
                variant={globalLanguage === "EN" ? "default" : "ghost"}
                size="sm"
                onClick={() => setGlobalLanguage("EN")}
                className="h-8 px-2.5 text-xs sm:text-sm"
              >
                EN
              </Button>
              <Button
                variant={globalLanguage === "VI" ? "default" : "ghost"}
                size="sm"
                onClick={() => setGlobalLanguage("VI")}
                className="h-8 px-2.5 text-xs sm:text-sm"
              >
                VI
              </Button>
              <Button
                variant={globalLanguage === "ZH" ? "default" : "ghost"}
                size="sm"
                onClick={() => setGlobalLanguage("ZH")}
                className="h-8 px-2.5 text-xs sm:text-sm"
              >
                中
              </Button>
            </div>

            {/* Vertical / Horizontal layout toggle */}
            <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
              <Button
                variant={layoutMode === "vertical" ? "default" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("vertical")}
                className="h-8 w-8"
                title="Vertical"
                aria-label="Vertical layout"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === "horizontal" ? "default" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("horizontal")}
                className="h-8 w-8"
                title="Horizontal"
                aria-label="Horizontal layout"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            {/* Font size (whole Bible app) */}
            <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
              <Button
                variant={fontSize === "small" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFontSize("small")}
                className="h-8 px-2 text-xs"
                title="Smaller text"
                aria-label="Font size small"
              >
                A-
              </Button>
              <Button
                variant={fontSize === "medium" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFontSize("medium")}
                className="h-8 px-2 text-xs"
                title="Medium text"
                aria-label="Font size medium"
              >
                A
              </Button>
              <Button
                variant={fontSize === "large" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFontSize("large")}
                className="h-8 px-2 text-xs"
                title="Larger text"
                aria-label="Font size large"
              >
                A+
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShuffle}
              className="h-8 w-8"
              title="Shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Link
              href="/bible/admin"
              className="rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-primary/10"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress */}
      <div className="text-center py-3 shrink-0">
        <p className="text-sm text-muted-foreground">
          {visibleCount > 1
          ? `${currentIndex + 1}–${Math.min(currentIndex + visibleCount, verses.length)} of ${verses.length}`
          : t.verseOf(currentIndex + 1, verses.length)}
        </p>
        <div className="flex justify-center gap-1 sm:gap-1.5 mt-2 flex-wrap">
          {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-6 sm:w-8 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to verse set ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Cards + navigation */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-4 min-h-0">
        <div className={cn("flex items-center gap-4 w-full max-w-full", isVertical ? "flex-col" : "flex-row justify-center")}>
          {/* Previous */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isAnimating}
            className={cn(
              "shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full",
              isVertical && "order-first"
            )}
            aria-label={isVertical ? "Previous (up)" : "Previous (left)"}
          >
            {isVertical ? <ChevronUp className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>

          {/* Card strip */}
          <div
            className={cn(
              "flex gap-3 sm:gap-4 overflow-hidden min-h-0",
              isVertical ? "flex-col flex-1 w-full max-w-md overflow-y-auto" : "flex-row flex-1 justify-center overflow-x-auto"
            )}
          >
            {visibleVerses.map((verse) => (
              <SingleFlashCard
                key={verse.id}
                verse={verse}
                isFlipped={flippedIds.has(verse.id)}
                onFlip={() => toggleFlip(verse.id)}
                cardLanguage={cardLanguageById[verse.id] ?? globalLanguage}
                onCardLanguageChange={(lang) => setLanguageForCard(verse.id, lang)}
                fontSize={fontSize}
                setFontSize={setFontSize}
                t={{ clickToReveal: UI_STRINGS[cardLanguageById[verse.id] ?? globalLanguage].clickToReveal }}
                horizontal={!isVertical}
              />
            ))}
          </div>

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex || isAnimating}
            className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
            aria-label={isVertical ? "Next (down)" : "Next (right)"}
          >
            {isVertical ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          {isVertical ? t.useArrowKeysVertical : t.useArrowKeys}
        </p>
        <p className="text-xs text-muted-foreground text-center">{t.keyboardHint}</p>
      </div>
    </div>
  );
}
