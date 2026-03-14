"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  parseReadSearchParams,
  buildReadSearchParams,
} from "@/app/(bible)/bible/[lang]/read/params";
import { getChapterContent } from "@/app/actions/bible/read";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import type { Language } from "@/components/Bible/BibleAppContext";
import type { BibleBook } from "../types";
import type { VersionId } from "../constants";
import type { TestamentFilter } from "../constants";
import { TRANSLATIONS } from "../constants";
import { getOtBooks, getNtBooks, resolveBookFromParams, clampChapter } from "../utils";
import type { ReadFontSize } from "../readTextConstants";
import {
  readReducer,
  getInitialReadState,
  type ReadState,
  type SyncFromUrlPayload,
} from "./readReducer";

const READ_TEXT_PREFS_KEY = "bible-read-text-prefs";

function readStoredReadTextPrefs(): { readFontSize: ReadFontSize; readFontFace: string } {
  if (typeof window === "undefined")
    return { readFontSize: "M", readFontFace: "" };
  try {
    const raw = window.localStorage.getItem(READ_TEXT_PREFS_KEY);
    if (!raw) return { readFontSize: "M", readFontFace: "" };
    const parsed = JSON.parse(raw) as Record<string, string>;
    const size = parsed.readFontSize;
    const validSize =
      size === "XS" || size === "S" || size === "M" || size === "L" || size === "XL" || size === "XXL"
        ? size
        : "M";
    return { readFontSize: validSize, readFontFace: typeof parsed.readFontFace === "string" ? parsed.readFontFace : "" };
  } catch {
    return { readFontSize: "M", readFontFace: "" };
  }
}

function writeStoredReadTextPrefs(readFontSize: ReadFontSize, readFontFace: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READ_TEXT_PREFS_KEY, JSON.stringify({ readFontSize, readFontFace }));
  } catch {
    // ignore
  }
}

interface ReadContextValue extends ReadState {
  setReadFontSize: (size: ReadFontSize) => void;
  setReadFontFace: (faceId: string) => void;
  setBooks: (books: BibleBook[]) => void;
  handleVersionChipClick: (transId: VersionId) => void;
  setSyncMode: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  handleLeftBookChange: (book: BibleBook) => void;
  handleLeftChapterChange: (chapter: number) => void;
  handleRightBookChange: (book: BibleBook) => void;
  handleRightChapterChange: (chapter: number) => void;
  setTestamentFilterAndAdjustBook: (filter: TestamentFilter) => void;
  setLeftTestamentFilterAndAdjust: (filter: TestamentFilter) => void;
  setRightTestamentFilterAndAdjust: (filter: TestamentFilter) => void;
  setHoveredVerse: (verse: number | null) => void;
  setVerse1: (verse: number | null) => void;
  setVerse2: (verse: number | null) => void;
  setVerseEnd: (verse: number | null) => void;
  setHighlightedVerses: (verses: number[] | ((prev: number[]) => number[])) => void;
  toggleVerseHighlight: (verseNumber: number) => void;
  setHighlightedVersesRight: (
    verses: number[] | ((prev: number[]) => number[])
  ) => void;
  toggleRightVerseHighlight: (verseNumber: number) => void;
  setPanelWidth: (v: number) => void;
  setIsDragging: (v: boolean) => void;
  setSubNavBookOpen: (v: boolean) => void;
  setSubNavChapterOpen: (v: boolean) => void;
  setInsightOpen: (v: boolean) => void;
  setInsightMinimized: (v: boolean) => void;
  otBooks: BibleBook[];
  ntBooks: BibleBook[];
  filteredBooks: BibleBook[];
}

const ReadContext = createContext<ReadContextValue | null>(null);

export function useRead() {
  const ctx = useContext(ReadContext);
  if (!ctx) throw new Error("useRead must be used within ReadProvider");
  return ctx;
}

