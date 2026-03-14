/**
 * Reducer for Read context state. Keeps transitions in one place and avoids
 * scattered setState calls and dependency-array bugs.
 */

import type { BibleBook } from "../types";
import type { ChapterContent } from "../types";
import type { VersionId } from "../constants";
import type { TestamentFilter } from "../constants";
import type { ReadFontSize } from "../readTextConstants";
import { getOtBooks, getNtBooks } from "../utils";

export interface ReadState {
  books: BibleBook[];
  leftVersion: VersionId | null;
  rightVersion: VersionId | null;
  syncMode: boolean;
  focusMode: boolean;
  leftBook: BibleBook | null;
  leftChapter: number;
  rightBook: BibleBook | null;
  rightChapter: number;
  leftContent: ChapterContent | null;
  rightContent: ChapterContent | null;
  loadingLeft: boolean;
  loadingRight: boolean;
  hoveredVerse: number | null;
  verse1: number | null;
  verse2: number | null;
  verseEnd: number | null;
  highlightedVerses: number[];
  highlightedVersesRight: number[];
  panelWidth: number;
  isDragging: boolean;
  subNavBookOpen: boolean;
  subNavChapterOpen: boolean;
  testamentFilter: TestamentFilter;
  leftTestamentFilter: TestamentFilter;
  rightTestamentFilter: TestamentFilter;
  insightOpen: boolean;
  insightMinimized: boolean;
  readFontSize: ReadFontSize;
  readFontFace: string;
}

type ReadAction =
  | { type: "SET_BOOKS"; payload: BibleBook[] }
  | { type: "SYNC_FROM_URL"; payload: SyncFromUrlPayload }
  | { type: "SYNC_FROM_URL_EMPTY"; payload: { sync: boolean; focus: boolean } }
  | {
      type: "SYNC_FROM_URL_PARTIAL";
      payload: {
        leftVersion: VersionId | null;
        rightVersion: VersionId | null;
        sync: boolean;
        focus: boolean;
        insightOpen: boolean;
        verse1: number | null;
        verse2: number | null;
        verseEnd: number | null;
        verses: number[];
      };
    }
  | { type: "SET_LEFT_VERSION"; payload: VersionId | null }
  | { type: "SET_RIGHT_VERSION"; payload: VersionId | null }
  | { type: "SET_SYNC_MODE"; payload: boolean }
  | { type: "SET_FOCUS_MODE"; payload: boolean }
  | { type: "SET_LEFT_BOOK"; payload: BibleBook }
  | { type: "SET_LEFT_CHAPTER"; payload: number }
  | { type: "SET_RIGHT_BOOK"; payload: BibleBook }
  | { type: "SET_RIGHT_CHAPTER"; payload: number }
  | { type: "SET_LEFT_CONTENT"; payload: ChapterContent | null }
  | { type: "SET_RIGHT_CONTENT"; payload: ChapterContent | null }
  | { type: "SET_LOADING_LEFT"; payload: boolean }
  | { type: "SET_LOADING_RIGHT"; payload: boolean }
  | { type: "SET_HOVERED_VERSE"; payload: number | null }
  | { type: "SET_VERSE1"; payload: number | null }
  | { type: "SET_VERSE2"; payload: number | null }
  | { type: "SET_VERSE_END"; payload: number | null }
  | { type: "SET_HIGHLIGHTED_VERSES"; payload: number[] }
  | { type: "SET_HIGHLIGHTED_VERSES_RIGHT"; payload: number[] }
  | { type: "TOGGLE_VERSE_HIGHLIGHT"; payload: number }
  | { type: "TOGGLE_RIGHT_VERSE_HIGHLIGHT"; payload: number }
  | { type: "CLEAR_VERSE_HIGHLIGHTS" }
  | { type: "CLEAR_VERSE_HIGHLIGHTS_ON_PATHNAME" }
  | { type: "SET_PANEL_WIDTH"; payload: number }
  | { type: "SET_IS_DRAGGING"; payload: boolean }
  | { type: "SET_SUB_NAV_BOOK_OPEN"; payload: boolean }
  | { type: "SET_SUB_NAV_CHAPTER_OPEN"; payload: boolean }
  | { type: "SET_TESTAMENT_FILTER"; payload: TestamentFilter }
  | { type: "SET_LEFT_TESTAMENT_FILTER"; payload: TestamentFilter }
  | { type: "SET_RIGHT_TESTAMENT_FILTER"; payload: TestamentFilter }
  | { type: "SET_INSIGHT_OPEN"; payload: boolean }
  | { type: "SET_INSIGHT_MINIMIZED"; payload: boolean }
  | { type: "SET_READ_FONT_SIZE"; payload: ReadFontSize }
  | { type: "SET_READ_FONT_FACE"; payload: string }
  | { type: "LEFT_BOOK_CHAPTER"; payload: { book: BibleBook; chapter: number; syncMode: boolean } }
  | { type: "RIGHT_BOOK_CHAPTER"; payload: { book: BibleBook; chapter: number } }
  | {
      type: "TESTAMENT_AND_ADJUST";
      payload: { filter: TestamentFilter; syncMode: boolean };
    }
  | {
      type: "LEFT_TESTAMENT_AND_ADJUST";
      payload: TestamentFilter;
    }
  | {
      type: "RIGHT_TESTAMENT_AND_ADJUST";
      payload: TestamentFilter;
    }
  | { type: "VERSION_CHIP_CLICK"; payload: VersionId };

