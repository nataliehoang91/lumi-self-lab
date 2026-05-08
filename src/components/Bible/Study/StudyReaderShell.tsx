"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { BibleStudyList, BibleStudyPassage } from "@/types/bible-study";
import type { BibleBook, ChapterContent } from "@/components/Bible/Read/types";
import type { ReadVersionId } from "@/app/(bible)/bible/[lang]/read/params";
import { getChapterContent } from "@/app/actions/bible/read";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import { saveStudyPassages, toggleStudyPassage } from "@/app/actions/bible/study";
import { BookOpen, ChevronLeft, Trash2 } from "lucide-react";

interface StudyReaderShellProps {
  list: BibleStudyList;
  books: BibleBook[];
  initialPassages: BibleStudyPassage[];
}

interface LoadedChapter {
  key: string;
  content: ChapterContent;
}

type LoadedChapterMap = Record<string, LoadedChapter>;

const chapterKey = (bookId: string, chapter: number, version: ReadVersionId | null) =>
  `${bookId}:${chapter}:${version ?? ""}`;

const VERSIONS: { id: ReadVersionId; label: string; short: string }[] = [
  { id: "vi", label: "Vietnamese", short: "VI" },
  { id: "niv", label: "New International Version", short: "NIV" },
  { id: "kjv", label: "King James Version", short: "KJV" },
];

const OT_BOOKS_MAX_ORDER = 39;

