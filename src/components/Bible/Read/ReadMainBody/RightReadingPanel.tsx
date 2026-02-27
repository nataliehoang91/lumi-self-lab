"use client";

import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "../ReadingPanel";

export function RightReadingPanel() {
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
