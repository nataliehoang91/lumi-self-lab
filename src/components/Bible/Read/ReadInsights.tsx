"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRead } from "./context/ReadContext";
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
  const { insightMinimized, setInsightMinimized } = useRead();

  if (!insightOpen || focusMode) return null;

  return (
    <>
      {/* Insights: full panel (bottom) */}
      {!insightMinimized && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
          <div
            className="bg-card/95 border-border animate-in slide-in-from-bottom-4
              pointer-events-auto mx-auto max-w-3xl rounded-2xl border shadow-xl
              backdrop-blur duration-300"
          >
            <div
              className="border-border/60 from-primary/5 via-primary/10 border-b
                bg-gradient-to-r to-transparent px-6 pt-5 pb-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Lightbulb className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold">
                      {t("readInsightsTitle") ?? "Chapter insights"}
                    </h3>
                    {leftBook && (
                      <p className="text-muted-foreground text-xs">
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
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    {t("readInsightsMinimize") ?? "Minimize"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInsightMinimized(false);
                      onClose();
                    }}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    {t("readInsightsClose") ?? "Close"}
                  </button>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2">
                  <span
                    className="bg-second/15 text-second inline-flex items-center
                      rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide
                      uppercase"
                  >
                    {t("readInsightsBetaBadge") ?? "Beta"}
                  </span>
                  <span className="text-muted-foreground hidden text-[11px] sm:inline">
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
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
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
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
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
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    activeInsightTab === "reflection"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  )}
                >
                  {t("readInsightsReflection") ?? "Reflection"}
                </button>
              </div>
            </div>
            <div className="space-y-4 px-6 py-5">
              {loadingInsight ? (
                <div className="text-muted-foreground py-4 text-center text-sm">
                  Loading insights...
                </div>
              ) : currentInsight ? (
                <>
                  {activeInsightTab === "context" && (
                    <p className="text-foreground text-sm leading-relaxed text-pretty">
                      {currentInsight.context}
                    </p>
                  )}
                  {activeInsightTab === "explanation" && (
                    <p className="text-foreground text-sm leading-relaxed text-pretty">
                      {currentInsight.explanation}
                    </p>
                  )}
                  {activeInsightTab === "reflection" && (
                    <div className="space-y-3">
                      {currentInsight.reflections.map((reflection, idx) => (
                        <div
                          key={idx}
                          className="bg-accent/5 border-accent/40 flex items-start gap-3
                            rounded-lg border p-3"
                        >
                          <span
                            className="bg-primary text-primary-foreground mt-0.5 flex h-6
                              w-6 shrink-0 items-center justify-center rounded-full
                              text-xs font-semibold shadow-sm"
                          >
                            {idx + 1}
                          </span>
                          <p
                            className="text-foreground flex-1 text-sm leading-relaxed
                              text-pretty"
                          >
                            {reflection}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground py-4 text-center text-sm">
                  {t("readInsightsComingSoon") ??
                    "Insights for this chapter are coming soon. Try John 3 for a preview."}
                </div>
              )}
            </div>
            <div
              className="border-border/60 text-muted-foreground flex items-center
                justify-center gap-2 border-t px-6 pt-2 pb-4 text-[11px]"
            >
              <span>{t("readInsightsDismissHint") ?? "Press"}</span>
              <kbd
                className="bg-background border-border rounded border px-1.5 py-0.5
                  font-mono text-[10px]"
              >
                ESC
              </kbd>
              <span>
                {t("readInsightsDismissHintTail") ??
                  "or tap the lightbulb again to close"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Minimized pill is rendered by ReadInsightsContainer alongside read nav */}
    </>
  );
}
