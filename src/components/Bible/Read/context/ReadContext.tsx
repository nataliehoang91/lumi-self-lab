"use client";

import {
  createContext,
  useContext,
  useState,
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
import type { ChapterContent } from "../types";
import type { VersionId } from "../constants";
import type { TestamentFilter } from "../constants";
import { TRANSLATIONS } from "../constants";
import { getOtBooks, getNtBooks, resolveBookFromParams, clampChapter } from "../utils";

interface ReadState {
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
  /** Multiple verse numbers to highlight (left/sync panel). URL param: verses=3,5,7 */
  highlightedVerses: number[];
  /** Multiple verse numbers to highlight in independent right panel (not URL-synced). */
  highlightedVersesRight: number[];
  panelWidth: number;
  isDragging: boolean;
  subNavBookOpen: boolean;
  subNavChapterOpen: boolean;
  testamentFilter: TestamentFilter;
  leftTestamentFilter: TestamentFilter;
  rightTestamentFilter: TestamentFilter;
  insightOpen: boolean;
}

interface ReadContextValue extends ReadState {
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

  const [books, setBooks] = useState<BibleBook[]>(initialBooks);
  const [syncMode, setSyncMode] = useState(initialParsed.sync);
  const [focusMode, setFocusMode] = useState(initialParsed.focus);
  const [leftVersion, setLeftVersion] = useState<VersionId | null>(
    initialParsed.version1
  );
  const [rightVersion, setRightVersion] = useState<VersionId | null>(
    initialParsed.version2
  );
  function getInitialBookChapterFromParams() {
    if (initialSearchParams && initialBooks.length > 0) {
      const p = parseReadSearchParams(initialSearchParams, "EN");
      const left = resolveBookFromParams(initialBooks, p.book1Id, p.testament1);
      const leftCh = clampChapter(p.chapter1, left);
      const right = resolveBookFromParams(initialBooks, p.book2Id, p.testament2);
      const rightCh = clampChapter(p.chapter2, right);
      const hasRight = p.version2 && !p.sync;
      return {
        leftBook: left,
        leftChapter: leftCh,
        rightBook: hasRight ? right : left,
        rightChapter: hasRight ? rightCh : leftCh,
        testamentFilter: p.testament1,
        leftTestamentFilter: p.testament1,
        rightTestamentFilter: hasRight ? p.testament2 : p.testament1,
      };
    }
    const first = initialBooks[0] ?? null;
    return {
      leftBook: first,
      leftChapter: 1,
      rightBook: first,
      rightChapter: 1,
      testamentFilter: "ot" as TestamentFilter,
      leftTestamentFilter: "ot" as TestamentFilter,
      rightTestamentFilter: "ot" as TestamentFilter,
    };
  }
  const initialBookChapter = getInitialBookChapterFromParams();
  const [leftBook, setLeftBook] = useState<BibleBook | null>(initialBookChapter.leftBook);
  const [leftChapter, setLeftChapter] = useState(initialBookChapter.leftChapter);
  const [rightBook, setRightBook] = useState<BibleBook | null>(
    initialBookChapter.rightBook
  );
  const [rightChapter, setRightChapter] = useState(initialBookChapter.rightChapter);
  const [leftContent, setLeftContent] = useState<ChapterContent | null>(null);
  const [rightContent, setRightContent] = useState<ChapterContent | null>(null);
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);
  const [verse1, setVerse1] = useState<number | null>(initialParsed.verse1);
  const [verse2, setVerse2] = useState<number | null>(initialParsed.verse2);
  const [verseEnd, setVerseEnd] = useState<number | null>(initialParsed.verseEnd ?? null);
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>(
    initialParsed.verses ?? []
  );
  const [highlightedVersesRight, setHighlightedVersesRight] = useState<number[]>([]);
  const [panelWidth, setPanelWidth] = useState(50);

  const toggleVerseHighlight = useCallback(
    (verseNumber: number) => {
      const num = Number(verseNumber);
      if (!Number.isFinite(num) || num < 1) return;
      setHighlightedVerses((prev) => {
        const next = prev.includes(num)
          ? prev.filter((n) => n !== num)
          : [...prev, num].sort((a, b) => a - b);

        // Keep single-verse state in sync with multi-verse highlights so
        // URL params and UI behave correctly when the last verse is toggled off.
        if (next.length === 0) {
          setVerse1(null);
          setVerseEnd(null);
        } else {
          setVerse1(next[0] ?? null);
          const last = next[next.length - 1];
          setVerseEnd(next.length > 1 && last > next[0]! ? last : null);
        }

        return next;
      });
    },
    [setVerse1, setVerseEnd]
  );
  const toggleRightVerseHighlight = useCallback((verseNumber: number) => {
    const num = Number(verseNumber);
    if (!Number.isFinite(num) || num < 1) return;
    setHighlightedVersesRight((prev) => {
      const next = prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num].sort((a, b) => a - b);
      return next;
    });
  }, []);

  const clearVerseHighlights = useCallback(() => {
    setVerse1(null);
    setVerse2(null);
    setVerseEnd(null);
    setHighlightedVerses([]);
    setHighlightedVersesRight([]);
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [subNavBookOpen, setSubNavBookOpen] = useState(false);
  const [subNavChapterOpen, setSubNavChapterOpen] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>(
    initialBookChapter.testamentFilter
  );
  const [leftTestamentFilter, setLeftTestamentFilter] = useState<TestamentFilter>(
    initialBookChapter.leftTestamentFilter
  );
  const [rightTestamentFilter, setRightTestamentFilter] = useState<TestamentFilter>(
    initialBookChapter.rightTestamentFilter
  );
  const [insightOpen, setInsightOpen] = useState(initialParsed.insights);

  const otBooks = getOtBooks(books);
  const ntBooks = getNtBooks(books);
  const filteredBooks = testamentFilter === "ot" ? otBooks : ntBooks;

  useEffect(() => {
    if (books.length > 0 && !leftBook) setLeftBook(books[0]);
    if (books.length > 0 && !rightBook) setRightBook(books[0]);
  }, [books, leftBook, rightBook]);

  // When language (pathname) changes, clear verse highlights to avoid URL/state churn and glitching
  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (prev !== null && prev !== pathname) {
      clearVersesOnNextSyncRef.current = true;
      setVerse1(null);
      setVerse2(null);
      setVerseEnd(null);
      setHighlightedVerses([]);
      setHighlightedVersesRight([]);
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
    const qs = buildReadSearchParams({
      version1: v1 ?? undefined,
      version2: rightVersion,
      sync: syncMode,
      book1Id: leftBook?.id ?? undefined,
      chapter1: leftChapter,
      testament1: leftTestament,
      book2Id: rightVersion && !syncMode ? (rightBook?.id ?? undefined) : undefined,
      chapter2: rightVersion && !syncMode ? rightChapter : undefined,
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
      setLeftVersion(null);
      setRightVersion(null);
      setSyncMode(parsed.sync);
      setFocusMode(parsed.focus);
      setInsightOpen(false);
      setVerse1(null);
      setVerse2(null);
      setVerseEnd(null);
      setHighlightedVerses([]);
      setHighlightedVersesRight([]);
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
      setLeftVersion(parsed.version1);
      setRightVersion(parsed.version2);
      setSyncMode(parsed.sync);
      setFocusMode(parsed.focus);
      setLeftBook(left);
      setLeftChapter(leftCh);
      setRightBook(right);
      setRightChapter(rightCh);
      setTestamentFilter(parsed.testament1);
      setLeftTestamentFilter(parsed.testament1);
      setRightTestamentFilter(hasRight ? parsed.testament2 : parsed.testament1);
      setInsightOpen(parsed.insights);
      if (skipVerses) {
        clearVersesOnNextSyncRef.current = false;
        setVerse1(null);
        setVerse2(null);
        setVerseEnd(null);
        setHighlightedVerses([]);
      } else {
        setVerse1(parsed.verse1);
        setVerse2(parsed.verse2);
        setVerseEnd(parsed.verseEnd);
        setHighlightedVerses(parsed.verses ?? []);
      }
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
      setLeftVersion(parsed.version1);
      setRightVersion(parsed.version2);
      setSyncMode(parsed.sync);
      setFocusMode(parsed.focus);
      setInsightOpen(parsed.insights);
      if (skipVersesElse) {
        clearVersesOnNextSyncRef.current = false;
        setVerse1(null);
        setVerse2(null);
        setVerseEnd(null);
        setHighlightedVerses([]);
      } else {
        setVerse1(parsed.verse1);
        setVerse2(parsed.verse2);
        setVerseEnd(parsed.verseEnd);
        setHighlightedVerses(parsed.verses ?? []);
      }
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
      setLeftContent(null);
      return;
    }
    setLoadingLeft(true);
    fetchChapter(leftBook.id, leftChapter, leftVersion)
      .then(setLeftContent)
      .finally(() => setLoadingLeft(false));
  }, [leftBook?.id, leftChapter, leftVersion, fetchChapter]);

  const rightBookId = syncMode ? leftBook?.id : rightBook?.id;
  const rightChapterNum = syncMode ? leftChapter : rightChapter;
  useEffect(() => {
    if (!rightVersion) {
      setRightContent(null);
      return;
    }
    const book = syncMode ? leftBook : rightBook;
    const ch = syncMode ? leftChapter : rightChapter;
    if (!book) return;
    setLoadingRight(true);
    fetchChapter(book.id, ch, rightVersion)
      .then(setRightContent)
      .finally(() => setLoadingRight(false));
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
      setPanelWidth(() => Math.min(Math.max(newWidth, 25), 75));
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleVersionChipClick = useCallback(
    (transId: VersionId) => {
      const isLeft = leftVersion === transId;
      const isRight = rightVersion === transId;
      if (isLeft) {
        setLeftVersion(rightVersion);
        setRightVersion(null);
        return;
      }
      if (isRight) {
        setRightVersion(null);
        return;
      }
      if (leftVersion === null && rightVersion === null) {
        setLeftVersion(transId);
        return;
      }
      if (rightVersion === null) {
        setRightVersion(transId);
        return;
      }
      setRightVersion(transId);
    },
    [leftVersion, rightVersion]
  );

  const handleLeftBookChange = useCallback(
    (book: BibleBook) => {
      clearVerseHighlights();
      setLeftBook(book);
      if (syncMode) setRightBook(book);
      setLeftChapter(1);
      if (syncMode) setRightChapter(1);
    },
    [syncMode, clearVerseHighlights]
  );

  const handleLeftChapterChange = useCallback(
    (chapter: number) => {
      clearVerseHighlights();
      setLeftChapter(chapter);
      if (syncMode) setRightChapter(chapter);
    },
    [syncMode, clearVerseHighlights]
  );

  const handleRightBookChange = useCallback(
    (book: BibleBook) => {
      clearVerseHighlights();
      setRightBook(book);
      setRightChapter(1);
    },
    [clearVerseHighlights]
  );

  const handleRightChapterChange = useCallback(
    (chapter: number) => {
      clearVerseHighlights();
      setRightChapter(chapter);
    },
    [clearVerseHighlights]
  );

  const setTestamentFilterAndAdjustBook = useCallback(
    (filter: TestamentFilter) => {
      clearVerseHighlights();
      setTestamentFilter(filter);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return;
      const currentInList = leftBook && list.some((b) => b.id === leftBook.id);
      if (!currentInList) {
        setLeftBook(list[0]);
        if (syncMode) setRightBook(list[0]);
        setLeftChapter(1);
        if (syncMode) setRightChapter(1);
      }
    },
    [otBooks, ntBooks, leftBook, syncMode, clearVerseHighlights]
  );

  const setLeftTestamentFilterAndAdjust = useCallback(
    (filter: TestamentFilter) => {
      clearVerseHighlights();
      setLeftTestamentFilter(filter);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return;
      const currentInList = leftBook && list.some((b) => b.id === leftBook.id);
      if (!currentInList) {
        setLeftBook(list[0]);
        setLeftChapter(1);
      }
    },
    [otBooks, ntBooks, leftBook, clearVerseHighlights]
  );

  const setRightTestamentFilterAndAdjust = useCallback(
    (filter: TestamentFilter) => {
      clearVerseHighlights();
      setRightTestamentFilter(filter);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return;
      const currentInList = rightBook && list.some((b) => b.id === rightBook.id);
      if (!currentInList) {
        setRightBook(list[0]);
        setRightChapter(1);
      }
    },
    [otBooks, ntBooks, rightBook, clearVerseHighlights]
  );

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
    handleVersionChipClick,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setTestamentFilterAndAdjustBook,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
    setInsightOpen,
    otBooks,
    ntBooks,
    filteredBooks,
  };

  return <ReadContext.Provider value={value}>{children}</ReadContext.Provider>;
}
