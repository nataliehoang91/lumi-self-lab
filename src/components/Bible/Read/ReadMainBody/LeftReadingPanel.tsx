"use client";

import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "../ReadingPanel";

export function LeftReadingPanel() {
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
