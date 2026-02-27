"use client";

import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { EnhancedReadingPanel } from "./EnhancedReadingPanel/EnhancedReadingPanel";

function IndependentReadPanel({ side }: { side: "left" | "right" }) {
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
    leftTestamentFilter,
    rightTestamentFilter,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
  } = useRead();

  const version = side === "left" ? leftVersion : rightVersion;
  const book = side === "left" ? leftBook : rightBook;
  const chapter = side === "left" ? leftChapter : rightChapter;
  const content = side === "left" ? leftContent : rightContent;
  const loading = side === "left" ? loadingLeft : loadingRight;
  const testamentFilter = side === "left" ? leftTestamentFilter : rightTestamentFilter;
  const onBookChange = side === "left" ? handleLeftBookChange : handleRightBookChange;
  const onChapterChange = side === "left" ? handleLeftChapterChange : handleRightChapterChange;
  const onTestamentFilterChange =
    side === "left" ? setLeftTestamentFilterAndAdjust : setRightTestamentFilterAndAdjust;

  return (
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
      focusMode={focusMode}
      showControls
      showBookChapterSelectors
      fontSize={fontSize}
      t={t}
      testamentFilter={testamentFilter}
      onTestamentFilterChange={onTestamentFilterChange}
    />
  );
}

export function IndependentRead() {
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
            <IndependentReadPanel side="left" />
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
            <IndependentReadPanel side="right" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
