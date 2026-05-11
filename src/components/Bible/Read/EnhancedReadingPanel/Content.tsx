"use client";

import { useEffect, useState, useTransition } from "react";
import { Copy, BookmarkPlus, StickyNote, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { normalizeVerseTextForDisplay } from "../utils";
import type { ChapterContent, BibleBook } from "../types";
import type { VersionId } from "../constants";
import type { TFunction } from "../types";
import type { FontSize } from "@/components/Bible/BibleAppContext";
import type { ReadFontSize } from "../readTextConstants";
import { READ_FONT_SIZE_REM, READ_FONT_FACES_EN, READ_FONT_FACES_VI } from "../readTextConstants";
import { BookCircleIcon } from "../../GeneralComponents/book-circle-icon";
import { useAuth } from "@clerk/nextjs";
import { getStudyListsForCurrentUser, toggleStudyPassage } from "@/app/actions/bible/study";
import type { BibleStudyListWithCount } from "@/types/bible-study";
import { useRouter } from "next/navigation";

export interface ReadingPanelContentProps {
  version: VersionId;
  content: ChapterContent | null;
  book: BibleBook | null;
  focusMode: boolean;
  fontSize: FontSize;
  readFontSize?: ReadFontSize;
  readFontFace?: string;
  hoveredVerse: number | null;
  onVerseHover: (verse: number | null) => void;
  /** Scroll target (e.g. first highlighted verse). */
  targetVerse: number | null;
  /** Verse numbers to highlight. When set, overrides single-verse highlight. */
  highlightedVerses?: number[];
  onVerseNumberClick?: (verse: number) => void;
  t: TFunction;
}

function VerseBookmarkDropdown({
  book,
  chapter,
  verseNum,
  onOpenChange,
}: {
  book: BibleBook;
  chapter: number;
  verseNum: number;
  onOpenChange: (open: boolean) => void;
}) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<BibleStudyListWithCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  if (!isSignedIn) return null;

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange(isOpen);
    if (isOpen && lists.length === 0) {
      setLoading(true);
      const result = await getStudyListsForCurrentUser();
      setLists(result);
      setLoading(false);
    }
  };

  const handleAdd = (listId: string) => {
    startTransition(async () => {
      const result = await toggleStudyPassage({
        listId,
        bookId: book.id,
        chapter,
        verseStart: verseNum,
        verseEnd: verseNum,
      });
      setAdded((prev) => ({ ...prev, [listId]: result.added }));
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Save verse to study list"
          className="border-border bg-card hover:bg-accent h-8 w-8 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkPlus className="text-muted-foreground h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel className="text-xs">
          Save {book.nameEn} {chapter}:{verseNum} to…
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        ) : lists.length === 0 ? (
          <DropdownMenuItem onClick={() => { setOpen(false); router.push("/bible/en/study"); }} className="text-xs">
            Create a study list first →
          </DropdownMenuItem>
        ) : (
          <>
            {lists.map((list) => (
              <DropdownMenuItem
                key={list.id}
                onClick={() => handleAdd(list.id)}
                className="flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{list.title}</p>
                  <p className="text-muted-foreground">{list.passageCount} saved</p>
                </div>
                {added[list.id] !== undefined && (
                  added[list.id]
                    ? <Check className="ml-2 h-3.5 w-3.5 shrink-0 text-green-500" />
                    : <span className="ml-2 text-[10px] text-muted-foreground">Removed</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setOpen(false); router.push("/bible/en/study"); }} className="text-xs text-muted-foreground">
              Manage study lists →
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const fontSizeToClass = (fontSize: FontSize, focus: boolean) => {
  if (focus) {
    return fontSize === "small"
      ? "text-base"
      : fontSize === "large"
        ? "text-xl"
        : "text-lg";
  }
  return fontSize === "small"
    ? "text-sm"
    : fontSize === "large"
      ? "text-lg"
      : "text-base";
};

/**
 * Content area: verse list or empty state when no content.
 */
export function ReadingPanelContent({
  version,
  content,
  book,
  focusMode,
  fontSize,
  readFontSize,
  readFontFace,
  hoveredVerse,
  onVerseHover,
  targetVerse,
  highlightedVerses = [],
  onVerseNumberClick,
  t,
}: ReadingPanelContentProps) {
  const isKJV = version === "kjv";
  const useReadScale = readFontSize != null;
  const fontSizeClass = useReadScale ? undefined : fontSizeToClass(fontSize, false);
  const fontSizeClassFocus = useReadScale ? undefined : fontSizeToClass(fontSize, true);
  const readRem = useReadScale ? READ_FONT_SIZE_REM[readFontSize] : undefined;
  const readRemFocus = useReadScale
    ? Math.min(READ_FONT_SIZE_REM[readFontSize] + 0.125, 1.5)
    : undefined;
  const useReadFont =
    readFontSize != null || readFontFace != null;
  const fontFaces = version === "vi" ? READ_FONT_FACES_VI : READ_FONT_FACES_EN;
  const resolvedFace = readFontFace
    ? fontFaces.find((f) => f.id === readFontFace)
    : undefined;
  const faceOption = useReadFont ? (resolvedFace ?? fontFaces[0]) : undefined;
  const faceClassName = faceOption?.className;
  const faceStyle =
    faceOption?.fontFamily && !faceClassName
      ? { fontFamily: faceOption.fontFamily }
      : undefined;
  const highlightSet = highlightedVerses.length > 0 ? new Set(highlightedVerses) : null;
  // Track which verse has its bookmark dropdown open so toolbar stays visible when mouse leaves
  const [openDropdownVerse, setOpenDropdownVerse] = useState<number | null>(null);

  // Auto-scroll to target verse after content is in the DOM (run when content + targetVerse available)
  useEffect(() => {
    if (!targetVerse || typeof window === "undefined" || !content?.verses?.length) return;
    const hasVerse = content.verses.some((v) => v.number === targetVerse);
    if (!hasVerse) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`verse-${targetVerse}`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [targetVerse, content?.verses]);

  if (!content || content.verses.length === 0) {
    return (
      <div
        className="flex min-h-[calc(100vh-14rem)] w-full items-center justify-center
          py-12"
      >
        <div className="text-muted-foreground text-center">
          <BookCircleIcon size="lg" className="mx-auto mb-4" />
          <p>{t("readNoContent")}</p>
          <p className="mt-2 text-sm">{t("readSelectAnother")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-3 leading-relaxed",
        !useReadScale && (focusMode ? fontSizeClassFocus : fontSizeClass),
        faceClassName
      )}
      style={{
        ...faceStyle,
        ...(useReadScale
          ? { fontSize: `${focusMode ? readRemFocus : readRem}rem` }
          : undefined),
      }}
    >
      {content.sectionTitle?.trim() ? (
        <p className="text-muted-foreground mb-2 text-sm font-medium italic">
          {content.sectionTitle.trim()}
        </p>
      ) : null}
      {content.verses.map((verse) => {
        const text = normalizeVerseTextForDisplay(verse.text || "", version);
        const showNotes = isKJV && hasKJVNotes(text);
        const parsed = showNotes ? parseKJVNotes(text) : null;
        const verseNum = Number(verse.number);
        const isHovered = hoveredVerse === verseNum;
        const isTarget = highlightSet
          ? highlightSet.has(verseNum)
          : targetVerse === verseNum;

        const isDropdownOpen = openDropdownVerse === verseNum;
        const showToolbar = (isHovered || isDropdownOpen) && !focusMode;

        return (
          <div
            key={verse.number}
            id={`verse-${verse.number}`}
            className="group relative scroll-mt-28 transition-colors duration-300"
            onMouseEnter={() => onVerseHover(verse.number)}
            onMouseLeave={() => { if (!isDropdownOpen) onVerseHover(null); }}
          >
            <div className="flex items-start gap-3">
              {onVerseNumberClick ? (
                <button
                  type="button"
                  onClick={() => onVerseNumberClick(Number(verse.number))}
                  aria-label={`Verse ${verse.number}`}
                  aria-pressed={isTarget}
                  className={cn(
                    `mt-0.5 inline-flex min-w-7 shrink-0 items-start justify-center
                      rounded-md px-1.5 py-1 font-medium tabular-nums transition-colors`,
                    focusMode ? "text-md" : "text-sm",
                    `bg-muted/80 text-primary-600 focus:ring-primary/40 focus:ring-2
                      focus:outline-none`,
                    isHovered &&
                      !isTarget &&
                      "bg-primary/10 text-primary dark:text-primary-dark",
                    isTarget && "bg-second-600 dark:bg-second-700 text-white"
                  )}
                >
                  {verse.number}
                </button>
              ) : (
                <span
                  className={cn(
                    `bg-muted/80 mt-1 inline-flex min-w-7 shrink-0 items-start
                      justify-center rounded-md px-1.5 py-1 font-medium tabular-nums
                      transition-colors`,
                    focusMode ? "text-sm" : "text-xs",
                    "text-primary-dark",
                    isHovered && !isTarget && "bg-primary/10 text-primary-dark",
                    isTarget && "bg-second-100 dark:bg-second-200/90 text-primary"
                  )}
                >
                  {verse.number}
                </span>
              )}
              <p
                className={cn(
                  `text-foreground min-w-0 flex-1 px-1.5 py-1 text-pretty
                  transition-colors duration-300`,
                  (isHovered || isTarget) && "rounded-md",
                  isHovered && !isTarget && "bg-primary/10",
                  isTarget &&
                    `bg-second-100 dark:bg-second-700/30 dark:border-second-700
                    bible-verse--highlight font-semibold dark:border`
                )}
              >
                {parsed && parsed.notes.length > 0 ? (
                  <>
                    {parsed.parts.map((p, i) =>
                      typeof p === "number" ? (
                        <sup
                          key={i}
                          className="text-muted-foreground align-super text-[0.7em]
                            font-medium"
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
            {showToolbar && (
              <div
                className="absolute top-0 -right-2 flex gap-1"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title={t("readCopyVerse")}
                  onClick={(e) => {
                    e.stopPropagation();
                    void navigator.clipboard.writeText(text);
                  }}
                  className="border-border bg-card hover:bg-accent h-8 w-8 rounded"
                >
                  <Copy className="text-muted-foreground h-3.5 w-3.5" />
                </Button>
                {book && content && (
                  <VerseBookmarkDropdown
                    book={book}
                    chapter={content.chapter}
                    verseNum={verseNum}
                    onOpenChange={(o) => {
                      setOpenDropdownVerse(o ? verseNum : null);
                      if (!o) onVerseHover(null);
                    }}
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title={t("readAddNote")}
                  className="border-border bg-card hover:bg-accent h-8 w-8 rounded"
                >
                  <StickyNote className="text-muted-foreground h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