/** Panel-specific derived state for left/right reading panel. Use in ControlHeader, Content, etc. */
export function useReadPanel(side: "left" | "right") {
  const ctx = useRead();
  const isLeft = side === "left";
  const {
    focusMode,
    syncMode,
    rightVersion,
    leftVersion,
    rightBook,
    leftBook,
    rightChapter,
    leftChapter,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
    handleLeftBookChange,
    handleRightBookChange,
    handleLeftChapterChange,
    handleRightChapterChange,
    books,
  } = ctx;

  const version = isLeft ? leftVersion : rightVersion;
  const book = isLeft ? leftBook : syncMode ? leftBook : rightBook;
  const chapter = isLeft ? leftChapter : syncMode ? leftChapter : rightChapter;
  const testamentFilterForPanel =
    isLeft && syncMode
      ? testamentFilter
      : isLeft
        ? leftTestamentFilter
        : syncMode
          ? testamentFilter
          : rightTestamentFilter;
  const onTestamentFilterChange = isLeft
    ? syncMode
      ? undefined
      : setLeftTestamentFilterAndAdjust
    : syncMode
      ? undefined
      : setRightTestamentFilterAndAdjust;
  const onBookChange = isLeft ? handleLeftBookChange : handleRightBookChange;
  const onChapterChange = isLeft ? handleLeftChapterChange : handleRightChapterChange;
  const showControls =
    isLeft && (!syncMode || rightVersion === null) ? true : !isLeft ? !syncMode : false;
  const showBookChapterSelectors =
    isLeft && rightVersion !== null && !syncMode ? true : !isLeft ? !syncMode : false;

  const versionName =
    version !== null
      ? (TRANSLATIONS.find((tr) => tr.id === version)?.fullName ?? version.toUpperCase())
      : "";
  const maxChapters = book?.chapterCount ?? 50;
  const panelOtBooks = getOtBooks(books);
  const panelNtBooks = getNtBooks(books);
  const panelFilteredBooks =
    testamentFilterForPanel === "ot" ? panelOtBooks : panelNtBooks;

  return {
    focusMode,
    version,
    book,
    chapter,
    testamentFilterForPanel,
    onTestamentFilterChange,
    onBookChange,
    onChapterChange,
    showControls,
    showBookChapterSelectors,
    versionName,
    maxChapters,
    panelFilteredBooks,
  };
}

function hasVersionInParams(params: Record<string, string | undefined>): boolean {
  return (params.version1 ?? params.v1 ?? "").trim() !== "";
}

/** Compare two query strings by params (order-independent) to avoid replaceState loops. */
function searchParamsEqual(a: string, b: string): boolean {
  const pa = new URLSearchParams(a.startsWith("?") ? a.slice(1) : a);
  const pb = new URLSearchParams(b.startsWith("?") ? b.slice(1) : b);
  if (pa.size !== pb.size) return false;
  for (const [k, v] of pa) if (pb.get(k) !== v) return false;
  return true;
}

