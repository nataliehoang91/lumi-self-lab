"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { useVisibleCount, useHorizontalVisibleCount } from "./useVisibleCount";
import { LazyFlashCard } from "./LazyFlashCard";

const ALL_BATCH_SIZE = 50;

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

export interface FlashCardViewProps {
  ids: string[];
}

export function FlashCardView({ ids }: FlashCardViewProps) {
  const [mounted, setMounted] = useState(false);
  const { globalLanguage, fontSize, layoutMode, registerShuffle } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  /** Per-card language (card id -> EN | VI). Unset cards use globalLanguage. */
  const [cardLanguageById, setCardLanguageById] = useState<Record<string, Language>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  /** In "all" mode: how many verses to show (50, 100, …). */
  const [allDisplayCount, setAllDisplayCount] = useState(ALL_BATCH_SIZE);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const verticalVisibleCount = useVisibleCount();
  const horizontalVisibleCount = useHorizontalVisibleCount();
  /** Horizontal: 1 on mobile, then 2→3→4 by breakpoint; vertical: 1→2→3→5. */
  const visibleCount =
    layoutMode === "horizontal"
      ? horizontalVisibleCount
      : layoutMode === "vertical"
        ? verticalVisibleCount
        : 1;
  const maxIndex = Math.max(0, ids.length - visibleCount);
  const visibleIds = ids.slice(currentIndex, currentIndex + visibleCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex, visibleCount]);

  /** When switching to "all" mode, cap display count. */
  useEffect(() => {
    if (layoutMode === "all") {
      setAllDisplayCount((c) => Math.min(c, Math.max(ALL_BATCH_SIZE, ids.length)));
    }
  }, [layoutMode, ids.length]);

  /** Scroll listener for Back to top in "all" mode. */
  useEffect(() => {
    if (layoutMode !== "all") return;
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [layoutMode]);

  const toggleFlip = useCallback(
    (verseId: string) => {
      if (!isAnimating) {
        setFlippedIds((prev) => {
          const next = new Set(prev);
          if (next.has(verseId)) next.delete(verseId);
          else next.add(verseId);
          return next;
        });
      }
    },
    [isAnimating]
  );

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
    if (!isAnimating && ids.length > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(Math.floor(Math.random() * Math.max(1, ids.length - visibleCount + 1)));
        setIsAnimating(false);
      }, 300);
    }
  }, [isAnimating, ids.length, visibleCount]);

  useEffect(() => {
    return registerShuffle(handleShuffle);
  }, [registerShuffle, handleShuffle]);

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
    if (layoutMode === "all") return;
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

  if (ids.length === 0) {
    return (
      <div className="rounded-xl bg-card dark:bg-slate-800 border border-border dark:border-slate-700 p-8 text-center text-muted-foreground shadow-lg">
        {intl.t("noVerses")}
      </div>
    );
  }

  const isVertical = layoutMode === "vertical";
  const isAll = layoutMode === "all";

  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  const allIds = ids.slice(0, allDisplayCount);
  const hasMoreAll = ids.length > allDisplayCount;
  const loadMore = () => setAllDisplayCount((c) => Math.min(c + ALL_BATCH_SIZE, ids.length));
  const scrollToTop = () =>
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" }) ??
    window.scrollTo({ top: 0, behavior: "smooth" });

  if (isAll) {
    return (
      <div
        className={cn(
          "w-full flex flex-col items-center min-h-0 px-4 sm:px-6 max-w-6xl mx-auto",
          fontSizeClass
        )}
        ref={scrollAnchorRef}
      >
        {/* Pagination info */}
        <div className="w-full text-center py-3 shrink-0">
          <p className="text-sm text-muted-foreground">
            {intl.t("showing", { from: 1, to: allIds.length, total: ids.length })}
          </p>
        </div>

        {/* Grid: 4 → 3 → 2 → 1 by screen size */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 py-4">
          {allIds.map((verseId) => (
            <LazyFlashCard
              key={verseId}
              verseId={verseId}
              isFlipped={flippedIds.has(verseId)}
              onFlip={() => toggleFlip(verseId)}
              cardLanguage={cardLanguageById[verseId] ?? globalLanguage}
              onCardLanguageChange={(lang) => setLanguageForCard(verseId, lang)}
              t={{
                clickToReveal: getBibleIntl(cardLanguageById[verseId] ?? globalLanguage).t(
                  "clickToReveal"
                ),
              }}
              horizontal={false}
            />
          ))}
        </div>

        {/* Load more + Back to top */}
        <div className="w-full flex flex-col items-center gap-4 py-6 pb-8">
          {hasMoreAll && (
            <Button variant="outline" onClick={loadMore} className="min-w-[140px]">
              {intl.t("loadMore")}
            </Button>
          )}
          {showBackToTop && (
            <Button variant="ghost" size="sm" onClick={scrollToTop} className="gap-2">
              <ArrowUp className="h-4 w-4" />
              {intl.t("backToTop")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full flex flex-col items-center px-4 sm:px-6 max-w-6xl mx-auto",
        "min-h-[calc(100vh-3.5rem)]",
        fontSizeClass
      )}
    >
      {/* Progress */}
      <div className="w-full text-center py-3 shrink-0">
        <p className="text-sm text-muted-foreground">
          {visibleCount > 1
            ? `${currentIndex + 1}–${Math.min(currentIndex + visibleCount, ids.length)} of ${ids.length}`
            : intl.t("verseOf", { current: currentIndex + 1, total: ids.length })}
        </p>
        <div className="flex justify-center gap-1 sm:gap-1.5 mt-2 flex-wrap">
          {Array.from({ length: Math.max(1, maxIndex + 1) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-6 sm:w-8 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to verse set ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Cards + navigation — flex-1 + justify-center to center block vertically */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-4 min-h-0">
        <div
          className={cn(
            "flex items-center gap-4 max-w-full",
            isVertical ? "flex-col w-full" : "flex-row justify-center w-full"
          )}
        >
          <Button
            type="button"
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

          <div
            className={cn(
              "flex gap-3 sm:gap-4 min-h-0",
              isVertical
                ? "flex-col flex-1 w-full max-w-md overflow-y-auto"
                : "flex-row justify-center overflow-x-auto shrink-0 min-w-0"
            )}
          >
            {visibleIds.map((verseId) => (
              <LazyFlashCard
                key={verseId}
                verseId={verseId}
                isFlipped={flippedIds.has(verseId)}
                onFlip={() => toggleFlip(verseId)}
                cardLanguage={cardLanguageById[verseId] ?? globalLanguage}
                onCardLanguageChange={(lang) => setLanguageForCard(verseId, lang)}
                t={{
                  clickToReveal: getBibleIntl(cardLanguageById[verseId] ?? globalLanguage).t(
                    "clickToReveal"
                  ),
                }}
                horizontal={!isVertical}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex || isAnimating}
            className="shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full"
            aria-label={isVertical ? "Next (down)" : "Next (right)"}
          >
            {isVertical ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          {isVertical ? intl.t("useArrowKeysVertical") : intl.t("useArrowKeys")}
        </p>
        <p className="text-xs text-muted-foreground text-center">{intl.t("keyboardHint")}</p>
      </div>
    </div>
  );
}
