import type { VersionId } from "./constants";
import type { TestamentFilter } from "./constants";
import type { FontSize } from "@/components/Bible/BibleAppContext";

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
}

export type TFunction = (
  key: string,
  params?: Record<string, number | string>
) => string;

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
  focusMode: boolean;
  showControls: boolean;
  showBookChapterSelectors: boolean;
  fontSize: FontSize;
  t: TFunction;
  testamentFilter: TestamentFilter;
  onTestamentFilterChange?: (filter: TestamentFilter) => void;
}
