"use client";

import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRead } from "./ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "./ReadingPanel";

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
  } = useRead();

  const isIndependentTwoPanels = rightVersion !== null && !syncMode;

  return (
    <main className={cn("transition-all duration-300", focusMode ? "py-8" : "py-6")}>
      <div className={cn("mx-auto", focusMode ? "max-w-6xl px-6" : "max-w-7xl px-4 sm:px-6")}>
        <div
          className={cn(
            "flex gap-0 relative",
            isIndependentTwoPanels && "flex-col md:flex-row"
          )}
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
      </div>
    </main>
  );
}
