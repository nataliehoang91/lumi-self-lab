"use client";

import { Lightbulb } from "lucide-react";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadInsights } from "./ReadInsights";
import { ReadScrollNav } from "./ReadScrollNav";

/**
 * Temporary placeholder: no network fetch.
 * Always shows the \"coming soon\" message when insights are opened.
 * Renders read nav (prev/next chapter, scroll top/bottom) and when insights minimized, pill + nav row.
 */
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
        loadingInsight={false}
        currentInsight={null}
        t={t}
        onClose={() => setInsightOpen(false)}
      />

      {/* Read nav (sync/single): at top when Insights open, at bottom otherwise */}
      {showFloatingNav && (
        <ReadScrollNav
          variant="floating"
          floatingPosition={insightOpen && !insightMinimized ? "top" : "bottom"}
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
