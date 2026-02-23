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
import { getChapterContent } from "@/app/(bible)/bible/read/actions";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import type { BibleBook } from "./types";
import type { ChapterContent } from "./types";
import type { VersionId } from "./constants";
import type { TestamentFilter } from "./constants";
import { getOtBooks, getNtBooks } from "./utils";

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

export function ReadProvider({
  children,
  initialBooks = [],
}: {
  children: ReactNode;
  initialBooks?: BibleBook[];
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
  const [syncMode, setSyncMode] = useState(() => getInitialParsed().sync);
  const [focusMode, setFocusMode] = useState(false);
  const [leftVersion, setLeftVersion] = useState<VersionId | null>(() => getInitialParsed().version1);
  const [rightVersion, setRightVersion] = useState<VersionId | null>(() => getInitialParsed().version2);
  const [leftBook, setLeftBook] = useState<BibleBook | null>(null);
  const [leftChapter, setLeftChapter] = useState(1);
  const [rightBook, setRightBook] = useState<BibleBook | null>(null);
  const [rightChapter, setRightChapter] = useState(1);
  const [leftContent, setLeftContent] = useState<ChapterContent | null>(null);
  const [rightContent, setRightContent] = useState<ChapterContent | null>(null);
  const [loadingLeft, setLoadingLeft] = useState(false);
  const [loadingRight, setLoadingRight] = useState(false);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);
  const [panelWidth, setPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [subNavBookOpen, setSubNavBookOpen] = useState(false);
  const [subNavChapterOpen, setSubNavChapterOpen] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>("ot");
  const [leftTestamentFilter, setLeftTestamentFilter] = useState<TestamentFilter>("ot");
  const [rightTestamentFilter, setRightTestamentFilter] = useState<TestamentFilter>("ot");

  const otBooks = getOtBooks(books);
  const ntBooks = getNtBooks(books);
  const filteredBooks = testamentFilter === "ot" ? otBooks : ntBooks;

  useEffect(() => {
    if (initialBooks.length > 0 && books.length === 0) {
      setBooks(initialBooks);
      if (initialBooks.length > 0) {
        setLeftBook((prev) => prev ?? initialBooks[0]);
        setRightBook((prev) => prev ?? initialBooks[0]);
      }
    }
  }, [initialBooks, books.length]);

  useEffect(() => {
    if (books.length > 0 && !leftBook) setLeftBook(books[0]);
    if (books.length > 0 && !rightBook) setRightBook(books[0]);
  }, [books, leftBook, rightBook]);

  // URL sync: init from URL and clean invalid version2
  useEffect(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const parsed = parseReadSearchParams(raw, globalLanguage);
    const qs = buildReadSearchParams({
      version1: parsed.version1,
      version2: parsed.version2,
      sync: parsed.sync,
    });
    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const desiredSearch = qs ? `?${qs}` : "";
    if (currentSearch !== desiredSearch) {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
    if (!initFromUrlRunOnce.current) {
      initFromUrlRunOnce.current = true;
      initialUrlSynced.current = true;
      return;
    }
    setLeftVersion(parsed.version1);
    setRightVersion(parsed.version2);
    setSyncMode(parsed.sync);
    initialUrlSynced.current = true;
  }, [searchParams, pathname, globalLanguage, router]);

  // Push URL when user changes version or sync
  useEffect(() => {
    if (!initialUrlSynced.current) return;
    const v1 = leftVersion ?? defaultVersionFromLanguage(globalLanguage);
    const qs = buildReadSearchParams({
      version1: v1,
      version2: rightVersion,
      sync: syncMode,
    });
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;
    const currentSearch = typeof window !== "undefined" ? window.location.search : "";
    const desiredSearch = qs ? `?${qs}` : "";
    if (currentSearch !== desiredSearch) {
      router.replace(nextUrl);
    }
  }, [leftVersion, rightVersion, syncMode, pathname, globalLanguage, router]);

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
    handleVersionChipClick,
    handleLeftBookChange,
    handleLeftChapterChange,
    handleRightBookChange,
    handleRightChapterChange,
    setTestamentFilterAndAdjustBook,
    setLeftTestamentFilterAndAdjust,
    setRightTestamentFilterAndAdjust,
    otBooks,
    ntBooks,
    filteredBooks,
  };

  return <ReadContext.Provider value={value}>{children}</ReadContext.Provider>;
}