export interface SyncFromUrlPayload {
  leftVersion: VersionId | null;
  rightVersion: VersionId | null;
  sync: boolean;
  focus: boolean;
  leftBook: BibleBook;
  leftChapter: number;
  rightBook: BibleBook;
  rightChapter: number;
  testamentFilter: TestamentFilter;
  leftTestamentFilter: TestamentFilter;
  rightTestamentFilter: TestamentFilter;
  insightOpen: boolean;
  verse1: number | null;
  verse2: number | null;
  verseEnd: number | null;
  verses: number[];
}

const defaultState: ReadState = {
  books: [],
  leftVersion: null,
  rightVersion: null,
  syncMode: true,
  focusMode: false,
  leftBook: null,
  leftChapter: 1,
  rightBook: null,
  rightChapter: 1,
  leftContent: null,
  rightContent: null,
  loadingLeft: false,
  loadingRight: false,
  hoveredVerse: null,
  verse1: null,
  verse2: null,
  verseEnd: null,
  highlightedVerses: [],
  highlightedVersesRight: [],
  panelWidth: 50,
  isDragging: false,
  subNavBookOpen: false,
  subNavChapterOpen: false,
  testamentFilter: "ot",
  leftTestamentFilter: "ot",
  rightTestamentFilter: "ot",
  insightOpen: false,
  insightMinimized: false,
  readFontSize: "M",
  readFontFace: "",
};

function applyVerseHighlight(
  prev: number[],
  verseNumber: number
): { next: number[]; verse1: number | null; verseEnd: number | null } {
  const num = Number(verseNumber);
  if (!Number.isFinite(num) || num < 1)
    return { next: prev, verse1: null, verseEnd: null };
  const next = prev.includes(num)
    ? prev.filter((n) => n !== num)
    : [...prev, num].sort((a, b) => a - b);
  const verse1 = next.length === 0 ? null : (next[0] ?? null);
  const last = next[next.length - 1];
  const verseEnd =
    next.length > 1 && last !== undefined && next[0] !== undefined && last > next[0]
      ? last
      : null;
  return { next, verse1, verseEnd };
}

