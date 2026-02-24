"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, Copy, Bookmark, StickyNote, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <div className="flex flex-row items-center gap-4 flex-wrap">
            {onTestamentFilterChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 rounded-lg border border-second bg-second/5 text-foreground h-10 shrink-0 hover:bg-second/10"
                    aria-label={t("readOldTestament")}
                  >
                    <span className="truncate">
                      {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[140px] rounded-lg">
                  <DropdownMenuItem onClick={() => onTestamentFilterChange("ot")} className="gap-2">
                    {testamentFilter === "ot" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    {t("readOldTestament")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onTestamentFilterChange("nt")} className="gap-2">
                    {testamentFilter === "nt" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="w-4" />
                    )}
                    {t("readNewTestament")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowBookMenu(!showBookMenu)}
                className={cn(
                  "rounded-lg border border-sage bg-sage/10 text-foreground font-medium hover:bg-sage/20 gap-2"
                )}
              >
                {getBookDisplayName(book, version) || t("readBook")}
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showBookMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowBookMenu(false)}
                    aria-hidden
                  />
                  <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-48">
                    <div className="sticky top-0 bg-muted/80 px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {testamentFilter === "ot" ? t("readOldTestament") : t("readNewTestament")}
                    </div>
                    {panelFilteredBooks.map((b) => (
                      <Button
                        key={b.id}
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          onBookChange(b);
                          setShowBookMenu(false);
                        }}
                        className={cn(
                          "w-full justify-start px-4 py-2 hover:bg-accent transition-all",
                          b.id === book?.id
                            ? "bg-sage/20 text-sage-dark font-medium dark:text-sage"
                            : "text-foreground"
                        )}
                      >
                        {getBookDisplayName(b, version)}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowChapterMenu(!showChapterMenu)}
                className={cn(
                  "rounded-lg border border-primary bg-primary/5 text-foreground font-medium hover:bg-primary/10 gap-2 dark:border-primary dark:bg-primary/5"
                )}
              >
                {t("readChapterN", { n: chapter })}
                <ChevronDown className="w-4 h-4" />
              </Button>
              {showChapterMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowChapterMenu(false)}
                    aria-hidden
                  />
                  <div className="absolute top-full mt-2 left-0 bg-card border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto w-40 min-w-0 max-w-[min(14rem,calc(100vw-2rem))]">
                    <div className="grid grid-cols-5 gap-2 p-2">
                      {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                        <Button
                          key={ch}
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onChapterChange(ch);
                            setShowChapterMenu(false);
                          }}
                          className={cn(
                            "min-w-9 min-h-9 rounded-md hover:bg-accent transition-all text-sm",
                            ch === chapter
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-foreground"
                          )}
                        >
                          {ch}
                        </Button>
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
