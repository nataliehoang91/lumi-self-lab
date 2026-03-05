"use client";

import type { ReadingPanelProps } from "../types";
import { EmptyReadState } from "./EmptyReadState";
import { ReadingPanelControlHeader } from "./ControlHeader";
import { ReadingPanelContent } from "./Content";

/**
 * Reading panel composed of:
 * 1. ControlHeader — uses useRead() / useBibleApp(), only needs side
 * 2. Content — verse list or empty state
 */
export function EnhancedReadingPanel(props: ReadingPanelProps) {
  const {
    side,
    version,
    content,
    hoveredVerse,
    onVerseHover,
    highlightedVerse,
    highlightedVerses,
    onVerseNumberClick,
    focusMode,
    fontSize,
    t,
  } = props;

  const scrollTarget =
    (highlightedVerses && highlightedVerses[0]) ?? highlightedVerse ?? null;
  const versesToHighlight = highlightedVerses ?? (highlightedVerse != null ? [highlightedVerse] : []);

  if (!version) {
    return (
      <div className="px-4 sm:px-6 md:px-8">
        <ReadingPanelControlHeader side={side} />
        <EmptyReadState />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      <ReadingPanelControlHeader side={side} />
      <ReadingPanelContent
        version={version}
        content={content}
        focusMode={focusMode}
        fontSize={fontSize}
        hoveredVerse={hoveredVerse}
        onVerseHover={onVerseHover}
        targetVerse={scrollTarget}
        highlightedVerses={versesToHighlight}
        onVerseNumberClick={onVerseNumberClick}
        t={t}
      />
    </div>
  );
}
