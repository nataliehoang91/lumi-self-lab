"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getChecklistData, markPassageStudied } from "@/app/actions/bible/study";
import type { ChecklistBook } from "@/types/bible-study";

export function ChecklistPanel({
  listId,
  lang,
  onStudiedChange,
}: {
  listId: string;
  lang: string;
  onStudiedChange?: (delta: number) => void;
}) {
  const [books, setBooks] = useState<ChecklistBook[] | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getChecklistData(listId).then(setBooks);
  }, [listId]);

  const togglePassage = (book: ChecklistBook, passageId: string, current: boolean) => {
    const next = !current;
    // Optimistic update
    setBooks((prev) =>
      prev
        ? prev.map((b) =>
            b.bookId === book.bookId
              ? {
                  ...b,
                  passages: b.passages.map((p) =>
                    p.id === passageId ? { ...p, isStudied: next, studiedAt: next ? new Date() : null } : p
                  ),
                }
              : b
          )
        : prev
    );
    onStudiedChange?.(next ? 1 : -1);
    startTransition(async () => {
      await markPassageStudied({ passageId, listId, studied: next });
    });
  };

  if (!books) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">
        No chapters added yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {books.map((book) => {
        const done = book.passages.filter((p) => p.isStudied).length;
        const total = book.passages.length;
        const bookName = lang === "vi" ? book.bookNameVi : book.bookNameEn;

        return (
          <div key={book.bookId}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground">{bookName}</span>
              <span className="text-[10px] text-muted-foreground">
                <span className="text-primary font-semibold">{done}</span>/{total}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {book.passages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePassage(book, p.id, p.isStudied)}
                  title={`${p.chapter}${p.verseStart != null ? `:${p.verseStart}` : ""}${p.isStudied ? " · Studied" : ""}`}
                  className={cn(
                    "flex h-7 items-center gap-1 rounded-lg border px-1.5 text-[11px] font-medium transition-all",
                    p.isStudied ? "min-w-fit" : p.verseStart != null ? "min-w-10" : "w-7",
                    p.isStudied
                      ? "border-lime-400/60 bg-lime-50 text-lime-800 dark:border-lime-600/40 dark:bg-lime-950/20 dark:text-lime-300"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-lime-300/50 hover:text-foreground"
                  )}
                >
                  {p.isStudied && <Check className="h-3 w-3 shrink-0 text-[#5a6b1e] dark:text-lime-500" />}
                  {p.verseStart != null ? `${p.chapter}:${p.verseStart}` : p.chapter}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
