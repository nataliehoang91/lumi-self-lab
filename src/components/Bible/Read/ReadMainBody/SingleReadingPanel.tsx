"use client";

import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { ReadingPanel } from "../ReadingPanel";

export function SingleReadingPanel({ side }: { side: "left" | "right" }) {
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
