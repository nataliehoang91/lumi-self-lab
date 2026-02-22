"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Maximize2,
  Minimize2,
  ChevronDown,
  Copy,
  Bookmark,
  StickyNote,
  GripVertical,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

const TRANSLATIONS = [
  { id: "vi", name: "VI", fullName: "Vietnamese Bible" },
  { id: "niv", name: "NIV", fullName: "New International Version" },
  { id: "kjv", name: "KJV", fullName: "King James Version" },
  { id: "zh", name: "中文", fullName: "Chinese Union Version" },
] as const;

type VersionId = (typeof TRANSLATIONS)[number]["id"];

const OT_ORDER_MAX = 39; // order 1–39 = Old Testament, 40–66 = New Testament
type TestamentFilter = "ot" | "nt";

interface BibleBook {
  id: string;
  nameEn: string;
  nameVi: string;
  nameZh: string | null;
  order: number;
  chapterCount: number;
}

function getOtBooks(books: BibleBook[]) {
  return books.filter((b) => b.order <= OT_ORDER_MAX);
}
function getNtBooks(books: BibleBook[]) {
  return books.filter((b) => b.order > OT_ORDER_MAX);
}

interface VerseRow {
  number: number;
  text: string;
}

interface ChapterContent {
  book: BibleBook;
  chapter: number;
  verses: VerseRow[];
}

/** Book name in the language of the given version (for panel headers and per-panel dropdowns). */
function getBookDisplayName(book: BibleBook | null, version: VersionId): string {
  if (!book) return "";
  if (version === "vi") return book.nameVi;
  if (version === "zh") return book.nameZh ?? book.nameEn;
  return book.nameEn; // kjv, niv
}

/** Book label for the sub-nav selection when one or two versions are chosen (vi-niv → vi/en, kjv-niv → en, vi-zh → vi (zh)). */
function getBookLabelForSelection(
  book: BibleBook,
  left: VersionId | null,
  right: VersionId | null
): string {
  const onlyLeft = left !== null && right === null;
  const onlyRight = left === null && right !== null;
  if (onlyLeft) return getBookDisplayName(book, left);
  if (onlyRight) return getBookDisplayName(book, right);
  if (left === null || right === null) return book.nameEn;

  const isEn = (v: VersionId) => v === "kjv" || v === "niv";
  const leftEn = isEn(left);
  const rightEn = isEn(right);
  if (leftEn && rightEn) return book.nameEn;
  if (left === "vi" && right === "zh") return `${book.nameVi} (${book.nameZh ?? book.nameEn})`;
  if (left === "zh" && right === "vi") return `${book.nameVi} (${book.nameZh ?? book.nameEn})`;
  if ((left === "vi" && rightEn) || (right === "vi" && leftEn))
    return `${book.nameVi} / ${book.nameEn}`;
  if ((left === "zh" && rightEn) || (right === "zh" && leftEn))
    return book.nameZh ? `${book.nameEn} (${book.nameZh})` : book.nameEn;
  return book.nameEn;
}