export function readReducer(state: ReadState, action: ReadAction): ReadState {
  switch (action.type) {
    case "SET_BOOKS":
      return { ...state, books: action.payload };

    case "SYNC_FROM_URL": {
      const p = action.payload;
      return {
        ...state,
        leftVersion: p.leftVersion,
        rightVersion: p.rightVersion,
        syncMode: p.sync,
        focusMode: p.focus,
        leftBook: p.leftBook,
        leftChapter: p.leftChapter,
        rightBook: p.rightBook,
        rightChapter: p.rightChapter,
        testamentFilter: p.testamentFilter,
        leftTestamentFilter: p.leftTestamentFilter,
        rightTestamentFilter: p.rightTestamentFilter,
        insightOpen: p.insightOpen,
        verse1: p.verse1,
        verse2: p.verse2,
        verseEnd: p.verseEnd,
        highlightedVerses: p.verses,
      };
    }

    case "SYNC_FROM_URL_EMPTY":
      return {
        ...state,
        leftVersion: null,
        rightVersion: null,
        syncMode: action.payload.sync,
        focusMode: action.payload.focus,
        insightOpen: false,
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };

    case "SYNC_FROM_URL_PARTIAL": {
      const p = action.payload;
      return {
        ...state,
        leftVersion: p.leftVersion,
        rightVersion: p.rightVersion,
        syncMode: p.sync,
        focusMode: p.focus,
        insightOpen: p.insightOpen,
        verse1: p.verse1,
        verse2: p.verse2,
        verseEnd: p.verseEnd,
        highlightedVerses: p.verses,
      };
    }

    case "SET_LEFT_VERSION":
      return { ...state, leftVersion: action.payload };
    case "SET_RIGHT_VERSION":
      return { ...state, rightVersion: action.payload };
    case "SET_SYNC_MODE":
      return { ...state, syncMode: action.payload };
    case "SET_FOCUS_MODE":
      return { ...state, focusMode: action.payload };
    case "SET_LEFT_BOOK":
      return { ...state, leftBook: action.payload };
    case "SET_LEFT_CHAPTER":
      return { ...state, leftChapter: action.payload };
    case "SET_RIGHT_BOOK":
      return { ...state, rightBook: action.payload };
    case "SET_RIGHT_CHAPTER":
      return { ...state, rightChapter: action.payload };
    case "SET_LEFT_CONTENT":
      return { ...state, leftContent: action.payload };
    case "SET_RIGHT_CONTENT":
      return { ...state, rightContent: action.payload };
    case "SET_LOADING_LEFT":
      return { ...state, loadingLeft: action.payload };
    case "SET_LOADING_RIGHT":
      return { ...state, loadingRight: action.payload };
    case "SET_HOVERED_VERSE":
      return { ...state, hoveredVerse: action.payload };
    case "SET_VERSE1":
      return { ...state, verse1: action.payload };
    case "SET_VERSE2":
      return { ...state, verse2: action.payload };
    case "SET_VERSE_END":
      return { ...state, verseEnd: action.payload };
    case "SET_HIGHLIGHTED_VERSES":
      return { ...state, highlightedVerses: action.payload };
    case "SET_HIGHLIGHTED_VERSES_RIGHT":
      return { ...state, highlightedVersesRight: action.payload };
    case "SET_PANEL_WIDTH":
      return { ...state, panelWidth: action.payload };
    case "SET_IS_DRAGGING":
      return { ...state, isDragging: action.payload };
    case "SET_SUB_NAV_BOOK_OPEN":
      return { ...state, subNavBookOpen: action.payload };
    case "SET_SUB_NAV_CHAPTER_OPEN":
      return { ...state, subNavChapterOpen: action.payload };
    case "SET_TESTAMENT_FILTER":
      return { ...state, testamentFilter: action.payload };
    case "SET_LEFT_TESTAMENT_FILTER":
      return { ...state, leftTestamentFilter: action.payload };
    case "SET_RIGHT_TESTAMENT_FILTER":
      return { ...state, rightTestamentFilter: action.payload };
    case "SET_INSIGHT_OPEN":
      return { ...state, insightOpen: action.payload };
    case "SET_INSIGHT_MINIMIZED":
      return { ...state, insightMinimized: action.payload };
    case "SET_READ_FONT_SIZE":
      return { ...state, readFontSize: action.payload };
    case "SET_READ_FONT_FACE":
      return { ...state, readFontFace: action.payload };

    case "TOGGLE_VERSE_HIGHLIGHT": {
      const { next, verse1: v1, verseEnd: ve } = applyVerseHighlight(
        state.highlightedVerses,
        action.payload
      );
      return {
        ...state,
        highlightedVerses: next,
        verse1: v1,
        verseEnd: ve,
      };
    }

    case "TOGGLE_RIGHT_VERSE_HIGHLIGHT": {
      const num = Number(action.payload);
      if (!Number.isFinite(num) || num < 1) return state;
      const next = state.highlightedVersesRight.includes(num)
        ? state.highlightedVersesRight.filter((n) => n !== num)
        : [...state.highlightedVersesRight, num].sort((a, b) => a - b);
      return { ...state, highlightedVersesRight: next };
    }

    case "CLEAR_VERSE_HIGHLIGHTS":
      return {
        ...state,
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };

    case "CLEAR_VERSE_HIGHLIGHTS_ON_PATHNAME":
      return {
        ...state,
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };

    case "LEFT_BOOK_CHAPTER": {
      const { book, chapter, syncMode } = action.payload;
      return {
        ...state,
        leftBook: book,
        leftChapter: chapter,
        ...(syncMode
          ? { rightBook: book, rightChapter: chapter }
          : {}),
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };
    }

    case "RIGHT_BOOK_CHAPTER": {
      const { book, chapter } = action.payload;
      return {
        ...state,
        rightBook: book,
        rightChapter: chapter,
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };
    }

    case "TESTAMENT_AND_ADJUST": {
      const { filter, syncMode } = action.payload;
      const otBooks = getOtBooks(state.books);
      const ntBooks = getNtBooks(state.books);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return { ...state, testamentFilter: filter };
      const currentInList =
        state.leftBook && list.some((b) => b.id === state.leftBook!.id);
      const first = list[0]!;
      return {
        ...state,
        testamentFilter: filter,
        ...(currentInList
          ? {}
          : {
              leftBook: first,
              leftChapter: 1,
              ...(syncMode ? { rightBook: first, rightChapter: 1 } : {}),
            }),
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };
    }

    case "LEFT_TESTAMENT_AND_ADJUST": {
      const filter = action.payload;
      const otBooks = getOtBooks(state.books);
      const ntBooks = getNtBooks(state.books);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return { ...state, leftTestamentFilter: filter };
      const currentInList =
        state.leftBook && list.some((b) => b.id === state.leftBook!.id);
      const first = list[0]!;
      return {
        ...state,
        leftTestamentFilter: filter,
        ...(currentInList ? {} : { leftBook: first, leftChapter: 1 }),
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };
    }

    case "RIGHT_TESTAMENT_AND_ADJUST": {
      const filter = action.payload;
      const otBooks = getOtBooks(state.books);
      const ntBooks = getNtBooks(state.books);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return { ...state, rightTestamentFilter: filter };
      const currentInList =
        state.rightBook && list.some((b) => b.id === state.rightBook!.id);
      const first = list[0]!;
      return {
        ...state,
        rightTestamentFilter: filter,
        ...(currentInList ? {} : { rightBook: first, rightChapter: 1 }),
        verse1: null,
        verse2: null,
        verseEnd: null,
        highlightedVerses: [],
        highlightedVersesRight: [],
      };
    }

    case "VERSION_CHIP_CLICK": {
      const transId = action.payload;
      const isLeft = state.leftVersion === transId;
      const isRight = state.rightVersion === transId;
      if (isLeft) {
        return {
          ...state,
          leftVersion: state.rightVersion,
          rightVersion: null,
        };
      }
      if (isRight) {
        return { ...state, rightVersion: null };
      }
      if (state.leftVersion === null && state.rightVersion === null) {
        return { ...state, leftVersion: transId };
      }
      // Adding second version: start synced (sync=true) so both panels show same passage; user can unsync after.
      if (state.rightVersion === null) {
        return {
          ...state,
          rightVersion: transId,
          syncMode: true,
          rightBook: state.leftBook,
          rightChapter: state.leftChapter,
          testamentFilter: state.leftTestamentFilter,
          rightTestamentFilter: state.leftTestamentFilter,
        };
      }
      return { ...state, rightVersion: transId };
    }

    default:
      return state;
  }
}

