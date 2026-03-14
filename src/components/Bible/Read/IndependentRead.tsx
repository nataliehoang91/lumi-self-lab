"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { EnhancedReadingPanel } from "./EnhancedReadingPanel/EnhancedReadingPanel";
import { ReadScrollNav } from "./ReadScrollNav";

function IndependentReadPanel({
  side,
  scrollContainerRef,
}: {
  side: "left" | "right";
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
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
    highlightedVerses,
    highlightedVersesRight,
    toggleVerseHighlight,
    toggleRightVerseHighlight,
    focusMode,
    leftTestamentFilter,
    rightTestamentFilter,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
    readFontSize,
    readFontFace,
  } = useRead();

  const version = side === "left" ? leftVersion : rightVersion;
  const book = side === "left" ? leftBook : rightBook;
  const chapter = side === "left" ? leftChapter : rightChapter;
  const content = side === "left" ? leftContent : rightContent;
  const loading = side === "left" ? loadingLeft : loadingRight;
  const testamentFilter = side === "left" ? leftTestamentFilter : rightTestamentFilter;
  const onBookChange = side === "left" ? handleLeftBookChange : handleRightBookChange;
  const onChapterChange =
    side === "left" ? handleLeftChapterChange : handleRightChapterChange;
  const onTestamentFilterChange =
    side === "left" ? setLeftTestamentFilterAndAdjust : setRightTestamentFilterAndAdjust;

  const highlightedVersesProp =
    side === "left" ? highlightedVerses : highlightedVersesRight;
  const onVerseClick = side === "left" ? toggleVerseHighlight : toggleRightVerseHighlight;

  return (
    <>
      <EnhancedReadingPanel
        side={side}
        version={version}
        book={book}
        chapter={chapter}
        onBookChange={onBookChange}
        onChapterChange={onChapterChange}
        content={content}
        loading={loading}
        books={books}
        hoveredVerse={hoveredVerse}
        onVerseHover={setHoveredVerse}
        highlightedVerses={highlightedVersesProp}
        onVerseNumberClick={onVerseClick}
        focusMode={focusMode}
        showControls
        showBookChapterSelectors
        fontSize={fontSize}
        readFontSize={readFontSize}
        readFontFace={readFontFace}
        t={t}
        testamentFilter={testamentFilter}
        onTestamentFilterChange={onTestamentFilterChange}
      />
      <div className="pb-6" aria-hidden />
      <div
        className="border-border/60 bg-read sticky bottom-0 z-20 flex justify-center
          border-t pt-3 pb-1.5 dark:bg-[#050408]"
      >
        <ReadScrollNav
          variant="panel"
          side={side}
          scrollContainerRef={scrollContainerRef}
        />
      </div>
    </>
  );
}

export function IndependentRead() {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-0 w-full flex-col md:h-[calc(100vh-12rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn("min-h-0 w-full flex-1 overflow-hidden", "flex-col md:flex-row")}
      >
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="min-h-0 min-w-0 overflow-hidden"
        >
          <div ref={leftScrollRef} className="h-full min-h-0 overflow-auto">
            <IndependentReadPanel side="left" scrollContainerRef={leftScrollRef} />
          </div>
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className="bg-primary data-resize-handle-active:bg-primary"
        />
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="min-h-0 min-w-0 overflow-hidden"
        >
          <div ref={rightScrollRef} className="h-full min-h-0 overflow-auto">
            <IndependentReadPanel side="right" scrollContainerRef={rightScrollRef} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
