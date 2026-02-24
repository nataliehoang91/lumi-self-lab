"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useRead } from "./ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "./ReadingPanel";
import { SyncedVerseList } from "./SyncedVerseList";
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
  const [insightMinimized, setInsightMinimized] = useState(false);

  // Close insights with ESC key
  useEffect(() => {
    if (!insightOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInsightOpen(false);
        setInsightMinimized(false);
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
          {!leftVersion && !rightVersion ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <div className="text-center text-muted-foreground space-y-2">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border">
                  <span className="text-lg">📖</span>
                </div>
                <p className="text-sm font-medium">
                  {t("readEmptyStateTitle") ?? "Select a translation above"}
                </p>
                <p className="text-xs">
                  {t("readEmptyStateSubtitle") ??
                    "Choose one or two versions to compare."}
                </p>
              </div>
            </div>
          ) : syncMode && rightVersion !== null && !focusMode ? (
            <div className="min-w-0 flex-1 overflow-auto">
              <div className="px-4 sm:px-6 md:px-8">
                <SyncedVerseList
                  leftContent={leftContent}
                  rightContent={rightContent}
                  leftVersion={leftVersion}
                  rightVersion={rightVersion}
                  loading={loadingLeft || loadingRight}
                  fontSize={fontSize}
                  focusMode={focusMode}
                  hoveredVerse={hoveredVerse}
                  onVerseHover={setHoveredVerse}
                  t={t}
                />
              </div>
            </div>
          ) : rightVersion !== null && !focusMode ? (
            <div className="w-full min-h-0 flex flex-col md:h-[calc(100vh-12rem)]">
              <ResizablePanelGroup
                direction="horizontal"
                className={cn(
                  "flex-1 min-h-0 w-full overflow-hidden",
                  isIndependentTwoPanels && "flex-col md:flex-row"
                )}
              >
                <ResizablePanel
                  defaultSize={50}
                  minSize={25}
                  maxSize={75}
                  className="min-w-0 min-h-0 overflow-hidden"
                >
                  <div className="h-full min-h-0 overflow-auto">
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
                      showControls={true}
                      showBookChapterSelectors={true}
                      fontSize={fontSize}
                      t={t}
                      testamentFilter={leftTestamentFilter}
                      onTestamentFilterChange={setLeftTestamentFilterAndAdjust}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-primary data-[resize-handle-active]:bg-primary" />
                <ResizablePanel
                  defaultSize={50}
                  minSize={25}
                  maxSize={75}
                  className="min-w-0 min-h-0 overflow-hidden"
                >
                  <div className="h-full min-h-0 overflow-auto">
                    <ReadingPanel
                      version={rightVersion}
                      book={rightBook}
                      chapter={rightChapter}
                      onBookChange={handleRightBookChange}
                      onChapterChange={handleRightChapterChange}
                      content={rightContent}
                      loading={loadingRight}
                      books={books}
                      hoveredVerse={hoveredVerse}
                      onVerseHover={setHoveredVerse}
                      focusMode={focusMode}
                      showControls={true}
                      showBookChapterSelectors={true}
                      fontSize={fontSize}
                      t={t}
                      testamentFilter={rightTestamentFilter}
                      onTestamentFilterChange={setRightTestamentFilterAndAdjust}
                    />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          ) : (
            <>
              <div
                className={cn(
                  "transition-all duration-300 min-w-0",
                  rightVersion !== null && "w-full"
                )}
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
                  onTestamentFilterChange={
                    !syncMode ? setLeftTestamentFilterAndAdjust : undefined
                  }
                />
              </div>
              {rightVersion !== null && (
                <div
                  className={cn(
                    "transition-all duration-300 min-w-0",
                    isIndependentTwoPanels && "w-full md:w-[var(--read-right-width)]"
                  )}
                  style={
                    isIndependentTwoPanels
                      ? { ["--read-right-width" as string]: `${100 - 50}%` }
                      : { width: "50%" }
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
                    onTestamentFilterChange={
                      !syncMode ? setRightTestamentFilterAndAdjust : undefined
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Insights: full panel (bottom) */}
        {insightOpen && !focusMode && !insightMinimized && (
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
                        setInsightOpen(false);
                        setInsightMinimized(false);
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
        {insightOpen && !focusMode && insightMinimized && (
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
      </div>
    </main>
  );
}
