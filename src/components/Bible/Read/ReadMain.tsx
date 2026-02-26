"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useRead } from "./ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "./ReadingPanel";
import { SyncedVerseList } from "./SyncedVerseList";
import { getInsightsForChapter } from "@/app/actions/bible/insights";
import { BibleLoader } from "./BibleLoader";
import { ReadInsights } from "./ReadInsights";

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
    insightOpen,
    setInsightOpen,
  } = useRead();

  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  const [showBibleLoader, setShowBibleLoader] = useState(false);

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
  const [insightCache, setInsightCache] = useState<
    Record<
      string,
      {
        db: { context: string | null; explanation: string | null; reflections: string[] } | null;
        ai: { context: string | null; explanation: string | null; reflections: string[] } | null;
      }
    >
  >({});

  useEffect(() => {
    if (!insightOpen || !leftBook) return;

    const cacheKey = `${leftBook.id}:${leftChapter}:${globalLanguage}`;
    const cached = insightCache[cacheKey];

    // Use cached insights if available to avoid refetch and repeated loading
    if (cached) {
      // Defer state updates to avoid synchronous setState inside effect body
      setTimeout(() => {
        setInsightFromDb(cached.db);
        setInsightFromAi(cached.ai);
        setLoadingInsight(false);
      }, 0);
      return;
    }

    let cancelled = false;
    const tid = setTimeout(() => {
      if (!cancelled) setLoadingInsight(true);
    }, 0);

    getInsightsForChapter(leftBook.id, leftChapter, globalLanguage)
      .then(({ db, ai }) => {
        if (cancelled) return;
        const dbValue = db
          ? { context: db.context, explanation: db.explanation, reflections: db.reflections }
          : null;
        const aiValue = ai
          ? { context: ai.context, explanation: ai.explanation, reflections: ai.reflections }
          : null;

        setInsightFromDb(dbValue);
        setInsightFromAi(aiValue);

        setInsightCache((prev) => ({
          ...prev,
          [cacheKey]: { db: dbValue, ai: aiValue },
        }));
      })
      .finally(() => {
        if (!cancelled) setLoadingInsight(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(tid);
    };
  }, [insightOpen, leftBook, leftChapter, globalLanguage, insightCache]);

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

  let mainBody: JSX.Element;
  if (!leftVersion && !rightVersion) {
    mainBody = <EmptyReadState />;
  } else if (syncMode && rightVersion !== null && !focusMode) {
    mainBody = <SyncedRead />;
  } else if (rightVersion !== null && !focusMode) {
    mainBody = <IndependentRead />;
  } else {
    mainBody = <SingleRead />;
  }

  return (
    <main className={cn("transition-all duration-300", focusMode ? "py-8" : "py-6")}>
      <div className={cn("mx-auto", focusMode ? "max-w-6xl px-6" : "max-w-7xl px-4 sm:px-6")}>
        <div
          className={cn("flex gap-0 relative", isIndependentTwoPanels && "flex-col md:flex-row")}
        >
          {mainBody}
        </div>

        {/* Full-screen loader for any book/chapter load */}
        {showBibleLoader && (
          <BibleLoader
            onComplete={() => {
              setShowBibleLoader(false);
            }}
          />
        )}

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
      </div>
    </main>
  );
}

function EmptyReadState() {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  return (
    <div className="flex-1 flex items-center justify-center py-16">
      <div className="text-center text-muted-foreground space-y-2">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border">
          <span className="text-lg">📖</span>
        </div>
        <p className="text-sm font-medium">
          {t("readEmptyStateTitle") ?? "Select a translation above"}
        </p>
        <p className="text-xs">
          {t("readEmptyStateSubtitle") ?? "Choose one or two versions to compare."}
        </p>
      </div>
    </div>
  );
}

function SyncedRead() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftContent,
    rightContent,
    leftVersion,
    rightVersion,
    loadingLeft,
    loadingRight,
    focusMode,
    hoveredVerse,
    setHoveredVerse,
  } = useRead();
  return (
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
  );
}

