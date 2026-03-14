"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { getBibleIntl } from "@/lib/bible-intl";

export type ReadScrollNavVariant = "floating" | "minimized" | "panel";

interface ReadScrollNavProps {
  variant?: ReadScrollNavVariant;
  /** For panel variant: scroll this element instead of window. */
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  /** For panel variant: which side (uses left or right book/chapter). */
  side?: "left" | "right";
  /** For floating variant: "top" when Insights is open (avoid overlap), "bottom" otherwise. */
  floatingPosition?: "top" | "bottom";
  className?: string;
}

function scrollToTop(scrollEl: HTMLElement | null) {
  const el =
    scrollEl ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (el) el.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom(scrollEl: HTMLElement | null) {
  const el =
    scrollEl ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}

export function ReadScrollNav({
  variant = "floating",
  scrollContainerRef,
  side = "left",
  floatingPosition = "bottom",
  className,
}: ReadScrollNavProps) {
  const { globalLanguage } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const {
    leftBook,
    leftChapter,
    rightBook,
    rightChapter,
    handleLeftChapterChange,
    handleRightChapterChange,
    handleLeftBookChange,
    handleRightBookChange,
    syncMode,
    otBooks,
    ntBooks,
    testamentFilter,
    leftTestamentFilter,
    rightTestamentFilter,
  } = useRead();

  const book = side === "left" ? leftBook : rightBook;
  const chapter = side === "left" ? leftChapter : syncMode ? leftChapter : rightChapter;
  const onChapterChange =
    side === "left" ? handleLeftChapterChange : handleRightChapterChange;
  const onBookChange = side === "left" ? handleLeftBookChange : handleRightBookChange;

  const bookList =
    side === "left"
      ? (syncMode ? testamentFilter : leftTestamentFilter) === "ot"
        ? otBooks
        : ntBooks
      : rightTestamentFilter === "ot"
        ? otBooks
        : ntBooks;
  const bookIndex = book ? bookList.findIndex((b) => b.id === book.id) : -1;
  const prevBook = bookIndex > 0 ? bookList[bookIndex - 1]! : null;
  const nextBook =
    bookIndex >= 0 && bookIndex < bookList.length - 1 ? bookList[bookIndex + 1]! : null;

  const maxChapters = book?.chapterCount ?? 1;
  const canPrevCh = chapter > 1;
  const canNextCh = chapter < maxChapters;

  const scrollEl = scrollContainerRef?.current ?? null;

  const handlePrevBook = () => {
    if (prevBook) onBookChange(prevBook);
  };
  const handleNextBook = () => {
    if (nextBook) onBookChange(nextBook);
  };
  const handlePrevCh = () => {
    if (canPrevCh) onChapterChange(chapter - 1);
  };
  const handleNextCh = () => {
    if (canNextCh) onChapterChange(chapter + 1);
  };
  const handleTop = () => scrollToTop(scrollEl);
  const handleBottom = () => scrollToBottom(scrollEl);

  const btn =
    "bg-muted/80 hover:bg-muted text-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none";
  const isMinimized = variant === "minimized";
  const isPanel = variant === "panel";

  const buttons = (
    <>
      <button
        type="button"
        onClick={handlePrevBook}
        disabled={!prevBook}
        className={btn}
        title={intl.t("readNavPrevBook")}
        aria-label={intl.t("readNavPrevBook")}
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handlePrevCh}
        disabled={!canPrevCh}
        className={btn}
        title={intl.t("readNavPrev")}
        aria-label={intl.t("readNavPrev")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleNextCh}
        disabled={!canNextCh}
        className={btn}
        title={intl.t("readNavNext")}
        aria-label={intl.t("readNavNext")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleNextBook}
        disabled={!nextBook}
        className={btn}
        title={intl.t("readNavNextBook")}
        aria-label={intl.t("readNavNextBook")}
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleTop}
        className={btn}
        title={intl.t("readNavTop")}
        aria-label={intl.t("readNavTop")}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleBottom}
        className={btn}
        title={intl.t("readNavBottom")}
        aria-label={intl.t("readNavBottom")}
      >
        <ArrowDown className="h-4 w-4" />
      </button>
    </>
  );

  if (isMinimized) {
    return (
      <div
        className={cn("flex items-center gap-1", className)}
        role="navigation"
        aria-label="Read navigation"
      >
        {buttons}
      </div>
    );
  }

  if (isPanel) {
    return (
      <div
        className={cn("flex justify-center py-1.5", className)}
        role="navigation"
        aria-label="Read navigation"
      >
        <div
          className="border-border/60 bg-card dark:bg-muted/50 flex items-center gap-1
            rounded-lg border px-1.5 py-1"
        >
          {buttons}
        </div>
      </div>
    );
  }

  // floating: top when Insights open (no overlap), bottom otherwise — scroll to end then tap next
  // Wrapper is pointer-events-none so it doesn't block clicks on content; only the bar is clickable.
  const atTop = floatingPosition === "top";
  return (
    <div
      className={cn(
        `bg-card pointer-events-none fixed left-1/2 z-50 flex -translate-x-1/2
        justify-center`,
        atTop ? "top-30 sm:top-32" : "bottom-4",
        className
      )}
      role="navigation"
      aria-label="Read navigation"
    >
      <div
        className="border-border/60 bg-card/95 dark:bg-muted/50 pointer-events-auto flex
          items-center gap-1 rounded-lg border px-1.5 py-1 shadow-md backdrop-blur"
      >
        {buttons}
      </div>
    </div>
  );
}
