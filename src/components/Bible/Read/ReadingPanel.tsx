"use client";

import { BookOpen, Copy, Bookmark, StickyNote } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { TRANSLATIONS } from "./constants";
import { getOtBooks, getNtBooks, getBookDisplayName, normalizeVerseTextForDisplay } from "./utils";
import type { ReadingPanelProps } from "./types";

export function ReadingPanel({
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
          <div className="flex flex-row items-center gap-4 flex-wrap">
            {onTestamentFilterChange && (
              <Select
                value={testamentFilter}
                onValueChange={(v) => v && onTestamentFilterChange(v as "ot" | "nt")}
              >
                <SelectTrigger className="w-auto min-w-[8rem] rounded-lg border-second bg-second/5 h-10 shrink-0 hover:bg-second/10">
                  <SelectValue placeholder={t("readOldTestament")} />
                </SelectTrigger>
                <SelectContent align="start" className="rounded-lg">
                  <SelectItem value="ot">{t("readOldTestament")}</SelectItem>
                  <SelectItem value="nt">{t("readNewTestament")}</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Select
              value={book?.id ?? ""}
              onValueChange={(id) => {
                const b = panelFilteredBooks.find((x) => x.id === id);
                if (b) onBookChange(b);
              }}
            >
              <SelectTrigger className="w-auto min-w-[7rem] rounded-lg border-sage bg-sage/10 h-10 shrink-0 hover:bg-sage/20">
                <SelectValue placeholder={t("readBook")}>
                  {getBookDisplayName(book, version) || t("readBook")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start" className="rounded-lg max-h-80">
                {panelFilteredBooks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {getBookDisplayName(b, version)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(chapter)}
              onValueChange={(v) => onChapterChange(Number(v))}
            >
              <SelectTrigger className="w-auto min-w-[5rem] rounded-lg border-primary bg-primary/5 h-10 shrink-0 hover:bg-primary/10 dark:border-primary dark:bg-primary/5">
                <SelectValue placeholder={t("readChapterN", { n: 1 })} />
              </SelectTrigger>
              <SelectContent align="start" className="rounded-lg max-h-80 w-auto [&_[data-state]>span:first-child]:invisible">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                    <SelectItem
                      key={ch}
                      value={String(ch)}
                      className="min-w-9 min-h-9 flex items-center justify-center rounded-md py-0 px-2 data-[highlighted]:bg-accent"
                    >
                      {ch}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
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
            const text = normalizeVerseTextForDisplay(verse.text || "", version);
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
                        : "font-bible-english text-[1.1em]"
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
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title={t("readCopyVerse")}
                      onClick={(e) => {
                        e.stopPropagation();
                        void navigator.clipboard.writeText(text);
                      }}
                      className={cn("h-8 w-8 bg-card border-border rounded hover:bg-accent")}
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title={t("readBookmark")}
                      className={cn("h-8 w-8 bg-card border-border rounded hover:bg-accent")}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      title={t("readAddNote")}
                      className={cn("h-8 w-8 bg-card border-border rounded hover:bg-accent")}
                    >
                      <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
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
