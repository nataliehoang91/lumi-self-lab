"use client";

import { useEffect, useMemo, useState } from "react";
import type { BibleStudyList, BibleStudyPassage } from "@/types/bible-study";
import type { BibleBook, ChapterContent } from "@/components/Bible/Read/types";
import type { ReadVersionId } from "@/app/(bible)/bible/read/params";
import { getChapterContent } from "@/app/actions/bible/read";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import { saveStudyPassages, toggleStudyPassage } from "@/app/actions/bible/study";

interface StudyReaderShellProps {
  list: BibleStudyList;
  books: BibleBook[];
  initialPassages: BibleStudyPassage[];
}

interface LoadedChapter {
  key: string; // `${bookId}:${chapter}:${version}`
  content: ChapterContent;
}

type LoadedChapterMap = Record<string, LoadedChapter>;

const chapterKey = (bookId: string, chapter: number, version: ReadVersionId | null) =>
  `${bookId}:${chapter}:${version ?? ""}`;

const VERSIONS: { id: ReadVersionId; label: string }[] = [
  { id: "vi", label: "VI (Vietnamese)" },
  { id: "niv", label: "NIV" },
  { id: "kjv", label: "KJV" },
  { id: "zh", label: "中文" },
];

export function StudyReaderShell({ list, books, initialPassages }: StudyReaderShellProps) {
  const [version, setVersion] = useState<ReadVersionId | null>("niv");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(books[0]?.id ?? null);
  const [loadedChapters, setLoadedChapters] = useState<LoadedChapterMap>({});
  const [passages, setPassages] = useState<BibleStudyPassage[]>(initialPassages);
  const [saving, setSaving] = useState(false);

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  const chaptersForBook = useMemo(
    () =>
      passages
        .filter((p) => p.bookId === selectedBook?.id)
        .map((p) => p.chapter)
        .sort((a, b) => a - b),
    [passages, selectedBook?.id],
  );

  const handleChapterClick = (chapter: number) => {
    if (!selectedBook || !version) return;

    const key = chapterKey(selectedBook.id, chapter, version);

    // Optimistically update selected passages
    setPassages((prev) => {
      const existing = prev.find(
        (p) =>
          p.listId === list.id &&
          p.bookId === selectedBook.id &&
          p.chapter === chapter &&
          p.verseStart === null &&
          p.verseEnd === null,
      );
      if (existing) {
        return prev.filter((p) => p.id !== existing.id);
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

    // Optimistically update loaded chapters:
    const isSelected = chaptersForBook.includes(chapter);
    if (isSelected) {
      // Deselect: remove from loaded map
      setLoadedChapters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      // Select: if not already loaded, fetch this chapter in the background
      setLoadedChapters((prev) => {
        if (prev[key]) return prev;
        return prev; // fetch will add when complete
      });

      void (async () => {
        const content = await getChapterContent(selectedBook.id, chapter, version);
        if (!content) return;
        setLoadedChapters((prev) => ({
          ...prev,
          [key]: { key, content },
        }));
      })();
    }

    // Fire-and-forget persistence (no impact on UX, errors are just logged)
    void (async () => {
      try {
        await toggleStudyPassage({
          listId: list.id,
          bookId: selectedBook.id,
          chapter,
        });
      } catch (err) {
        console.error("toggleStudyPassage failed (ignored for optimistic UI):", err);
      }
    })();
  };

  // When version changes, reload content for all currently selected passages.
  useEffect(() => {
    let cancelled = false;

    async function reload() {
      if (!version || passages.length === 0) {
        if (!cancelled) setLoadedChapters({});
        return;
      }
      const uniqueCombos = Array.from(
        new Map(
          passages.map((p) => [`${p.bookId}:${p.chapter}`, { bookId: p.bookId, chapter: p.chapter }]),
        ).values(),
      );
      const entries: LoadedChapterMap = {};
      const results = await Promise.all(
        uniqueCombos.map((combo) => getChapterContent(combo.bookId, combo.chapter, version)),
      );
      results.forEach((content, idx) => {
        if (!content) return;
        const { bookId, chapter } = uniqueCombos[idx];
        const k = chapterKey(bookId, chapter, version);
        entries[k] = { key: k, content };
      });
      if (!cancelled) setLoadedChapters(entries);
    }

    void reload();
    return () => {
      cancelled = true;
    };
  }, [version, passages]);

  return (
    <Container maxWidth="7xl" className="min-h-screen py-8 lg:px-0 px-4 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Study list</p>
        <h1 className="text-xl font-semibold text-foreground">{list.title}</h1>
        {list.description && (
          <p className="text-sm text-muted-foreground max-w-xl">{list.description}</p>
        )}
      </header>

      {/* Controls */}
      <section className="rounded-2xl border border-border bg-card/60 px-4 py-4 sm:px-5 sm:py-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Version */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
              Version
            </p>
            <div className="flex flex-wrap gap-2">
              {VERSIONS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVersion(v.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs border transition-colors",
                    version === v.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground/80 border-border hover:bg-muted",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Book */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
              Book
            </p>
            <select
              className="h-8 rounded-full border border-border bg-background px-3 text-xs text-foreground"
              value={selectedBookId ?? ""}
              onChange={(e) => setSelectedBookId(e.target.value || null)}
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chapter multiselect grid (saved to DB per click) */}
        {selectedBook && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
              Chapters in {selectedBook.nameEn}
            </p>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5 sm:gap-2">
              {Array.from({ length: selectedBook.chapterCount }, (_, idx) => {
                const ch = idx + 1;
                const active = chaptersForBook.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleChapterClick(ch)}
                    className={cn(
                      "h-8 rounded-xl text-xs font-medium border transition-colors",
                      active
                        ? "bg-foreground text-background border-foreground"
                        : "bg-muted/60 text-foreground border-transparent hover:bg-muted",
                    )}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-1 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {passages.length === 0
              ? "Select one or more chapters to add to this study."
              : `Selected ${passages.length} chapter${passages.length > 1 ? "s" : ""} for this study.`}
          </p>
          <button
            type="button"
            onClick={async () => {
              setSaving(true);
              try {
                await saveStudyPassages({
                  listId: list.id,
                  chapters: passages.map((p) => ({ bookId: p.bookId, chapter: p.chapter })),
                });
              } catch (err) {
                console.error("Failed to save study passages", err);
              } finally {
                setSaving(false);
              }
            }}
            disabled={passages.length === 0 || saving}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              passages.length === 0 || saving
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-foreground text-background hover:bg-foreground/90",
            )}
          >
            {saving ? "Saving…" : "Save list"}
          </button>
        </div>
      </section>

      {/* Content area */}
      <section className="pb-10">
        {Object.keys(loadedChapters).length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3 text-muted-foreground">
            <BookCircleIcon size="lg" className="mb-1" />
            <p className="text-sm font-medium text-foreground">
              Choose a version, book, and chapters to start studying.
            </p>
            <p className="text-xs max-w-sm">
              You can select multiple chapters from the same book and we&apos;ll lay them out below
              for your study session.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.values(loadedChapters)
              .sort((a, b) => {
                if (a.content.book.order === b.content.book.order) {
                  return a.content.chapter - b.content.chapter;
                }
                return a.content.book.order - b.content.book.order;
              })
              .map(({ key, content }) => (
              <article
                key={key}
                className="rounded-2xl border border-border bg-background/80 px-4 py-4 sm:px-6 sm:py-5 space-y-3"
              >
                <header className="flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-semibold text-foreground">
                    {content.book.nameEn} {content.chapter}
                  </h2>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    {version?.toUpperCase()}
                  </span>
                </header>
                <div className="space-y-2 text-sm leading-relaxed">
                  {content.verses.map((v) => (
                    <p key={v.number} className="flex gap-2 text-foreground">
                      <span className="w-6 shrink-0 text-[11px] font-medium text-muted-foreground mt-0.5">
                        {v.number}
                      </span>
                      <span className="flex-1">{v.text}</span>
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

