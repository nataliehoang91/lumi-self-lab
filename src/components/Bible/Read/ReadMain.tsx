"use client";

import { useEffect, useState } from "react";
import { GripVertical, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRead } from "./ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "./ReadingPanel";
import { getInsightsForChapter } from "@/app/actions/bible/insights";

export function ReadMain() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  const {
    leftVersion,
    rightVersion,
    syncMode,
    focusMode,
    leftBook,
    leftChapter,
    rightBook,
    rightChapter,
    leftContent,
    rightContent,
    loadingLeft,
    loadingRight,
    books,
    hoveredVerse,
    setHoveredVerse,
    panelWidth,
    setIsDragging,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
    insightOpen,
    setInsightOpen,
  } = useRead();

  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  const [activeInsightTab, setActiveInsightTab] = useState<
    "context" | "explanation" | "reflection"
  >("context");

  // Close insights with ESC key
  useEffect(() => {
    if (!insightOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInsightOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [insightOpen, setInsightOpen]);

  const [insightFromDb, setInsightFromDb] = useState<{
    context: string | null;
    explanation: string | null;
    reflections: string[];
  } | null>(null);
  const [insightFromAi, setInsightFromAi] = useState<{
    context: string | null;
    explanation: string | null;
    reflections: string[];
  } | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    if (!insightOpen || !leftBook) return;
    let cancelled = false;
    const tid = setTimeout(() => {
      if (!cancelled) setLoadingInsight(true);
    }, 0);
    getInsightsForChapter(leftBook.id, leftChapter, globalLanguage)
      .then(({ db, ai }) => {
        if (cancelled) return;
        setInsightFromDb(
          db ? { context: db.context, explanation: db.explanation, reflections: db.reflections } : null
        );
        setInsightFromAi(
          ai ? { context: ai.context, explanation: ai.explanation, reflections: ai.reflections } : null
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingInsight(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [insightOpen, leftBook, leftChapter, globalLanguage]);

  const john3Fallback =
    leftBook && leftBook.nameEn === "John" && leftChapter === 3
      ? {
          context:
            t("readInsightJohn3Context") ??
            "This conversation between Jesus and Nicodemus takes place early in Jesus' ministry and introduces the theme of spiritual rebirth.",
          explanation:
            t("readInsightJohn3Explanation") ??
            'Jesus explains that being "born again" is a spiritual transformation through the Spirit, not a physical rebirth. John 3:16 reveals God’s love and the gift of eternal life through belief in Jesus.',
          reflections: [
            t("readInsightJohn3Reflection1") ??
              'What does "being born again" mean to you personally?',
            t("readInsightJohn3Reflection2") ??
              "How does the image of the wind help you understand spiritual transformation?",
          ],
        }
      : null;

  const currentInsight = insightFromDb ?? insightFromAi ?? john3Fallback;

  return (
    <main className={cn("transition-all duration-300", focusMode ? "py-8" : "py-6")}>
      <div className={cn("mx-auto", focusMode ? "max-w-6xl px-6" : "max-w-7xl px-4 sm:px-6")}>
        <div
          className={cn("flex gap-0 relative", isIndependentTwoPanels && "flex-col md:flex-row")}
        >
          <div
            className={cn(
              "transition-all duration-300 min-w-0",
              isIndependentTwoPanels && "w-full md:w-[var(--read-left-width)]"
            )}
            style={
              rightVersion !== null
                ? isIndependentTwoPanels
                  ? { ["--read-left-width" as string]: `${panelWidth}%` }
                  : { width: `${panelWidth}%` }
                : { width: "100%" }
            }
          >
            <ReadingPanel
              version={leftVersion}
              book={leftBook}
              chapter={leftChapter}
              onBookChange={handleLeftBookChange}
              onChapterChange={handleLeftChapterChange}
              content={leftContent}
              loading={loadingLeft}
              books={books}
              hoveredVerse={hoveredVerse}
              onVerseHover={setHoveredVerse}
              focusMode={focusMode}
              showControls={!syncMode || rightVersion === null}
              showBookChapterSelectors={rightVersion !== null && !syncMode}
              fontSize={fontSize}
              t={t}
              testamentFilter={syncMode ? testamentFilter : leftTestamentFilter}
              onTestamentFilterChange={!syncMode ? setLeftTestamentFilterAndAdjust : undefined}
            />
          </div>

          {rightVersion !== null && !focusMode && (
            <div
              className={cn(
                "w-px bg-border relative flex items-center justify-center cursor-col-resize hover:bg-primary transition-colors group shrink-0",
                isIndependentTwoPanels && "hidden md:flex"
              )}
              onMouseDown={() => setIsDragging(true)}
            >
              <div className="absolute bg-muted group-hover:bg-primary/10 p-1.5 rounded-full transition-colors">
                <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          )}

          {rightVersion !== null && (
            <div
              className={cn(
                "transition-all duration-300 min-w-0",
                isIndependentTwoPanels && "w-full md:w-[var(--read-right-width)]"
              )}
              style={
                isIndependentTwoPanels
                  ? { ["--read-right-width" as string]: `${100 - panelWidth}%` }
                  : { width: `${100 - panelWidth}%` }
              }
            >
              <ReadingPanel
                version={rightVersion}
                book={syncMode ? leftBook : rightBook}
                chapter={syncMode ? leftChapter : rightChapter}
                onBookChange={handleRightBookChange}
                onChapterChange={handleRightChapterChange}
                content={rightContent}
                loading={loadingRight}
                books={books}
                hoveredVerse={hoveredVerse}
                onVerseHover={setHoveredVerse}
                focusMode={focusMode}
                showControls={!syncMode}
                showBookChapterSelectors={!syncMode}
                fontSize={fontSize}
                t={t}
                testamentFilter={syncMode ? testamentFilter : rightTestamentFilter}
                onTestamentFilterChange={!syncMode ? setRightTestamentFilterAndAdjust : undefined}
              />
            </div>
          )}
        </div>

        {/* Insights sheet */}
        {insightOpen && !focusMode && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/60"
              onClick={() => setInsightOpen(false)}
              aria-hidden
            />
            <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
              <div className="mx-auto max-w-3xl bg-card/95 backdrop-blur border border-border rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-300">
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
                    <button
                      type="button"
                      onClick={() => setInsightOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {t("readInsightsClose") ?? "Close"}
                    </button>
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
                      Loading insights…
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
          </>
        )}
      </div>
    </main>
  );
}