export function StudyReaderShell({
  list,
  books,
  initialPassages,
}: StudyReaderShellProps) {
  const [version, setVersion] = useState<ReadVersionId>("niv");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(
    books[0]?.id ?? null
  );
  const [testament, setTestament] = useState<"ot" | "nt">("ot");
  const [loadedChapters, setLoadedChapters] = useState<LoadedChapterMap>({});
  const [passages, setPassages] = useState<BibleStudyPassage[]>(initialPassages);
  const [isSaving, startSaving] = useTransition();
  const passagesRef = useRef(passages);
  passagesRef.current = passages;

  const otBooks = useMemo(() => books.filter((b) => b.order <= OT_BOOKS_MAX_ORDER), [books]);
  const ntBooks = useMemo(() => books.filter((b) => b.order > OT_BOOKS_MAX_ORDER), [books]);
  const visibleBooks = testament === "ot" ? otBooks : ntBooks;

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) ?? null,
    [books, selectedBookId]
  );

  // When switching testament, auto-select first book in that testament
  useEffect(() => {
    const firstBook = testament === "ot" ? otBooks[0] : ntBooks[0];
    setSelectedBookId(firstBook?.id ?? null);
  }, [testament, otBooks, ntBooks]);

  const chaptersForBook = useMemo(
    () =>
      passages
        .filter((p) => p.bookId === selectedBook?.id)
        .map((p) => p.chapter)
        .sort((a, b) => a - b),
    [passages, selectedBook?.id]
  );

  const totalSelected = passages.length;

  const handleChapterClick = (chapter: number) => {
    if (!selectedBook) return;

    const key = chapterKey(selectedBook.id, chapter, version);
    const isSelected = chaptersForBook.includes(chapter);

    setPassages((prev) => {
      if (isSelected) {
        return prev.filter(
          (p) =>
            !(
              p.bookId === selectedBook.id &&
              p.chapter === chapter &&
              p.verseStart === null &&
              p.verseEnd === null
            )
        );
      }
      const now = new Date();
      return [
        ...prev,
        {
          id: key,
          listId: list.id,
          bookId: selectedBook.id,
          chapter,
          verseStart: null,
          verseEnd: null,
          createdAt: now,
          updatedAt: now,
        },
      ];
    });

    if (isSelected) {
      setLoadedChapters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      void (async () => {
        const content = await getChapterContent(selectedBook.id, chapter, version);
        if (!content) return;
        setLoadedChapters((prev) => ({ ...prev, [key]: { key, content } }));
      })();
    }

    void (async () => {
      try {
        await toggleStudyPassage({ listId: list.id, bookId: selectedBook.id, chapter });
      } catch (err) {
        console.error("toggleStudyPassage failed:", err);
      }
    })();
  };

  const handleClearBook = () => {
    if (!selectedBook) return;
    setPassages((prev) =>
      prev.filter(
        (p) =>
          !(p.bookId === selectedBook.id && p.verseStart === null && p.verseEnd === null)
      )
    );
    setLoadedChapters((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (k.startsWith(`${selectedBook.id}:`)) delete next[k];
      }
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    async function reload() {
      const current = passagesRef.current;
      if (current.length === 0) {
        if (!cancelled) setLoadedChapters({});
        return;
      }
      const uniqueCombos = Array.from(
        new Map(
          current.map((p) => [`${p.bookId}:${p.chapter}`, { bookId: p.bookId, chapter: p.chapter }])
        ).values()
      );
      const results = await Promise.all(
        uniqueCombos.map((combo) => getChapterContent(combo.bookId, combo.chapter, version))
      );
      const entries: LoadedChapterMap = {};
      results.forEach((content, idx) => {
        if (!content) return;
        const { bookId, chapter } = uniqueCombos[idx];
        const k = chapterKey(bookId, chapter, version);
        entries[k] = { key: k, content };
      });
      if (!cancelled) setLoadedChapters(entries);
    }
    void reload();
    return () => { cancelled = true; };
  }, [version]);

  const sortedChapters = Object.values(loadedChapters).sort((a, b) => {
    if (a.content.book.order === b.content.book.order) {
      return a.content.chapter - b.content.chapter;
    }
    return a.content.book.order - b.content.book.order;
  });

  return (
    <Container maxWidth="7xl" className="min-h-screen px-4 py-6 lg:px-0">
      {/* Header */}
      <header className="mb-6">
        <p className="text-muted-foreground mb-1 text-xs tracking-[0.18em] uppercase">
          Study list
        </p>
        <h1 className="text-foreground text-2xl font-semibold">{list.title}</h1>
        {list.description && (
          <p className="text-muted-foreground mt-1 max-w-xl text-sm">{list.description}</p>
        )}
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Sidebar ── */}
        <aside className="shrink-0 lg:w-64 xl:w-72">
          <div
            className="border-border bg-card/70 space-y-5 rounded-2xl border p-4
              backdrop-blur"
          >
            {/* Version picker */}
            <div>
              <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
                Version
              </p>
              <div className="flex flex-col gap-1.5">
                {VERSIONS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVersion(v.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                      version === v.id
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-foreground/80 border-border hover:bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-8 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                        version === v.id
                          ? "bg-background/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {v.short}
                    </span>
                    <span className="font-medium">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-border h-px" />

            {/* Testament toggle */}
            <div>
              <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
                Testament
              </p>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
                {(["ot", "nt"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTestament(t)}
                    className={cn(
                      "rounded-lg py-1.5 text-xs font-medium transition-all",
                      testament === t
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t === "ot" ? "Old" : "New"}
                  </button>
                ))}
              </div>
            </div>

            {/* Book list */}
            <div>
              <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
                Book
              </p>
              <div className="max-h-64 space-y-0.5 overflow-y-auto pr-1 lg:max-h-80">
                {visibleBooks.map((b) => {
                  const count = passages.filter(
                    (p) => p.bookId === b.id && p.verseStart === null
                  ).length;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBookId(b.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                        selectedBookId === b.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      <span>{b.nameEn}</span>
                      {count > 0 && (
                        <span
                          className={cn(
                            "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                            selectedBookId === b.id
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted-foreground/20 text-muted-foreground"
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-border h-px" />

            {/* Summary & save */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs">
                  {totalSelected === 0
                    ? "No chapters selected"
                    : `${totalSelected} chapter${totalSelected !== 1 ? "s" : ""} selected`}
                </p>
                {totalSelected > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPassages([]);
                      setLoadedChapters({});
                    }}
                    className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  startSaving(async () => {
                    try {
                      await saveStudyPassages({
                        listId: list.id,
                        chapters: passages.map((p) => ({
                          bookId: p.bookId,
                          chapter: p.chapter,
                        })),
                      });
                    } catch (err) {
                      console.error("Failed to save study passages", err);
                    }
                  });
                }}
                disabled={totalSelected === 0 || isSaving}
                className={cn(
                  "w-full rounded-xl py-2 text-xs font-semibold transition-colors",
                  totalSelected === 0 || isSaving
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-foreground text-background hover:bg-foreground/90"
                )}
              >
                {isSaving ? "Saving…" : "Save list"}
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main panel ── */}
        <main className="min-w-0 flex-1">
          {/* Chapter grid for selected book */}
          {selectedBook && (
            <div
              className="border-border bg-card/50 mb-6 rounded-2xl border p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {selectedBook.nameEn}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {chaptersForBook.length > 0
                      ? `${chaptersForBook.length} chapter${chaptersForBook.length !== 1 ? "s" : ""} selected`
                      : "Tap chapters to add them to this study"}
                  </p>
                </div>
                {chaptersForBook.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearBook}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear book
                  </button>
                )}
              </div>
              <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:grid-cols-12">
                {Array.from({ length: selectedBook.chapterCount }, (_, idx) => {
                  const ch = idx + 1;
                  const active = chaptersForBook.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleChapterClick(ch)}
                      className={cn(
                        "h-8 rounded-xl border text-xs font-medium transition-all",
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                          : "bg-muted/60 text-foreground hover:bg-primary/10 hover:border-primary/30 border-transparent"
                      )}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reading area */}
          {sortedChapters.length === 0 ? (
            <div
              className="text-muted-foreground flex min-h-[40vh] flex-col items-center
                justify-center gap-3 rounded-2xl border border-dashed border-border text-center p-8"
            >
              <BookCircleIcon size="lg" className="mb-1 opacity-50" />
              <p className="text-foreground text-sm font-medium">
                Select chapters to start studying
              </p>
              <p className="max-w-xs text-xs">
                Choose a version and tap chapters from any book. They&apos;ll appear
                here side by side.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group chapters by book */}
              {(() => {
                const groups: { bookId: string; bookNameEn: string; order: number; chapters: typeof sortedChapters }[] = [];
                for (const ch of sortedChapters) {
                  const last = groups[groups.length - 1];
                  if (last && last.bookId === ch.content.book.id) {
                    last.chapters.push(ch);
                  } else {
                    groups.push({
                      bookId: ch.content.book.id,
                      bookNameEn: ch.content.book.nameEn,
                      order: ch.content.book.order,
                      chapters: [ch],
                    });
                  }
                }
                return groups.map((group) => (
                  <section key={group.bookId}>
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen className="text-primary h-4 w-4" />
                      <h2 className="text-foreground text-sm font-semibold">
                        {group.bookNameEn}
                      </h2>
                      <span className="text-muted-foreground text-xs">
                        · {group.chapters.length} chapter{group.chapters.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {group.chapters.map(({ key, content }) => (
                        <article
                          key={key}
                          className="border-border bg-background/80 rounded-2xl border"
                        >
                          <header
                            className="border-border/60 from-primary/5 flex items-center
                              justify-between gap-3 border-b bg-gradient-to-r to-transparent
                              px-5 py-3"
                          >
                            <h3 className="text-foreground text-sm font-semibold">
                              Chapter {content.chapter}
                            </h3>
                            <div className="flex items-center gap-2">
                              {content.sectionTitle?.trim() && (
                                <span className="text-muted-foreground text-xs italic">
                                  {content.sectionTitle.trim()}
                                </span>
                              )}
                              <span
                                className="text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase"
                              >
                                {version.toUpperCase()}
                              </span>
                            </div>
                          </header>
                          <div className="space-y-2 px-5 py-4 text-sm leading-relaxed">
                            {content.verses.map((v) => (
                              <p key={v.number} className="text-foreground flex gap-2">
                                <span
                                  className="text-muted-foreground mt-0.5 w-5 shrink-0 text-[11px] font-medium"
                                >
                                  {v.number}
                                </span>
                                <span className="flex-1">{v.text}</span>
                              </p>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ));
              })()}
            </div>
          )}
        </main>
      </div>
    </Container>
  );
}