export function ReadProvider({
  children,
  initialBooks = [],
  initialSearchParams,
  initialLanguage,
}: {
  children: ReactNode;
  initialBooks?: BibleBook[];
  /** When provided with initialBooks, used for initial version/sync state (avoids useEffect hydration). */
  initialSearchParams?: Record<string, string | undefined>;
  /** Route language (e.g. from /bible/vi/read). Used for default version when no version in URL. */
  initialLanguage?: Language;
}) {
  const { globalLanguage } = useBibleApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialUrlSynced = useRef(false);
  const initFromUrlRunOnce = useRef(false);
  const prevPathnameRef = useRef<string | null>(null);
  const clearVersesOnNextSyncRef = useRef(false);
  /** When true, next URL push omits book/chapter (hierarchy: testament → book → chapter). */
  const omitBookChapterFromUrlRef = useRef(false);
  const effectiveLanguage = initialLanguage ?? globalLanguage;

  // Stable serialization so effect only runs when params actually change (avoids loop from useSearchParams() new refs)
  const searchParamsKey = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : [...searchParams.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v ?? ""}`)
            .join("&"),
    [searchParams]
  );

  const initialParsed = useMemo(
    () =>
      initialSearchParams && hasVersionInParams(initialSearchParams)
        ? parseReadSearchParams(initialSearchParams, "EN")
        : parseReadSearchParams(
            Object.fromEntries(searchParams.entries()),
            effectiveLanguage
          ),
    [initialSearchParams, searchParamsKey, effectiveLanguage]
  );

  const initialReadState = useMemo(
    () =>
      getInitialReadState(
        initialBooks,
        initialParsed as Parameters<typeof getInitialReadState>[1],
        resolveBookFromParams,
        clampChapter
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only when parsed/books for init change
    [initialSearchParams, searchParamsKey, effectiveLanguage]
  );

  const [state, dispatch] = useReducer(readReducer, initialReadState);

  const {
    books,
    leftVersion,
    rightVersion,
    syncMode,
    focusMode,
    leftBook,
    leftChapter,
    rightBook,
    rightChapter,
    leftContent,
    rightContent,
    loadingLeft,
    loadingRight,
    hoveredVerse,
    verse1,
    verse2,
    verseEnd,
    highlightedVerses,
    highlightedVersesRight,
    panelWidth,
    isDragging,
    subNavBookOpen,
    subNavChapterOpen,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    insightOpen,
    insightMinimized,
    readFontSize,
    readFontFace,
  } = state;

  const setBooks = useCallback((books: BibleBook[]) => {
    dispatch({ type: "SET_BOOKS", payload: books });
  }, []);
  const setSyncMode = useCallback((v: boolean) => {
    dispatch({ type: "SET_SYNC_MODE", payload: v });
  }, []);
  const setFocusMode = useCallback((v: boolean) => {
    dispatch({ type: "SET_FOCUS_MODE", payload: v });
  }, []);
  const setHoveredVerse = useCallback((v: number | null) => {
    dispatch({ type: "SET_HOVERED_VERSE", payload: v });
  }, []);
  const setVerse1 = useCallback((v: number | null) => {
    dispatch({ type: "SET_VERSE1", payload: v });
  }, []);
  const setVerse2 = useCallback((v: number | null) => {
    dispatch({ type: "SET_VERSE2", payload: v });
  }, []);
  const setVerseEnd = useCallback((v: number | null) => {
    dispatch({ type: "SET_VERSE_END", payload: v });
  }, []);
  const setHighlightedVerses = useCallback(
    (v: number[] | ((prev: number[]) => number[])) => {
      if (typeof v === "function") {
        const next = v(highlightedVerses);
        dispatch({ type: "SET_HIGHLIGHTED_VERSES", payload: next });
      } else {
        dispatch({ type: "SET_HIGHLIGHTED_VERSES", payload: v });
      }
    },
    [highlightedVerses]
  );
  const setHighlightedVersesRight = useCallback(
    (v: number[] | ((prev: number[]) => number[])) => {
      if (typeof v === "function") {
        const next = v(highlightedVersesRight);
        dispatch({ type: "SET_HIGHLIGHTED_VERSES_RIGHT", payload: next });
      } else {
        dispatch({ type: "SET_HIGHLIGHTED_VERSES_RIGHT", payload: v });
      }
    },
    [highlightedVersesRight]
  );
  const setPanelWidth = useCallback((v: number) => {
    dispatch({ type: "SET_PANEL_WIDTH", payload: v });
  }, []);
  const setIsDragging = useCallback((v: boolean) => {
    dispatch({ type: "SET_IS_DRAGGING", payload: v });
  }, []);
  const setSubNavBookOpen = useCallback((v: boolean) => {
    dispatch({ type: "SET_SUB_NAV_BOOK_OPEN", payload: v });
  }, []);
  const setSubNavChapterOpen = useCallback((v: boolean) => {
    dispatch({ type: "SET_SUB_NAV_CHAPTER_OPEN", payload: v });
  }, []);
  const setInsightOpen = useCallback((v: boolean) => {
    dispatch({ type: "SET_INSIGHT_OPEN", payload: v });
  }, []);
  const setInsightMinimized = useCallback((v: boolean) => {
    dispatch({ type: "SET_INSIGHT_MINIMIZED", payload: v });
  }, []);

  const toggleVerseHighlight = useCallback((verseNumber: number) => {
    dispatch({ type: "TOGGLE_VERSE_HIGHLIGHT", payload: verseNumber });
  }, []);
  const toggleRightVerseHighlight = useCallback((verseNumber: number) => {
    dispatch({ type: "TOGGLE_RIGHT_VERSE_HIGHLIGHT", payload: verseNumber });
  }, []);

  const readTextPrefsRef = useRef(false);

  useEffect(() => {
    if (readTextPrefsRef.current || typeof window === "undefined") return;
    readTextPrefsRef.current = true;
    const { readFontSize: s, readFontFace: f } = readStoredReadTextPrefs();
    queueMicrotask(() => {
      dispatch({ type: "SET_READ_FONT_SIZE", payload: s });
      dispatch({ type: "SET_READ_FONT_FACE", payload: f });
    });
  }, []);
  useEffect(() => {
    if (!readTextPrefsRef.current) return;
    writeStoredReadTextPrefs(readFontSize, readFontFace);
  }, [readFontSize, readFontFace]);

  /** When only one version is selected, auto set sync to false (unsynced). */
  useEffect(() => {
    if (rightVersion === null && syncMode) {
      queueMicrotask(() => dispatch({ type: "SET_SYNC_MODE", payload: false }));
    }
  }, [rightVersion, syncMode]);

  const setReadFontSize = useCallback((size: ReadFontSize) => {
    dispatch({ type: "SET_READ_FONT_SIZE", payload: size });
  }, []);
  const setReadFontFace = useCallback((faceId: string) => {
    dispatch({ type: "SET_READ_FONT_FACE", payload: faceId });
  }, []);

  const otBooks = getOtBooks(books);
  const ntBooks = getNtBooks(books);
  const filteredBooks = testamentFilter === "ot" ? otBooks : ntBooks;

  useEffect(() => {
    if (books.length === 0) return;
    const needsLeft = !leftBook;
    const needsRight = !rightBook;
    if (!needsLeft && !needsRight) return;
    const book0 = books[0]!;
    queueMicrotask(() => {
      if (needsLeft) dispatch({ type: "SET_LEFT_BOOK", payload: book0 });
      if (needsRight) dispatch({ type: "SET_RIGHT_BOOK", payload: book0 });
    });
  }, [books, leftBook, rightBook]);

  // When language (pathname) changes, clear verse highlights to avoid URL/state churn and glitching
  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (prev !== null && prev !== pathname) {
      clearVersesOnNextSyncRef.current = true;
      dispatch({ type: "CLEAR_VERSE_HIGHLIGHTS_ON_PATHNAME" });
    }
  }, [pathname]);

  // Push URL first so that when user toggles last verse off, we update the URL before sync runs.
  // Use current pathname so we only update search (no redirect on language switch → avoids re-render churn).
  useEffect(() => {
    if (!initialUrlSynced.current) return;
    if (typeof window === "undefined") return;
    const hasAnyVersion = leftVersion !== null || rightVersion !== null;
    const currentPath = pathname;

    // If user has cleared all versions and insights is off, clear query string entirely
    if (!hasAnyVersion && !insightOpen && !focusMode) {
      if (!searchParamsEqual(window.location.search, "")) {
        window.history.replaceState(null, "", currentPath);
      }
      return;
    }

    // No versions but insights open -> only keep insights in URL
    if (!hasAnyVersion && (insightOpen || focusMode)) {
      const qsInsightsOnly = buildReadSearchParams({
        insights: insightOpen || undefined,
        focus: focusMode || undefined,
      });
      const desiredSearchInsights = qsInsightsOnly ? `?${qsInsightsOnly}` : "";
      if (!searchParamsEqual(window.location.search, desiredSearchInsights)) {
        window.history.replaceState(null, "", `${currentPath}${desiredSearchInsights}`);
      }
      return;
    }

    // At least one version selected: update search only (stay on current path)
    const v1 = leftVersion;
    const leftTestament = syncMode ? testamentFilter : leftTestamentFilter;
    const rightTestament = syncMode ? testamentFilter : rightTestamentFilter;
    const omitBookChapter = omitBookChapterFromUrlRef.current;
    if (omitBookChapter) omitBookChapterFromUrlRef.current = false;
    const qs = buildReadSearchParams({
      version1: v1 ?? undefined,
      version2: rightVersion,
      sync: syncMode,
      book1Id: omitBookChapter ? undefined : (leftBook?.id ?? undefined),
      chapter1: omitBookChapter ? undefined : leftChapter,
      testament1: leftTestament,
      book2Id: omitBookChapter ? undefined : (rightVersion && !syncMode ? (rightBook?.id ?? undefined) : undefined),
      chapter2: omitBookChapter ? undefined : (rightVersion && !syncMode ? rightChapter : undefined),
      testament2: rightVersion && !syncMode ? rightTestament : undefined,
      insights: insightOpen || undefined,
      focus: focusMode || undefined,
      verse1: highlightedVerses[0] ?? verse1 ?? undefined,
      verse2: verse2 || undefined,
      verseEnd:
        highlightedVerses.length > 1
          ? highlightedVerses[highlightedVerses.length - 1]
          : verseEnd ?? undefined,
      verses: highlightedVerses.length > 0 ? highlightedVerses : undefined,
    });
    const desiredSearch = qs ? `?${qs}` : "";
    if (desiredSearch === "") return;
    const fullUrl = `${currentPath}${desiredSearch}`;
    if (!searchParamsEqual(window.location.search, desiredSearch)) {
      window.history.replaceState(null, "", fullUrl);
    }
  }, [
    leftVersion,
    rightVersion,
    syncMode,
    leftBook?.id,
    leftChapter,
    testamentFilter,
    leftTestamentFilter,
    rightBook?.id,
    rightChapter,
    rightTestamentFilter,
    insightOpen,
    focusMode,
    pathname,
    verse1,
    verse2,
    verseEnd,
    // Stable primitive so dependency array size never changes (React requirement)
    highlightedVerses.length,
    highlightedVerses.join(","),
  ]);

  // URL sync: keep state in sync with URL; when URL has no versions, stay in "empty" state.
  // On client, read from window.location so we see URL after push effect has updated it (e.g. user toggled last verse off).
  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? Object.fromEntries(new URLSearchParams(window.location.search).entries())
        : Object.fromEntries(searchParams.entries());
    const parsed = parseReadSearchParams(raw, effectiveLanguage);
    const hasAnyVersion = parsed.version1 !== null || parsed.version2 !== null;

    // No versions in URL -> do NOT add defaults or push params; keep empty state
    if (!hasAnyVersion && !parsed.insights) {
      if (!initFromUrlRunOnce.current) {
        initFromUrlRunOnce.current = true;
        initialUrlSynced.current = true;
      }
      dispatch({
        type: "SYNC_FROM_URL_EMPTY",
        payload: { sync: parsed.sync, focus: parsed.focus },
      });
      initialUrlSynced.current = true;
      return;
    }
    if (books.length > 0) {
      const left = resolveBookFromParams(books, parsed.book1Id, parsed.testament1);
      const leftCh = clampChapter(parsed.chapter1, left);
      const hasRight = parsed.version2 && !parsed.sync;
      const right = hasRight
        ? resolveBookFromParams(books, parsed.book2Id, parsed.testament2)
        : left;
      const rightCh = hasRight ? clampChapter(parsed.chapter2, right) : leftCh;
      const skipVerses = clearVersesOnNextSyncRef.current;
      if (hasAnyVersion) {
        const qs = buildReadSearchParams({
          version1: parsed.version1 ?? undefined,
          version2: parsed.version2 ?? undefined,
          sync: parsed.sync,
          book1Id: left.id,
          chapter1: leftCh,
          testament1: parsed.testament1,
          book2Id: hasRight ? right.id : undefined,
          chapter2: hasRight ? rightCh : undefined,
          testament2: hasRight ? parsed.testament2 : undefined,
          insights: parsed.insights || undefined,
          focus: parsed.focus || undefined,
          verse1: skipVerses ? undefined : parsed.verse1 || undefined,
          verse2: skipVerses ? undefined : (hasRight ? parsed.verse2 || undefined : undefined),
          verseEnd: skipVerses ? undefined : parsed.verseEnd || undefined,
          verses: skipVerses ? undefined : parsed.verses?.length ? parsed.verses : undefined,
        });
        const desiredSearch = qs ? `?${qs}` : "";
        const fullUrl = desiredSearch ? `${pathname}${desiredSearch}` : pathname;
        if (
          typeof window !== "undefined" &&
          !searchParamsEqual(window.location.search, desiredSearch)
        ) {
          window.history.replaceState(null, "", fullUrl);
        }
      }
      if (!initFromUrlRunOnce.current) {
        initFromUrlRunOnce.current = true;
        initialUrlSynced.current = true;
        return;
      }
      const payload: SyncFromUrlPayload = {
        leftVersion: parsed.version1,
        rightVersion: parsed.version2,
        sync: parsed.sync,
        focus: parsed.focus,
        leftBook: left,
        leftChapter: leftCh,
        rightBook: right,
        rightChapter: rightCh,
        testamentFilter: parsed.testament1,
        leftTestamentFilter: parsed.testament1,
        rightTestamentFilter: hasRight ? parsed.testament2 : parsed.testament1,
        insightOpen: parsed.insights,
        verse1: skipVerses ? null : parsed.verse1,
        verse2: skipVerses ? null : (hasRight ? parsed.verse2 : null),
        verseEnd: skipVerses ? null : parsed.verseEnd,
        verses: skipVerses ? [] : (parsed.verses ?? []),
      };
      dispatch({ type: "SYNC_FROM_URL", payload });
      if (skipVerses) clearVersesOnNextSyncRef.current = false;
    } else {
      const skipVersesElse = clearVersesOnNextSyncRef.current;
      if (hasAnyVersion || parsed.insights) {
        const qs = buildReadSearchParams({
          version1: parsed.version1 ?? undefined,
          version2: parsed.version2 ?? undefined,
          sync: hasAnyVersion ? parsed.sync : undefined,
          insights: parsed.insights || undefined,
          focus: parsed.focus || undefined,
          verse1: skipVersesElse ? undefined : parsed.verse1 || undefined,
          verse2: skipVersesElse ? undefined : parsed.verse2 || undefined,
          verseEnd: skipVersesElse ? undefined : parsed.verseEnd || undefined,
          verses: skipVersesElse ? undefined : parsed.verses?.length ? parsed.verses : undefined,
        });
        const desiredSearch = qs ? `?${qs}` : "";
        const fullUrl = desiredSearch ? `${pathname}${desiredSearch}` : pathname;
        if (
          typeof window !== "undefined" &&
          !searchParamsEqual(window.location.search, desiredSearch)
        ) {
          window.history.replaceState(null, "", fullUrl);
        }
      }
      if (!initFromUrlRunOnce.current) {
        initFromUrlRunOnce.current = true;
        initialUrlSynced.current = true;
        return;
      }
      dispatch({
        type: "SYNC_FROM_URL_PARTIAL",
        payload: {
          leftVersion: parsed.version1,
          rightVersion: parsed.version2,
          sync: parsed.sync,
          focus: parsed.focus,
          insightOpen: parsed.insights,
          verse1: skipVersesElse ? null : parsed.verse1,
          verse2: skipVersesElse ? null : parsed.verse2,
          verseEnd: skipVersesElse ? null : parsed.verseEnd,
          verses: skipVersesElse ? [] : (parsed.verses ?? []),
        },
      });
      if (skipVersesElse) clearVersesOnNextSyncRef.current = false;
    }
    initialUrlSynced.current = true;
  }, [searchParamsKey, pathname, effectiveLanguage, router, books.length]);

  const fetchChapter = useCallback(
    async (bookId: string, chapter: number, version: VersionId) => {
      const data = await getChapterContent(bookId, chapter, version);
      return data;
    },
    []
  );

  useEffect(() => {
    if (!leftBook || leftVersion === null) {
      dispatch({ type: "SET_LEFT_CONTENT", payload: null });
      return;
    }
    dispatch({ type: "SET_LOADING_LEFT", payload: true });
    fetchChapter(leftBook.id, leftChapter, leftVersion)
      .then((content) => dispatch({ type: "SET_LEFT_CONTENT", payload: content }))
      .finally(() => dispatch({ type: "SET_LOADING_LEFT", payload: false }));
  }, [leftBook?.id, leftChapter, leftVersion, fetchChapter]);

  const rightBookId = syncMode ? leftBook?.id : rightBook?.id;
  const rightChapterNum = syncMode ? leftChapter : rightChapter;
  useEffect(() => {
    if (!rightVersion) {
      dispatch({ type: "SET_RIGHT_CONTENT", payload: null });
      return;
    }
    const book = syncMode ? leftBook : rightBook;
    const ch = syncMode ? leftChapter : rightChapter;
    if (!book) return;
    dispatch({ type: "SET_LOADING_RIGHT", payload: true });
    fetchChapter(book.id, ch, rightVersion)
      .then((content) => dispatch({ type: "SET_RIGHT_CONTENT", payload: content }))
      .finally(() => dispatch({ type: "SET_LOADING_RIGHT", payload: false }));
  }, [
    rightVersion,
    syncMode,
    rightBookId,
    rightChapterNum,
    leftBook,
    rightBook,
    leftChapter,
    rightChapter,
    fetchChapter,
  ]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      dispatch({ type: "SET_PANEL_WIDTH", payload: Math.min(Math.max(newWidth, 25), 75) });
    };
    const handleMouseUp = () => dispatch({ type: "SET_IS_DRAGGING", payload: false });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleVersionChipClick = useCallback((transId: VersionId) => {
    dispatch({ type: "VERSION_CHIP_CLICK", payload: transId });
  }, []);

  const handleLeftBookChange = useCallback(
    (book: BibleBook) => {
      omitBookChapterFromUrlRef.current = false;
      dispatch({
        type: "LEFT_BOOK_CHAPTER",
        payload: { book, chapter: 1, syncMode },
      });
    },
    [syncMode]
  );

  const handleLeftChapterChange = useCallback(
    (chapter: number) => {
      if (!leftBook) return;
      omitBookChapterFromUrlRef.current = false;
      dispatch({
        type: "LEFT_BOOK_CHAPTER",
        payload: { book: leftBook, chapter, syncMode },
      });
    },
    [syncMode, leftBook]
  );

  const handleRightBookChange = useCallback((book: BibleBook) => {
    dispatch({ type: "RIGHT_BOOK_CHAPTER", payload: { book, chapter: 1 } });
  }, []);

  const handleRightChapterChange = useCallback((chapter: number) => {
    if (!rightBook) return;
    dispatch({
      type: "RIGHT_BOOK_CHAPTER",
      payload: { book: rightBook, chapter },
    });
  }, [rightBook]);

  const setTestamentFilterAndAdjustBook = useCallback(
    (filter: TestamentFilter) => {
      omitBookChapterFromUrlRef.current = true;
      dispatch({ type: "TESTAMENT_AND_ADJUST", payload: { filter, syncMode } });
    },
    [syncMode]
  );

  const setLeftTestamentFilterAndAdjust = useCallback((filter: TestamentFilter) => {
    omitBookChapterFromUrlRef.current = true;
    dispatch({ type: "LEFT_TESTAMENT_AND_ADJUST", payload: filter });
  }, []);

  const setRightTestamentFilterAndAdjust = useCallback((filter: TestamentFilter) => {
    omitBookChapterFromUrlRef.current = true;
    dispatch({ type: "RIGHT_TESTAMENT_AND_ADJUST", payload: filter });
  }, []);

  const value: ReadContextValue = {
    books,
    setBooks,
    leftVersion,
    rightVersion,
    syncMode,
    setSyncMode,
    focusMode,
    setFocusMode,
    leftBook,
    leftChapter,
    rightBook,
    rightChapter,
    leftContent,
    rightContent,
    loadingLeft,
    loadingRight,
    hoveredVerse,
    setHoveredVerse,
    verse1,
    verse2,
    verseEnd,
    highlightedVerses,
    highlightedVersesRight,
    setHighlightedVerses,
    toggleVerseHighlight,
    setHighlightedVersesRight,
    toggleRightVerseHighlight,
    setVerse1,
    setVerse2,
    setVerseEnd,
    panelWidth,
    setPanelWidth,
    isDragging,
    setIsDragging,
    subNavBookOpen,
    setSubNavBookOpen,
    subNavChapterOpen,
    setSubNavChapterOpen,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
    insightOpen,
    insightMinimized,
    readFontSize,
    readFontFace,
    handleVersionChipClick,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setTestamentFilterAndAdjustBook,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
    setInsightOpen,
    setInsightMinimized,
    setReadFontSize,
    setReadFontFace,
    otBooks,
    ntBooks,
    filteredBooks,
  };

  return <ReadContext.Provider value={value}>{children}</ReadContext.Provider>;
}