export interface ReadParsedForInit {
  version1: VersionId | null;
  version2: VersionId | null;
  sync: boolean;
  book1Id: string | null;
  chapter1: number;
  testament1: TestamentFilter;
  book2Id: string | null;
  chapter2: number;
  testament2: TestamentFilter;
  insights: boolean;
  focus: boolean;
  verse1: number | null;
  verse2: number | null;
  verseEnd: number | null;
  verses: number[];
}

export function getInitialReadState(
  books: BibleBook[],
  parsed: ReadParsedForInit,
  resolveBook: (books: BibleBook[], bookId: string | null, testament: TestamentFilter) => BibleBook,
  clampChapter: (chapter: number, book: BibleBook | null) => number
): ReadState {
  if (books.length === 0) {
    return { ...defaultState, books: [] };
  }
  const left = resolveBook(books, parsed.book1Id, parsed.testament1);
  const leftCh = clampChapter(parsed.chapter1, left);
  const hasRight = parsed.version2 && !parsed.sync;
  const right = hasRight
    ? resolveBook(books, parsed.book2Id, parsed.testament2)
    : left;
  const rightCh = hasRight ? clampChapter(parsed.chapter2, right) : leftCh;
  return {
    ...defaultState,
    books,
    leftVersion: parsed.version1,
    rightVersion: parsed.version2,
    syncMode: parsed.sync,
    focusMode: parsed.focus,
    leftBook: left,
    leftChapter: leftCh,
    rightBook: right,
    rightChapter: rightCh,
    testamentFilter: parsed.testament1,
    leftTestamentFilter: parsed.testament1,
    rightTestamentFilter: hasRight ? parsed.testament2 : parsed.testament1,
    insightOpen: parsed.insights,
    verse1: parsed.verse1,
    verse2: parsed.verse2,
    verseEnd: parsed.verseEnd,
    highlightedVerses: parsed.verses ?? [],
  };
}
