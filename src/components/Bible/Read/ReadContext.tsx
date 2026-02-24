"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  parseReadSearchParams,
  buildReadSearchParams,
  defaultVersionFromLanguage,
  type ReadSearchParams,
} from "@/app/(bible)/bible/read/params";
import { getChapterContent } from "@/app/actions/bible/read";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import type { BibleBook } from "./types";
import type { ChapterContent } from "./types";
import type { VersionId } from "./constants";
import type { TestamentFilter } from "./constants";
import { getOtBooks, getNtBooks, resolveBookFromParams, clampChapter } from "./utils";

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

const initialParsedRefDefault = { current: null as ReadSearchParams | null };

function hasVersionInParams(params: Record<string, string | undefined>): boolean {
  return (params.version1 ?? params.v1 ?? "").trim() !== "";
}

export function ReadProvider({
  children,
  initialBooks = [],
  initialSearchParams,
}: {
  children: ReactNode;
  initialBooks?: BibleBook[];
  /** When provided with initialBooks, used for initial version/sync state (avoids useEffect hydration). */
  initialSearchParams?: Record<string, string | undefined>;
}) {
  const { globalLanguage } = useBibleApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialParsedRef = useRef<ReadSearchParams | null>(null);
  const initialUrlSynced = useRef(false);
  const initFromUrlRunOnce = useRef(false);

  function getInitialParsed(): ReadSearchParams {
    if (initialParsedRef.current === null) {
      const raw = Object.fromEntries(searchParams.entries());
      initialParsedRef.current = parseReadSearchParams(raw, globalLanguage);
    }
    return initialParsedRef.current;
  }

  const [books, setBooks] = useState<BibleBook[]>(initialBooks);
  const [syncMode, setSyncMode] = useState(() =>
    initialSearchParams && hasVersionInParams(initialSearchParams)
      ? parseReadSearchParams(initialSearchParams, "EN").sync
      : getInitialParsed().sync
  );
  const [focusMode, setFocusMode] = useState(false);
  const [leftVersion, setLeftVersion] = useState<VersionId | null>(() =>
    initialSearchParams && hasVersionInParams(initialSearchParams)
      ? parseReadSearchParams(initialSearchParams, "EN").version1
      : getInitialParsed().version1
  );
  const [rightVersion, setRightVersion] = useState<VersionId | null>(() =>
    initialSearchParams && hasVersionInParams(initialSearchParams)
      ? parseReadSearchParams(initialSearchParams, "EN").version2
      : getInitialParsed().version2
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
  const [rightBook, setRightBook] = useState<BibleBook | null>(initialBookChapter.rightBook);
  const [rightChapter, setRightChapter] = useState(initialBookChapter.rightChapter);
  const [leftContent, setLeftContent] = useState<ChapterContent | null>(null);
  const [rightContent, setRightContent] = useState<ChapterContent | null>(null);
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);
  const [panelWidth, setPanelWidth] = useState(50);
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
  const [insightOpen, setInsightOpen] = useState(() => getInitialParsed().insights);

  const otBooks = getOtBooks(books);
  const ntBooks = getNtBooks(books);
  const filteredBooks = testamentFilter === "ot" ? otBooks : ntBooks;

  useEffect(() => {
    if (books.length > 0 && !leftBook) setLeftBook(books[0]);
    if (books.length > 0 && !rightBook) setRightBook(books[0]);
  }, [books, leftBook, rightBook]);

  // URL sync: keep state in sync with URL; when URL has no versions, stay in "empty" state
  useEffect(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = parseReadSearchParams(raw, globalLanguage);
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
      setInsightOpen(false);
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
        });
        const desiredSearch = qs ? `?${qs}` : "";
        if (typeof window !== "undefined" && window.location.search !== desiredSearch) {
          router.replace(desiredSearch ? `${pathname}${desiredSearch}` : pathname);
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
      setLeftBook(left);
      setLeftChapter(leftCh);
      setRightBook(right);
      setRightChapter(rightCh);
      setTestamentFilter(parsed.testament1);
      setLeftTestamentFilter(parsed.testament1);
      setRightTestamentFilter(hasRight ? parsed.testament2 : parsed.testament1);
      setInsightOpen(parsed.insights);
    } else {
      if (hasAnyVersion || parsed.insights) {
        const qs = buildReadSearchParams({
          version1: parsed.version1 ?? undefined,
          version2: parsed.version2 ?? undefined,
          sync: hasAnyVersion ? parsed.sync : undefined,
          insights: parsed.insights || undefined,
        });
        const desiredSearch = qs ? `?${qs}` : "";
        if (typeof window !== "undefined" && window.location.search !== desiredSearch) {
          router.replace(desiredSearch ? `${pathname}${desiredSearch}` : pathname);
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
      setInsightOpen(parsed.insights);
    }
    initialUrlSynced.current = true;
  }, [searchParams, pathname, globalLanguage, router, books]);

  // Push URL when user changes version, sync, book, chapter, or testament
  useEffect(() => {
    if (!initialUrlSynced.current) return;
    const hasAnyVersion = leftVersion !== null || rightVersion !== null;

    // If user has cleared all versions and insights is off, clear query string entirely
    if (!hasAnyVersion && !insightOpen) {
      if (typeof window === "undefined") return;
      if (window.location.search !== "") {
        router.replace(pathname);
      }
      return;
    }

    // No versions but insights open -> only keep insights in URL
    if (!hasAnyVersion && insightOpen) {
      const qsInsightsOnly = buildReadSearchParams({ insights: true });
      const desiredSearchInsights = qsInsightsOnly ? `?${qsInsightsOnly}` : "";
      if (typeof window === "undefined") return;
      if (window.location.search !== desiredSearchInsights) {
        router.replace(`${pathname}${desiredSearchInsights}`);
      }
      return;
    }

    // At least one version selected: leftVersion is the primary
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
      book2Id:
        rightVersion && !syncMode ? rightBook?.id ?? undefined : undefined,
      chapter2: rightVersion && !syncMode ? rightChapter : undefined,
      testament2: rightVersion && !syncMode ? rightTestament : undefined,
      insights: insightOpen || undefined,
    });
    const desiredSearch = qs ? `?${qs}` : "";
    if (desiredSearch === "") return;
    if (typeof window === "undefined") return;
    if (window.location.search !== desiredSearch) {
      router.replace(`${pathname}${desiredSearch}`);
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
    pathname,
    globalLanguage,
    router,
  ]);

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
    syncMode ? leftBook?.id : rightBook?.id,
    syncMode ? leftChapter : rightChapter,
    fetchChapter,
  ]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setPanelWidth((w) => Math.min(Math.max(newWidth, 25), 75));
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
      setLeftBook(book);
      if (syncMode) setRightBook(book);
      setLeftChapter(1);
      if (syncMode) setRightChapter(1);
    },
    [syncMode]
  );

  const handleLeftChapterChange = useCallback(
    (chapter: number) => {
      setLeftChapter(chapter);
      if (syncMode) setRightChapter(chapter);
    },
    [syncMode]
  );

  const handleRightBookChange = useCallback((book: BibleBook) => {
    setRightBook(book);
    setRightChapter(1);
  }, []);

  const handleRightChapterChange = useCallback((chapter: number) => {
    setRightChapter(chapter);
  }, []);

  const setTestamentFilterAndAdjustBook = useCallback(
    (filter: TestamentFilter) => {
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
    [otBooks, ntBooks, leftBook, syncMode]
  );

  const setLeftTestamentFilterAndAdjust = useCallback(
    (filter: TestamentFilter) => {
      setLeftTestamentFilter(filter);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return;
      const currentInList = leftBook && list.some((b) => b.id === leftBook.id);
      if (!currentInList) {
        setLeftBook(list[0]);
        setLeftChapter(1);
      }
    },
    [otBooks, ntBooks, leftBook]
  );

  const setRightTestamentFilterAndAdjust = useCallback(
    (filter: TestamentFilter) => {
      setRightTestamentFilter(filter);
      const list = filter === "ot" ? otBooks : ntBooks;
      if (list.length === 0) return;
      const currentInList = rightBook && list.some((b) => b.id === rightBook.id);
      if (!currentInList) {
        setRightBook(list[0]);
        setRightChapter(1);
      }
    },
    [otBooks, ntBooks, rightBook]
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
