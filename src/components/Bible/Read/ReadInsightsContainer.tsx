"use client";

import { Lightbulb } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadInsights } from "./ReadInsights";
import { ReadScrollNav } from "./ReadScrollNav";
import { getInsightsForChapter } from "@/app/actions/bible/insights";
import type { ChapterInsightData } from "@/app/actions/bible/insights";

export function ReadInsightsContainer() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const {
    focusMode,
    leftBook,
    leftChapter,
    leftVersion,
    rightVersion,
    syncMode,
    insightOpen,
    insightMinimized,
    setInsightOpen,
    setInsightMinimized,
  } = useRead();

  const [currentInsight, setCurrentInsight] = useState<ChapterInsightData | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const lastFetchKey = useRef<string>("");

  useEffect(() => {
    if (!insightOpen || !leftBook) return;

    const fetchKey = `${leftBook.id}-${leftChapter}-${globalLanguage}`;
    if (fetchKey === lastFetchKey.current) return;
    lastFetchKey.current = fetchKey;

    setLoadingInsight(true);
    setCurrentInsight(null);

    getInsightsForChapter(leftBook.id, leftChapter, globalLanguage)
      .then(({ ai, db }) => {
        setCurrentInsight(ai ?? db ?? null);
      })
      .catch(() => setCurrentInsight(null))
      .finally(() => setLoadingInsight(false));
  }, [insightOpen, leftBook, leftChapter, globalLanguage]);

  const hasContent = leftVersion !== null || rightVersion !== null;
  const isIndependent = rightVersion !== null && !syncMode;
  const showFloatingNav = hasContent && !isIndependent;

  return (
    <>
      <ReadInsights
        insightOpen={insightOpen}
        focusMode={focusMode}
        leftBook={leftBook}
        leftChapter={leftChapter}
        loadingInsight={loadingInsight}
        currentInsight={currentInsight}
        t={t}
        onClose={() => setInsightOpen(false)}
      />

      {/* Read nav (sync/single): at bottom (or at top when Insights open, except in focus mode) */}
      {showFloatingNav && (
        <ReadScrollNav
          variant="floating"
          floatingPosition={
            !focusMode && insightOpen && !insightMinimized ? "top" : "bottom"
          }
        />
      )}

      {/* When insights minimized, only show pill to expand (nav stays on top) */}
      {hasContent && !focusMode && insightOpen && insightMinimized && (
        <div className="fixed right-4 bottom-4 z-50">
          <button
            type="button"
            onClick={() => setInsightMinimized(false)}
            className="bg-card/95 border-border text-muted-foreground hover:bg-muted/80 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs shadow-lg"
          >
            <span className="bg-primary/10 text-primary flex h-5 w-5 items-center justify-center rounded-full">
              <Lightbulb className="h-3 w-3" />
            </span>
            <span className="text-foreground font-medium">
              {t("readInsightsTitle") ?? "Chapter insights"}
            </span>
            {leftBook && (
              <span className="text-muted-foreground text-[11px]">
                {leftBook.nameEn} {leftChapter}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
