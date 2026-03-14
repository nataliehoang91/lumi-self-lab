import type { VersionId } from "./constants";
import type { TestamentFilter } from "./constants";
import type { FontSize } from "@/components/Bible/BibleAppContext";
import type { ReadFontSize } from "./readTextConstants";

export interface BibleBook {
  id: string;
  nameEn: string;
  nameVi: string;
  nameZh: string | null;
  order: number;
  chapterCount: number;
}

export interface VerseRow {
  number: number;
  text: string;
}

export interface ChapterContent {
  book: BibleBook;
  chapter: number;
  verses: VerseRow[];
  /** Optional chapter/section heading (e.g. "The Sermon on the Mount"). */
  sectionTitle?: string | null;
}

export type TFunction = (key: string, params?: Record<string, number | string>) => string;

export interface ReadingPanelProps {
  side: "left" | "right";
  version: VersionId | null;
  book: BibleBook | null;
  chapter: number;
  onBookChange: (book: BibleBook) => void;
  onChapterChange: (chapter: number) => void;
  content: ChapterContent | null;
  loading: boolean;
  books: BibleBook[];
  hoveredVerse: number | null;
  onVerseHover: (verse: number | null) => void;
  /** Single verse for backward compat; prefer highlightedVerses for multiple. */
  highlightedVerse?: number | null;
  /** Multiple verse numbers to highlight (e.g. [3, 5, 7]). */
  highlightedVerses?: number[];
  onVerseNumberClick?: (verse: number) => void;
  focusMode: boolean;
  showControls: boolean;
  showBookChapterSelectors: boolean;
  fontSize: FontSize;
  /** Read-page-only: overrides fontSize for verse text when set. */
  readFontSize?: ReadFontSize;
  /** Read-page-only: font face id for verse text (language-specific sets). */
  readFontFace?: string;
  t: TFunction;
  testamentFilter: TestamentFilter;
  onTestamentFilterChange?: (filter: TestamentFilter) => void;
}
