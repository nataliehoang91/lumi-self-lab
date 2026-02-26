"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BibleBook } from "./types";
import type { TFunction } from "./types";

export interface ReadInsightsProps {
  insightOpen: boolean;
  focusMode: boolean;
  leftBook: BibleBook | null;
  leftChapter: number;
  loadingInsight: boolean;
  currentInsight: {
    context: string | null;
    explanation: string | null;
    reflections: string[];
  } | null;
  t: TFunction;
  onClose: () => void;
}

export function ReadInsights({
  insightOpen,
  focusMode,
  leftBook,
  leftChapter,
  loadingInsight,
  currentInsight,
  t,
  onClose,
}: ReadInsightsProps) {
  const [activeInsightTab, setActiveInsightTab] = useState<
    "context" | "explanation" | "reflection"
  >("context");
  const [insightMinimized, setInsightMinimized] = useState(false);

  if (!insightOpen || focusMode) return null;

  return (
    <>
      {/* Insights: full panel (bottom) */}
      {!insightMinimized && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pointer-events-none">
          <div className="mx-auto max-w-3xl pointer-events-auto bg-card/95 backdrop-blur border border-border rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="px-6 pt-5 pb-4 border-b border-border/60 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t("readInsightsTitle") ?? "Chapter insights"}
                    </h3>
                    {leftBook && (
                      <p className="text-xs text-muted-foreground">
                        {t("readInsightsFor", {
                          book: leftBook.nameEn,
                          n: leftChapter,
                        }) ?? `${leftBook.nameEn} ${leftChapter}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInsightMinimized(true)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t("readInsightsMinimize") ?? "Minimize"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInsightMinimized(false);
                      onClose();
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    {t("readInsightsClose") ?? "Close"}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 mt-1">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-second/15 text-second px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                    {t("readInsightsBetaBadge") ?? "Beta"}
                  </span>
                  <span className="hidden sm:inline text-[11px] text-muted-foreground">
                    {t("readInsightsLanguagesNote") ??
                      "Insights are currently available in English and Vietnamese. More languages coming soon."}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInsightTab("context")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    activeInsightTab === "context"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  {t("readInsightsContext") ?? "Context"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInsightTab("explanation")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    activeInsightTab === "explanation"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  {t("readInsightsExplanation") ?? "Explanation"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInsightTab("reflection")}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                    activeInsightTab === "reflection"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  {t("readInsightsReflection") ?? "Reflection"}
                </button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              {loadingInsight ? (
                <div className="text-center text-sm text-muted-foreground py-4">
                  Loading insights...
                </div>
              ) : currentInsight ? (
                <>
                  {activeInsightTab === "context" && (
                    <p className="text-sm text-foreground leading-relaxed text-pretty">
                      {currentInsight.context}
                    </p>
                  )}
                  {activeInsightTab === "explanation" && (
                    <p className="text-sm text-foreground leading-relaxed text-pretty">
                      {currentInsight.explanation}
                    </p>
                  )}
                  {activeInsightTab === "reflection" && (
                    <div className="space-y-3">
                      {currentInsight.reflections.map((reflection, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/40"
                        >
                          <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold mt-0.5 shadow-sm">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-foreground leading-relaxed text-pretty flex-1">
                            {reflection}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  {t("readInsightsComingSoon") ??
                    "Insights for this chapter are coming soon. Try John 3 for a preview."}
                </div>
              )}
            </div>
            <div className="px-6 pb-4 pt-2 border-t border-border/60 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <span>{t("readInsightsDismissHint") ?? "Press"}</span>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono">
                ESC
              </kbd>
              <span>
                {t("readInsightsDismissHintTail") ?? "or tap the lightbulb again to close"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Insights: minimized pill bottom-right */}
      {insightMinimized && (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
          <button
            type="button"
            onClick={() => setInsightMinimized(false)}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-card/95 border border-border px-3 py-1.5 shadow-lg text-xs text-muted-foreground hover:bg-muted/80"
          >
            <span className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-5 h-5">
              <Lightbulb className="w-3 h-3" />
            </span>
            <span className="font-medium text-foreground">
              {t("readInsightsTitle") ?? "Chapter insights"}
            </span>
            {leftBook && (
              <span className="text-[11px] text-muted-foreground">
                {leftBook.nameEn} {leftChapter}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}

