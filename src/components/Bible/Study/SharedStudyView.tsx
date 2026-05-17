"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BibleStudyList, BibleStudyPassage } from "@/types/bible-study";
import type { BibleBook, ChapterContent } from "@/components/Bible/Read/types";
import type { ReadVersionId } from "@/app/(bible)/bible/[lang]/read/params";
import { getChapterContent } from "@/app/actions/bible/read";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import { BookOpen, Copy, Link2, Tag } from "lucide-react";

interface SharedStudyViewProps {
  list: BibleStudyList;
  passages: BibleStudyPassage[];
  books: BibleBook[];
}

type LoadedChapter = { key: string; content: ChapterContent };
type LoadedChapterMap = Record<string, LoadedChapter>;

const VERSIONS: { id: ReadVersionId; label: string; short: string }[] = [
  { id: "vi", label: "Vietnamese", short: "VI" },
  { id: "niv", label: "New International Version", short: "NIV" },
  { id: "kjv", label: "King James Version", short: "KJV" },
];

const OT_MAX = 39;

const chapterKey = (bookId: string, chapter: number, version: ReadVersionId) =>
  `${bookId}:${chapter}:${version}`;

export function SharedStudyView({ list, passages, books }: SharedStudyViewProps) {
  const [version, setVersion] = useState<ReadVersionId>("niv");
  const [loadedChapters, setLoadedChapters] = useState<LoadedChapterMap>({});
  const [copied, setCopied] = useState(false);
  const passagesRef = useRef(passages);

  const otBooks = useMemo(() => books.filter((b) => b.order <= OT_MAX), [books]);
  const ntBooks = useMemo(() => books.filter((b) => b.order > OT_MAX), [books]);

  const uniqueBooks = new Set(passages.map((p) => p.bookId)).size;
  const otCount = passages.filter((p) => {
    const b = books.find((bk) => bk.id === p.bookId);
    return b && b.order <= OT_MAX;
  }).length;
  const ntCount = passages.length - otCount;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (passages.length === 0) { setLoadedChapters({}); return; }
      const combos = Array.from(
        new Map(passages.map((p) => [`${p.bookId}:${p.chapter}`, { bookId: p.bookId, chapter: p.chapter }])).values()
      );
      const results = await Promise.all(combos.map((c) => getChapterContent(c.bookId, c.chapter, version)));
      const entries: LoadedChapterMap = {};
      results.forEach((content, i) => {
        if (!content) return;
        const { bookId, chapter } = combos[i];
        const k = chapterKey(bookId, chapter, version);
        entries[k] = { key: k, content };
      });
      if (!cancelled) setLoadedChapters(entries);
    }
    void load();
    return () => { cancelled = true; };
  }, [version, passages]);

  const sortedChapters = Object.values(loadedChapters).sort((a, b) =>
    a.content.book.order !== b.content.book.order
      ? a.content.book.order - b.content.book.order
      : a.content.chapter - b.content.chapter
  );

  const handleCopyAll = () => {
    const lines: string[] = [`# ${list.title}`, ""];
    for (const { content } of sortedChapters) {
      lines.push(`## ${content.book.nameEn} ${content.chapter}`);
      for (const v of content.verses) lines.push(`${v.number}. ${v.text}`);
      lines.push("");
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="7xl" className="px-4 py-8 lg:px-0">
        {/* Header */}
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground mb-1 text-xs tracking-[0.18em] uppercase">Shared study list</p>
            <h1 className="text-foreground text-2xl font-semibold">{list.title}</h1>
            {list.description && (
              <p className="text-muted-foreground mt-1 max-w-xl text-sm">{list.description}</p>
            )}
            {list.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {list.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    <Tag className="h-2.5 w-2.5" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyAll}
              disabled={sortedChapters.length === 0}
              title="Copy all text"
              className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors disabled:opacity-30"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link"
              className={cn("rounded-lg p-2 transition-colors", copied ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Stats bar */}
        {passages.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
            <span>{uniqueBooks} {uniqueBooks === 1 ? "book" : "books"}</span>
            <span>{passages.length} chapters</span>
            <span>OT {otCount} · NT {ntCount}</span>
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sidebar */}
          <aside className="shrink-0 lg:w-64 xl:w-72">
            <div className="border-border bg-card/70 space-y-5 rounded-2xl border p-4 backdrop-blur">
              {/* Version selector */}
              <div>
                <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">Version</p>
                <div className="flex flex-col gap-1.5">
                  {VERSIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVersion(v.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-xs transition-colors",
                        version === v.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-background text-foreground/80 border-border hover:bg-muted"
                      )}
                    >
                      <span className={cn("flex h-5 w-8 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                        version === v.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>
                        {v.short}
                      </span>
                      <span className="font-medium">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-border h-px" />

              {/* Books in list */}
              <div>
                <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">Contents</p>
                <div className="max-h-80 space-y-0.5 overflow-y-auto pr-1">
                  {(["ot", "nt"] as const).map((t) => {
                    const booksInTestament = (t === "ot" ? otBooks : ntBooks).filter((b) =>
                      passages.some((p) => p.bookId === b.id)
                    );
                    if (booksInTestament.length === 0) return null;
                    return (
                      <div key={t} className="mb-2">
                        <p className="text-muted-foreground mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider">
                          {t === "ot" ? "Old Testament" : "New Testament"}
                        </p>
                        {booksInTestament.map((b) => {
                          const count = passages.filter((p) => p.bookId === b.id).length;
                          return (
                            <div key={b.id} className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-foreground/80">
                              <span>{b.nameEn}</span>
                              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-muted px-1 text-[10px] font-semibold text-muted-foreground">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main reading area */}
          <main className="min-w-0 flex-1">
            {sortedChapters.length === 0 ? (
              <div className="text-muted-foreground flex min-h-[40vh] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
                <BookCircleIcon size="lg" className="mb-1 opacity-50" />
                <p className="text-foreground text-sm font-medium">Loading chapters…</p>
                <p className="max-w-xs text-xs">The study content is being prepared.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const groups: { bookId: string; bookNameEn: string; order: number; chapters: typeof sortedChapters }[] = [];
                  for (const ch of sortedChapters) {
                    const last = groups[groups.length - 1];
                    if (last && last.bookId === ch.content.book.id) last.chapters.push(ch);
                    else groups.push({ bookId: ch.content.book.id, bookNameEn: ch.content.book.nameEn, order: ch.content.book.order, chapters: [ch] });
                  }
                  return groups.map((group) => (
                    <section key={group.bookId}>
                      <div className="mb-3 flex items-center gap-2">
                        <BookOpen className="text-primary h-4 w-4" />
                        <h2 className="text-foreground text-sm font-semibold">{group.bookNameEn}</h2>
                        <span className="text-muted-foreground text-xs">· {group.chapters.length} chapter{group.chapters.length !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="space-y-4">
                        {group.chapters.map(({ key, content }) => (
                          <article key={key} className="border-border bg-background/80 rounded-2xl border">
                            <header className="border-border/60 from-primary/5 flex items-center justify-between gap-3 border-b bg-gradient-to-r to-transparent px-5 py-3">
                              <div className="flex items-center gap-2">
                                <h3 className="text-foreground text-sm font-semibold">Chapter {content.chapter}</h3>
                                {content.sectionTitle?.trim() && (
                                  <span className="text-muted-foreground text-xs italic">{content.sectionTitle.trim()}</span>
                                )}
                              </div>
                              <span className="text-muted-foreground text-[10px] font-semibold tracking-[0.14em] uppercase">
                                {version.toUpperCase()}
                              </span>
                            </header>
                            <div className="space-y-0.5 px-5 py-4">
                              {content.verses.map((verse) => (
                                <div key={verse.number} className="group flex gap-2 rounded-lg px-2 py-0.5 -mx-2 hover:bg-muted/40">
                                  <span className="text-muted-foreground mt-0.5 w-5 shrink-0 text-[11px] font-medium select-none">
                                    {verse.number}
                                  </span>
                                  <span className="text-foreground text-sm leading-relaxed">{verse.text}</span>
                                </div>
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
    </div>
  );
}