function IndependentRead() {
  return (
    <div className="w-full min-h-0 flex flex-col md:h-[calc(100vh-12rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn("flex-1 min-h-0 w-full overflow-hidden", "flex-col md:flex-row")}
      >
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="min-w-0 min-h-0 overflow-hidden"
        >
          <div className="h-full min-h-0 overflow-auto">
            <LeftReadingPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-primary data-resize-handle-active:bg-primary" />
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="min-w-0 min-h-0 overflow-hidden"
        >
          <div className="h-full min-h-0 overflow-auto">
            <RightReadingPanel />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function SingleRead() {
  const { rightVersion, syncMode } = useRead();
  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  return (
    <>
      <div className={cn("transition-all duration-300 min-w-0", rightVersion !== null && "w-full")}>
        <SingleReadingPanel side="left" />
      </div>
      {rightVersion !== null && (
        <div
          className={cn(
            "transition-all duration-300 min-w-0",
            isIndependentTwoPanels && "w-full md:w-(--read-right-width)"
          )}
          style={
            isIndependentTwoPanels
              ? { ["--read-right-width" as string]: `${100 - 50}%` }
              : { width: "50%" }
          }
        >
          <SingleReadingPanel side="right" />
        </div>
      )}
    </>
  );
}

function LeftReadingPanel() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftVersion,
    leftBook,
    leftChapter,
    leftContent,
    loadingLeft,
    books,
    hoveredVerse,
    setHoveredVerse,
    focusMode,
    leftTestamentFilter,
    handleLeftBookChange,
    handleLeftChapterChange,
    setLeftTestamentFilterAndAdjust,
  } = useRead();

  return (
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
      showControls
      showBookChapterSelectors
      fontSize={fontSize}
      t={t}
      testamentFilter={leftTestamentFilter}
      onTestamentFilterChange={setLeftTestamentFilterAndAdjust}
    />
  );
}

function RightReadingPanel() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    rightVersion,
    rightBook,
    rightChapter,
    rightContent,
    loadingRight,
    books,
    hoveredVerse,
    setHoveredVerse,
    focusMode,
    rightTestamentFilter,
    handleRightBookChange,
    handleRightChapterChange,
    setRightTestamentFilterAndAdjust,
  } = useRead();

  return (
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
      showControls
      showBookChapterSelectors
      fontSize={fontSize}
      t={t}
      testamentFilter={rightTestamentFilter}
      onTestamentFilterChange={setRightTestamentFilterAndAdjust}
    />
  );
}

function SingleReadingPanel({ side }: { side: "left" | "right" }) {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftVersion,
    rightVersion,
    leftBook,
    rightBook,
    leftChapter,
    rightChapter,
    leftContent,
    rightContent,
    loadingLeft,
    loadingRight,
    books,
    hoveredVerse,
    setHoveredVerse,
    focusMode,
    syncMode,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
  } = useRead();

  const isLeft = side === "left";

  const version = isLeft ? leftVersion : rightVersion;
  const book = isLeft ? leftBook : syncMode ? leftBook : rightBook;
  const chapter = isLeft ? leftChapter : syncMode ? leftChapter : rightChapter;
  const content = isLeft ? leftContent : rightContent;
  const loading = isLeft ? loadingLeft : loadingRight;

  const showControls =
    isLeft && (!syncMode || rightVersion === null) ? true : !isLeft ? !syncMode : false;

  const showSelectors =
    isLeft && rightVersion !== null && !syncMode ? true : !isLeft ? !syncMode : false;

  const testament =
    isLeft && syncMode
      ? testamentFilter
      : isLeft
        ? leftTestamentFilter
        : syncMode
          ? testamentFilter
          : rightTestamentFilter;

  const handleBookChange = isLeft ? handleLeftBookChange : handleRightBookChange;
  const handleChapterChange = isLeft ? handleLeftChapterChange : handleRightChapterChange;

  const handleTestamentChange = isLeft
    ? !syncMode
      ? setLeftTestamentFilterAndAdjust
      : undefined
    : !syncMode
      ? setRightTestamentFilterAndAdjust
      : undefined;

  return (
    <ReadingPanel
      version={version}
      book={book}
      chapter={chapter}
      onBookChange={handleBookChange}
      onChapterChange={handleChapterChange}
      content={content}
      loading={loading}
      books={books}
      hoveredVerse={hoveredVerse}
      onVerseHover={setHoveredVerse}
      focusMode={focusMode}
      showControls={showControls}
      showBookChapterSelectors={showSelectors}
      fontSize={fontSize}
      t={t}
      testamentFilter={testament}
      onTestamentFilterChange={handleTestamentChange}
    />
  );
}
