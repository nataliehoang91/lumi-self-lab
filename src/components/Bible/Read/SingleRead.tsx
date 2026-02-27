"use client";

import { cn } from "@/lib/utils";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { EnhancedReadingPanel } from "./EnhancedReadingPanel/EnhancedReadingPanel";

export function SingleRead() {
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

  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  const leftVersionValue = leftVersion;
  const rightVersionValue = rightVersion;

  const leftTestamentValue = syncMode ? testamentFilter : leftTestamentFilter;
  const rightTestamentValue = syncMode ? testamentFilter : rightTestamentFilter;

  const showLeftControls = !syncMode || rightVersionValue === null;
  const showRightControls = !syncMode;

  const showLeftSelectors = rightVersionValue !== null && !syncMode;
  const showRightSelectors = !syncMode;

  return (
    <>
      <div className={cn("transition-all duration-300 min-w-0", rightVersionValue !== null && "w-full")}>
        <EnhancedReadingPanel
          side="left"
          version={leftVersionValue}
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
          showControls={showLeftControls}
          showBookChapterSelectors={showLeftSelectors}
          fontSize={fontSize}
          t={t}
          testamentFilter={leftTestamentValue}
          onTestamentFilterChange={!syncMode ? setLeftTestamentFilterAndAdjust : undefined}
        />
      </div>
      {rightVersionValue !== null && (
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
          <EnhancedReadingPanel
            side="right"
            version={rightVersionValue}
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
            showControls={showRightControls}
            showBookChapterSelectors={showRightSelectors}
            fontSize={fontSize}
            t={t}
            testamentFilter={rightTestamentValue}
            onTestamentFilterChange={!syncMode ? setRightTestamentFilterAndAdjust : undefined}
          />
        </div>
      )}
    </>
  );
}
