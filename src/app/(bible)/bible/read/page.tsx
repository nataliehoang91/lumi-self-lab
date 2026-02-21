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
} from "lucide-react";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { useReadFocus } from "@/components/Bible/ReadFocusContext";

const TRANSLATIONS = [
  { id: "vi", name: "VI", fullName: "Vietnamese Bible" },
  { id: "kjv", name: "KJV", fullName: "King James Version" },
  { id: "niv", name: "NIV", fullName: "New International Version" },
  { id: "zh", name: "中文", fullName: "Chinese Union Version" },
] as const;

type VersionId = (typeof TRANSLATIONS)[number]["id"];

interface BibleBook {
  id: string;
  nameEn: string;
  nameVi: string;
  nameZh: string | null;
  order: number;
  chapterCount: number;
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

export default function BibleReadPage() {
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
    if (leftVersion === null && rightVersion === null) {
      setLeftVersion(transId);
      return;
    }
    if (rightVersion === null) {
      if (transId === leftVersion) return;
      setRightVersion(transId);
      return;
    }
    if (transId === leftVersion) return;
    if (transId === rightVersion) return;
    setRightVersion(transId);
  };

  const chipSelectedStyle = (transId: VersionId) => {
    const base = "text-sm font-medium transition-all shrink-0 ";
    const unselected = "bg-card text-muted-foreground hover:bg-accent border border-border ";
    if (leftVersion !== transId && rightVersion !== transId) return base + unselected;
    switch (transId) {
      case "vi":
        return base + "bg-coral text-coral-foreground shadow-sm ";
      case "kjv":
        return base + "bg-sage text-sage-foreground shadow-sm ";
      case "niv":
        return base + "bg-sky-blue text-sky-blue-foreground shadow-sm ";
      case "zh":
        return base + "bg-second text-second-foreground shadow-sm ";
      default:
        return base + "bg-primary text-primary-foreground shadow-sm ";
    }
  };

  const fetchChapter = useCallback(
    async (bookId: string, chapter: number, lang: VersionId) => {
      const apiLang = lang === "vi" ? "vie" : lang;
      const res = await fetch(
        `/api/bible/read?bookId=${encodeURIComponent(bookId)}&chapter=${chapter}&lang=${apiLang}`
      );
      if (!res.ok) return null;
      return res.json() as Promise<ChapterContent>;
    },
    []
  );

  const { setReadFocusMode } = useReadFocus();

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
        className={`sticky z-40 bg-background/95 border-b border-border transition-all duration-300 ${focusMode ? "top-0" : "top-14"}`}
      >
        <div className="mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <h1 className="text-lg font-medium text-foreground shrink-0">Read</h1>
              {!focusMode && (
                <>
                  <span className="text-sm text-muted-foreground font-medium shrink-0 hidden sm:inline">
                    Compare:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {TRANSLATIONS.map((trans) => (
                      <button
                        key={trans.id}
                        onClick={() => handleVersionChipClick(trans.id)}
                        className={`px-3 py-1.5 rounded-lg ${chipSelectedStyle(trans.id)}`}
                      >
                        {trans.name}
                      </button>
                    ))}
                    {(leftVersion !== null || rightVersion !== null) && (
                      <button
                        onClick={() => {
                          setLeftVersion(null);
                          setRightVersion(null);
                        }}
                        className="px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-all shrink-0"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {!focusMode && rightVersion !== null && (
                <button
                  onClick={() => setSyncMode(!syncMode)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    syncMode
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {syncMode ? "Synced" : "Independent"}
                </button>
              )}
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`p-2 rounded-lg transition-all ${
                  focusMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
                title={focusMode ? "Exit focus (minimize)" : "Focus mode (expand)"}
              >
                {focusMode ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`transition-all duration-300 ${focusMode ? "py-8" : "py-6"}`}>
        <div className={`mx-auto ${focusMode ? "max-w-3xl px-6" : "max-w-7xl px-4 sm:px-6"}`}>

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
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

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
}: ReadingPanelProps) {
  const [showBookMenu, setShowBookMenu] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const versionName = version ? TRANSLATIONS.find((t) => t.id === version)?.fullName ?? version.toUpperCase() : "";
  const maxChapters = book?.chapterCount ?? 50;
  const isKJV = version === "kjv";

  if (version === null) {
    return (
      <div className="px-4 sm:px-6 md:px-8 flex items-center justify-center min-h-[40vh]">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="font-medium">Select a translation above</p>
          <p className="text-sm mt-2">Choose one or two versions to compare.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-8">
      {!focusMode && showControls && (
        <div className="mb-6 space-y-4">
          <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            {versionName}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <button
                onClick={() => setShowBookMenu(!showBookMenu)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground font-medium hover:bg-accent transition-all flex items-center gap-2"
              >
                {book?.nameEn ?? "Book"}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBookMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowBookMenu(false)} />
                  <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-48">
                    {books.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onBookChange(b);
                          setShowBookMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-accent transition-all ${
                          b.id === book?.id ? "bg-primary/10 text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        {b.nameEn}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowChapterMenu(!showChapterMenu)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-foreground font-medium hover:bg-accent transition-all flex items-center gap-2"
              >
                Chapter {chapter}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showChapterMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowChapterMenu(false)} />
                  <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-40">
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                        <button
                          key={ch}
                          onClick={() => {
                            onChapterChange(ch);
                            setShowChapterMenu(false);
                          }}
                          className={`px-2 py-1.5 rounded hover:bg-accent transition-all text-sm ${
                            ch === chapter ? "bg-primary text-primary-foreground font-medium" : "text-foreground"
                          }`}
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

      {!focusMode && !showControls && (
        <div className="mb-6">
          <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-2">
            {versionName}
          </div>
          <div className="text-2xl font-serif text-foreground">
            {book?.nameEn ?? ""} {chapter}
          </div>
        </div>
      )}

      <div
        className={`space-y-6 ${focusMode ? "text-xl leading-relaxed" : "text-base leading-relaxed"}`}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          </div>
        ) : !content || content.verses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content available for this chapter.</p>
            <p className="text-sm mt-2">Select another book or chapter.</p>
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
                    className={`${focusMode ? "text-base" : "text-sm"} text-muted-foreground font-medium shrink-0 transition-all ${
                      hoveredVerse === verse.number ? "text-primary" : ""
                    }`}
                  >
                    {verse.number}
                  </span>
                  <p
                    className={`font-serif text-foreground text-pretty ${focusMode ? "text-xl" : "text-base"} ${version === "vi" ? "font-vietnamese" : ""}`}
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
                      title="Copy verse"
                      onClick={(e) => {
                        e.stopPropagation();
                        void navigator.clipboard.writeText(text);
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-1.5 bg-card border border-border rounded hover:bg-accent transition-all"
                      title="Bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-1.5 bg-card border border-border rounded hover:bg-accent transition-all"
                      title="Add note"
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