export function BibleReadPage() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [syncMode, setSyncMode] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const [leftVersion, setLeftVersion] = useState<VersionId | null>(null);
  const [rightVersion, setRightVersion] = useState<VersionId | null>(null);

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

  useEffect(() => {
    fetch("/api/bible/books")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBooks(data);
          if (data.length > 0) {
            setLeftBook((prev) => prev ?? data[0]);
            setRightBook((prev) => prev ?? data[0]);
          }
        }
      })
      .catch(() => setBooks([]));
  }, []);

  const handleVersionChipClick = (transId: VersionId) => {
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
  };

  const chipSelectedStyle = (transId: VersionId) => {
    const base = "px-3 py-1.5 rounded-lg text-sm font-medium transition-all shrink-0 ";
    const isSelected = leftVersion === transId || rightVersion === transId;
    if (!isSelected) {
      const unselectedHover: Record<VersionId, string> = {
        vi: "bg-card text-muted-foreground border border-border hover:bg-coral/20 hover:border-coral/50 hover:text-coral-foreground ",
        kjv: "bg-card text-muted-foreground border border-border hover:bg-sage/20 hover:border-sage/50 hover:text-sage-foreground ",
        niv: "bg-card text-muted-foreground border border-border hover:bg-sky-blue/20 hover:border-sky-blue/50 hover:text-sky-blue-foreground ",
        zh: "bg-card text-muted-foreground border border-border hover:bg-tertiary/20 hover:border-tertiary/50 hover:text-tertiary-foreground ",
      };
      return base + unselectedHover[transId];
    }
    switch (transId) {
      case "vi":
        return base + "bg-coral text-coral-foreground shadow-sm ";
      case "kjv":
        return base + "bg-sage text-sage-foreground shadow-sm ";
      case "niv":
        return base + "bg-sky-blue text-sky-blue-foreground shadow-sm ";
      case "zh":
        return base + "bg-tertiary dark:bg-yellow-600 text-sky-blue-foreground shadow-sm ";
      default:
        return base + "bg-primary text-primary-foreground shadow-sm ";
    }
  };

  const fetchChapter = useCallback(async (bookId: string, chapter: number, lang: VersionId) => {
    const apiLang = lang === "vi" ? "vie" : lang;
    const res = await fetch(
      `/api/bible/read?bookId=${encodeURIComponent(bookId)}&chapter=${chapter}&lang=${apiLang}`
    );
    if (!res.ok) return null;
    return res.json() as Promise<ChapterContent>;
  }, []);

  const { setReadFocusMode } = useReadFocus();
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);

  useEffect(() => {
    setReadFocusMode(focusMode);
    return () => setReadFocusMode(false);
  }, [focusMode, setReadFocusMode]);

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
      setPanelWidth(Math.min(Math.max(newWidth, 25), 75));
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleLeftBookChange = (book: BibleBook) => {
    setLeftBook(book);
    if (syncMode) setRightBook(book);
    setLeftChapter(1);
    if (syncMode) setRightChapter(1);
  };

  const otBooks = getOtBooks(books);
  const ntBooks = getNtBooks(books);
  const filteredBooks = testamentFilter === "ot" ? otBooks : ntBooks;

  const setTestamentFilterAndAdjustBook = (filter: TestamentFilter) => {
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
  };

  const setLeftTestamentFilterAndAdjust = (filter: TestamentFilter) => {
    setLeftTestamentFilter(filter);
    const list = filter === "ot" ? otBooks : ntBooks;
    if (list.length === 0) return;
    const currentInList = leftBook && list.some((b) => b.id === leftBook.id);
    if (!currentInList) {
      setLeftBook(list[0]);
      setLeftChapter(1);
    }
  };

  const setRightTestamentFilterAndAdjust = (filter: TestamentFilter) => {
    setRightTestamentFilter(filter);
    const list = filter === "ot" ? otBooks : ntBooks;
    if (list.length === 0) return;
    const currentInList = rightBook && list.some((b) => b.id === rightBook.id);
    if (!currentInList) {
      setRightBook(list[0]);
      setRightChapter(1);
    }
  };

  const handleLeftChapterChange = (chapter: number) => {
    setLeftChapter(chapter);
    if (syncMode) setRightChapter(chapter);
  };

  const handleRightBookChange = (book: BibleBook) => {
    setRightBook(book);
    setRightChapter(1);
  };

  const handleRightChapterChange = (chapter: number) => {
    setRightChapter(chapter);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Sub-navbar: version, sync, focus/minimize - always visible so user can minimize after expand */}
      <header
        className={cn(
          "sticky z-40 bg-background/95 border-b border-border transition-all duration-300",
          focusMode ? "top-0" : "top-14"
        )}
      >
        <Container className="mx-auto px-4 sm:px-6 py-3">
          {/* Desktop layout: version chips + testament/book/chapter inline */}
          <div className="hidden md:flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <h1 className="text-sm font-medium text-foreground shrink-0">{t("readVersion")}</h1>
              <div className="flex items-center gap-1.5 flex-wrap">
                {TRANSLATIONS.map((trans) => (
                  <button
                    key={trans.id}
                    onClick={() => handleVersionChipClick(trans.id)}
                    className={chipSelectedStyle(trans.id)}
                  >
                    {trans.name}
                  </button>
                ))}
              </div>
            </div>
            {(leftVersion !== null || rightVersion !== null) && leftBook && (
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 h-[2.25rem] box-border">
                    {(["ot", "nt"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setTestamentFilterAndAdjustBook(filter)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm font-medium transition-all h-full border",
                          testamentFilter === filter
                            ? "bg-second/5 border-second text-foreground"
                            : "border-transparent text-muted-foreground hover:bg-second/20 hover:text-foreground"
                        )}
                      >
                        {filter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSubNavChapterOpen(false);
                        setSubNavBookOpen(!subNavBookOpen);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border border-sage bg-sage/10 text-foreground hover:bg-sage/20 transition-all flex items-center gap-1.5"
                    >
                      {getBookLabelForSelection(leftBook, leftVersion, rightVersion)}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {subNavBookOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setSubNavBookOpen(false)}
                          aria-hidden
                        />
                        <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-48 min-w-48">
                          <div className="sticky top-0 bg-muted/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            {testamentFilter === "ot"
                              ? t("readOldTestament")
                              : t("readNewTestament")}
                          </div>
                          {filteredBooks.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                handleLeftBookChange(b);
                                setSubNavBookOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-all",
                                b.id === leftBook.id
                                  ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                                  : "text-foreground"
                              )}
                            >
                              {getBookLabelForSelection(b, leftVersion, rightVersion)}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSubNavBookOpen(false);
                        setSubNavChapterOpen(!subNavChapterOpen);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border border-primary bg-primary/5 text-foreground hover:bg-primary/10 transition-all flex items-center gap-1.5 dark:border-primary dark:bg-primary/5"
                    >
                      {t("readChapterN", { n: leftChapter })}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {subNavChapterOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setSubNavChapterOpen(false)}
                          aria-hidden
                        />
                        <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-40 min-w-0 max-w-[min(14rem,calc(100vw-2rem))] p-2">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map(
                              (ch) => (
                                <button
                                  key={ch}
                                  type="button"
                                  onClick={() => {
                                    handleLeftChapterChange(ch);
                                    setSubNavChapterOpen(false);
                                  }}
                                  className={cn(
                                    "flex items-center justify-center min-w-9 min-h-9 rounded-md text-sm hover:bg-accent transition-all",
                                    ch === leftChapter
                                      ? "bg-primary text-primary-foreground font-medium"
                                      : "text-foreground"
                                  )}
                                >
                                  {ch}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {!focusMode && rightVersion !== null && (
                <button
                  onClick={() => setSyncMode(!syncMode)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    syncMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {syncMode ? t("readSynced") : t("readIndependent")}
                </button>
              )}
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  focusMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
                title={focusMode ? t("readExitFocus") : t("readFocusMode")}
              >
                {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile layout: version dropdown + testament/book/chapter stacked */}
          <div className="flex md:hidden flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted/50 px-3 py-2 text-sm font-medium min-h-9 transition-all"
                      aria-label={t("readVersion")}
                    >
                      <span className="truncate">{t("readVersion")}</span>
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[140px] rounded-md">
                    {TRANSLATIONS.map((trans) => (
                      <DropdownMenuItem
                        key={trans.id}
                        onClick={() => handleVersionChipClick(trans.id)}
                        className="gap-2"
                      >
                        {leftVersion === trans.id || rightVersion === trans.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="w-4" />
                        )}
                        {trans.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {(leftVersion !== null || rightVersion !== null) && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {leftVersion !== null && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm",
                          leftVersion === "vi" && "bg-coral text-coral-foreground",
                          leftVersion === "kjv" && "bg-sage text-sage-foreground",
                          leftVersion === "niv" && "bg-sky-blue text-sky-blue-foreground",
                          leftVersion === "zh" && "bg-tertiary text-tertiary-foreground dark:bg-yellow-600 dark:text-yellow-950"
                        )}
                      >
                        {TRANSLATIONS.find((tr) => tr.id === leftVersion)?.name ?? leftVersion}
                      </span>
                    )}
                    {rightVersion !== null && (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm",
                          rightVersion === "vi" && "bg-coral text-coral-foreground",
                          rightVersion === "kjv" && "bg-sage text-sage-foreground",
                          rightVersion === "niv" && "bg-sky-blue text-sky-blue-foreground",
                          rightVersion === "zh" && "bg-tertiary text-tertiary-foreground dark:bg-yellow-600 dark:text-yellow-950"
                        )}
                      >
                        {TRANSLATIONS.find((tr) => tr.id === rightVersion)?.name ?? rightVersion}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!focusMode && rightVersion !== null && (
                  <button
                    onClick={() => setSyncMode(!syncMode)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                      syncMode
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {syncMode ? t("readSynced") : t("readIndependent")}
                  </button>
                )}
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    focusMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                  title={focusMode ? t("readExitFocus") : t("readFocusMode")}
                >
                  {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {(leftVersion !== null || rightVersion !== null) && leftBook && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-md border border-second bg-second/5 text-foreground px-3 py-2 text-sm font-medium min-h-9 shrink-0 transition-all hover:bg-second/10"
                      aria-label={t("readOldTestament")}
                    >
                      <span className="truncate">
                        {testamentFilter === "ot" ? "Old" : "New"}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[120px] rounded-md">
                    <DropdownMenuItem
                      onClick={() => setTestamentFilterAndAdjustBook("ot")}
                      className="gap-2"
                    >
                      {testamentFilter === "ot" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                      Old
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTestamentFilterAndAdjustBook("nt")}
                      className="gap-2"
                    >
                      {testamentFilter === "nt" ? <Check className="h-4 w-4" /> : <span className="w-4" />}
                      New
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSubNavChapterOpen(false);
                      setSubNavBookOpen(!subNavBookOpen);
                    }}
                    className="px-3 py-2 rounded-md text-sm font-medium border border-sage bg-sage/10 text-foreground hover:bg-sage/20 transition-all flex items-center gap-1.5 h-9"
                  >
                    {getBookLabelForSelection(leftBook, leftVersion, rightVersion)}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {subNavBookOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSubNavBookOpen(false)}
                        aria-hidden
                      />
                      <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-lg z-20 max-h-80 overflow-y-auto w-48 min-w-48">
                        <div className="sticky top-0 bg-muted/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {testamentFilter === "ot"
                            ? t("readOldTestament")
                            : t("readNewTestament")}
                        </div>
                        {filteredBooks.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              handleLeftBookChange(b);
                              setSubNavBookOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-all",
                              b.id === leftBook.id
                                ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                                : "text-foreground"
                            )}
                          >
                            {getBookLabelForSelection(b, leftVersion, rightVersion)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSubNavBookOpen(false);
                      setSubNavChapterOpen(!subNavChapterOpen);
                    }}
                    className="px-3 py-2 rounded-md text-sm font-medium border border-primary bg-primary/5 text-foreground hover:bg-primary/10 transition-all flex items-center gap-1.5 h-9 dark:border-primary dark:bg-primary/5"
                    aria-label={t("readChapterN", { n: leftChapter })}
                  >
                    {leftChapter}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {subNavChapterOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSubNavChapterOpen(false)}
                        aria-hidden
                      />
                      <div className="absolute top-full mt-1 left-0 bg-card border border-border rounded-md shadow-lg z-20 max-h-80 overflow-y-auto w-40 min-w-0 max-w-[min(14rem,calc(100vw-2rem))] p-2">
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: leftBook.chapterCount }, (_, i) => i + 1).map(
                            (ch) => (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => {
                                  handleLeftChapterChange(ch);
                                  setSubNavChapterOpen(false);
                                }}
                                className={cn(
                                  "flex items-center justify-center min-w-9 min-h-9 rounded-md text-sm hover:bg-accent transition-all",
                                  ch === leftChapter
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "text-foreground"
                                )}
                              >
                                {ch}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Container>
      </header>

      <main className={cn("transition-all duration-300", focusMode ? "py-8" : "py-6")}>
        <div className={cn("mx-auto", focusMode ? "max-w-6xl px-6" : "max-w-7xl px-4 sm:px-6")}>
          <div className="flex gap-0 relative">
            <div
              className="transition-all duration-300 min-w-0"
              style={{ width: rightVersion !== null ? `${panelWidth}%` : "100%" }}
            >
              <ReadingPanel
                version={leftVersion}
                book={leftBook}
                chapter={leftChapter}
                onBookChange={handleLeftBookChange}
                onChapterChange={handleLeftChapterChange}
                content={leftContent}
                loading={loadingLeft}
                books={books}
                hoveredVerse={hoveredVerse}
                onVerseHover={setHoveredVerse}
                focusMode={focusMode}
                showControls={!syncMode || rightVersion === null}
                showBookChapterSelectors={rightVersion !== null && !syncMode}
                fontSize={fontSize}
                t={t}
                testamentFilter={syncMode ? testamentFilter : leftTestamentFilter}
                onTestamentFilterChange={!syncMode ? setLeftTestamentFilterAndAdjust : undefined}
              />
            </div>

            {rightVersion !== null && !focusMode && (
              <div
                className="w-px bg-border relative flex items-center justify-center cursor-col-resize hover:bg-primary transition-colors group shrink-0"
                onMouseDown={() => setIsDragging(true)}
              >
                <div className="absolute bg-muted group-hover:bg-primary/10 p-1.5 rounded-full transition-colors">
                  <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            )}

            {rightVersion !== null && (
              <div
                className="transition-all duration-300 min-w-0"
                style={{ width: `${100 - panelWidth}%` }}
              >
                <ReadingPanel
                  version={rightVersion}
                  book={syncMode ? leftBook : rightBook}
                  chapter={syncMode ? leftChapter : rightChapter}
                  onBookChange={handleRightBookChange}
                  onChapterChange={handleRightChapterChange}
                  content={rightContent}
                  loading={loadingRight}
                  books={books}
                  hoveredVerse={hoveredVerse}
                  onVerseHover={setHoveredVerse}
                  focusMode={focusMode}
                  showControls={!syncMode}
                  showBookChapterSelectors={!syncMode}
                  fontSize={fontSize}
                  t={t}
                  testamentFilter={syncMode ? testamentFilter : rightTestamentFilter}
                  onTestamentFilterChange={!syncMode ? setRightTestamentFilterAndAdjust : undefined}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

type FontSize = "small" | "medium" | "large";

interface ReadingPanelProps {
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
  /** When false (e.g. only one version), panel does not show book/chapter dropdowns; header has them. */
  showBookChapterSelectors: boolean;
  fontSize: FontSize;
  t: (key: string, params?: Record<string, number | string>) => string;
  testamentFilter: TestamentFilter;
  onTestamentFilterChange?: (filter: TestamentFilter) => void;
}

function ReadingPanel({
  version,
  book,
  chapter,
  onBookChange,
  onChapterChange,
  content,
  loading,
  books,
  hoveredVerse,
  onVerseHover,
  focusMode,
  showControls,
  showBookChapterSelectors,
  fontSize,
  t,
  testamentFilter,
  onTestamentFilterChange,
}: ReadingPanelProps) {
  const [showBookMenu, setShowBookMenu] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const versionName = version
    ? (TRANSLATIONS.find((tr) => tr.id === version)?.fullName ?? version.toUpperCase())
    : "";
  const maxChapters = book?.chapterCount ?? 50;
  const isKJV = version === "kjv";
  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const fontSizeClassFocus =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";

  const panelOtBooks = getOtBooks(books);
  const panelNtBooks = getNtBooks(books);
  const panelFilteredBooks = testamentFilter === "ot" ? panelOtBooks : panelNtBooks;

  if (version === null) {
    return (
      <div className="px-4 sm:px-6 md:px-8 flex items-center justify-center min-h-[40vh]">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">{t("readSelectTranslation")}</p>
          <p className="text-sm mt-2">{t("readChooseVersions")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      {!focusMode && showControls && showBookChapterSelectors && (
        <div className="mb-6 space-y-4">
          <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            {versionName}
          </div>
          {onTestamentFilterChange && (
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 w-fit h-10 box-border">
              {(["ot", "nt"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onTestamentFilterChange(filter)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-all h-full border",
                    testamentFilter === filter
                      ? "bg-second/5 border-second text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-second/20 hover:text-foreground"
                  )}
                >
                  {filter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBookMenu(!showBookMenu)}
                className="px-4 py-2 border border-sage bg-sage/10 rounded-lg text-foreground font-medium hover:bg-sage/20 transition-all flex items-center gap-2"
              >
                {getBookDisplayName(book, version) || t("readBook")}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBookMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowBookMenu(false)} aria-hidden />
                  <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-48">
                    <div className="sticky top-0 bg-muted/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                    </div>
                    {panelFilteredBooks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          onBookChange(b);
                          setShowBookMenu(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 hover:bg-accent transition-all",
                          b.id === book?.id
                            ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                            : "text-foreground"
                        )}
                      >
                        {getBookDisplayName(b, version)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowChapterMenu(!showChapterMenu)}
                className="px-4 py-2 border border-primary bg-primary/5 rounded-lg text-foreground font-medium hover:bg-primary/10 transition-all flex items-center gap-2 dark:border-primary dark:bg-primary/5"
              >
                {t("readChapterN", { n: chapter })}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showChapterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowChapterMenu(false)} aria-hidden />
                  <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-40 min-w-0 max-w-[min(14rem,calc(100vw-2rem))]">
                    <div className="grid grid-cols-5 gap-2 p-2">
                      {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => {
                            onChapterChange(ch);
                            setShowChapterMenu(false);
                          }}
                          className={cn(
                            "flex items-center justify-center min-w-9 min-h-9 rounded-md hover:bg-accent transition-all text-sm",
                            ch === chapter
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-foreground"
                          )}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {!focusMode && (!showControls || !showBookChapterSelectors) && (
        <div className="mb-6">
          <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-2">
            {versionName}
          </div>
          <div
            className={cn(
              "text-2xl text-foreground",
              version === "vi" ? "font-vietnamese" : "font-bible-english"
            )}
          >
            {getBookDisplayName(book, version)} {chapter}
          </div>
        </div>
      )}

      <div
        className={cn("space-y-6 leading-relaxed", focusMode ? fontSizeClassFocus : fontSizeClass)}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : !content || content.verses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t("readNoContent")}</p>
            <p className="text-sm mt-2">{t("readSelectAnother")}</p>
          </div>
        ) : (
          content.verses.map((verse) => {
            const text = verse.text || "";
            const showNotes = isKJV && hasKJVNotes(text);
            const parsed = showNotes ? parseKJVNotes(text) : null;
            return (
              <div
                key={verse.number}
                className="group relative"
                onMouseEnter={() => onVerseHover(verse.number)}
                onMouseLeave={() => onVerseHover(null)}
              >
                <div className="flex gap-4">
                  <span
                    className={cn(
                      focusMode ? "text-base" : "text-sm",
                      "text-muted-foreground font-medium shrink-0 transition-all",
                      hoveredVerse === verse.number && "text-primary"
                    )}
                  >
                    {verse.number}
                  </span>
                  <p
                    className={cn(
                      "text-foreground text-pretty",
                      version === "vi"
                        ? "font-vietnamese [font-size:inherit]"
                        : "font-bible-english [font-size:1.1em]"
                    )}
                  >
                    {parsed && parsed.notes.length > 0 ? (
                      <>
                        {parsed.parts.map((p, i) =>
                          typeof p === "number" ? (
                            <sup
                              key={i}
                              className="align-super text-[0.7em] font-medium text-muted-foreground"
                              title={parsed!.notes[p - 1]}
                            >
                              {p}
                            </sup>
                          ) : (
                            <span key={i}>{p}</span>
                          )
                        )}
                      </>
                    ) : (
                      text
                    )}
                  </p>
                </div>
                {!focusMode && hoveredVerse === verse.number && (
                  <div className="absolute -right-2 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 bg-card border border-border rounded hover:bg-accent transition-all"
                      title={t("readCopyVerse")}
                      onClick={(e) => {
                        e.stopPropagation();
                        void navigator.clipboard.writeText(text);
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-1.5 bg-card border border-border rounded hover:bg-accent transition-all"
                      title={t("readBookmark")}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-1.5 bg-card border border-border rounded hover:bg-accent transition-all"
                      title={t("readAddNote")}
                    >
                      <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
