"use client";

import { useRead } from "../context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { SyncedVerseList } from "../SyncedVerseList";

export function SyncedRead() {
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

  if (rightVersion === null) return null;

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
