"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { TRANSLATIONS } from "./constants";
import { normalizeVerseTextForDisplay, getBookDisplayName } from "./utils";
import { useRead } from "./context/ReadContext";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { BookCircleIcon } from "../GeneralComponents/book-circle-icon";
import { getBibleIntl } from "@/lib/bible-intl";
import type { VersionId } from "./constants";
import { BibleMinimalLoader } from "../GeneralComponents/minimal-bible-loader";

function verseTextWithNotes(text: string, version: VersionId | null) {
  const isKJV = version === "kjv";
  const showNotes = isKJV && hasKJVNotes(text);
  const parsed = showNotes ? parseKJVNotes(text) : null;
  const fontClass =
    version === "vi"
      ? "font-vietnamese [font-size:inherit]"
      : "font-bible-english text-[1.1em]";
  return { text, parsed, fontClass };
}

export function SyncedRead() {
  const { globalLanguage, fontSize } = useBibleApp();
  const intl = getBibleIntl(globalLanguage);
  const t = intl.t.bind(intl);
  const {
    leftContent,
    rightContent,
    leftVersion,
    rightVersion,
    loadingLeft,
    loadingRight,
    focusMode,
    hoveredVerse,
    setHoveredVerse,
    verse1,
    highlightedVerses,
    toggleVerseHighlight,
    leftBook,
    leftChapter,
  } = useRead();

  const onVerseNumberClick = toggleVerseHighlight;
  const scrollTarget = highlightedVerses[0] ?? verse1;

  useEffect(() => {
    if (!scrollTarget || typeof window === "undefined") return;
    const el = document.getElementById(`synced-verse-${scrollTarget}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [scrollTarget]);

  if (rightVersion === null) return null;

  const loading = loadingLeft || loadingRight;
  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const fontSizeClassFocus =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";
  const verseNumClass = cn(
    focusMode ? "text-sm" : "text-xs",
    "text-primary-dark font-medium shrink-0 transition-all"
  );

  if (loading) {
    const loadingBookLabel =
      leftBook && leftVersion
        ? getBookDisplayName(leftBook, leftVersion)
        : leftBook?.nameEn;

    return (
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
        <BibleMinimalLoader book={loadingBookLabel} chapter={leftChapter} />
      </div>
    );
  }

  const leftVerses = leftContent?.verses ?? [];
  const rightVerses = rightContent?.verses ?? [];
  const verseNumbers = [
    ...new Set([...leftVerses.map((v) => v.number), ...rightVerses.map((v) => v.number)]),
  ].sort((a, b) => a - b);

  if (verseNumbers.length === 0) {
    return (
      <div
        className="text-muted-foreground flex min-h-[calc(100vh-14rem)] w-full
          items-center justify-center py-16"
      >
        <div className="text-center">
          <BookCircleIcon size="lg" className="mx-auto mb-4" />
          <p>{t("readNoContent")}</p>
          <p className="mt-2 text-sm">{t("readSelectAnother")}</p>
        </div>
      </div>
    );
  }

  const leftLabel = leftVersion
    ? (TRANSLATIONS.find((tr) => tr.id === leftVersion)?.fullName ?? leftVersion)
    : "";
  const rightLabel =
    TRANSLATIONS.find((tr) => tr.id === rightVersion)?.fullName ?? rightVersion;

  return (
    <div className="relative">
      {/* Full-height vertical divider between left and right panels */}
      <div
        aria-hidden
        className="bg-primary pointer-events-none absolute top-0 bottom-0 w-px"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      <div
        className={cn(
          "gap-x-2 gap-y-6 leading-relaxed",
          focusMode ? fontSizeClassFocus : fontSizeClass
        )}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto 1fr",
          alignItems: "start",
        }}
      >
        <span
          aria-hidden
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
        />
        <span
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
        >
          {leftLabel}
        </span>
        <span
          aria-hidden
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
        />
        <span
          className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
        >
          {rightLabel}
        </span>
        {verseNumbers.map((num) => {
          const leftVerse = leftVerses.find((v) => v.number === num);
          const rightVerse = rightVerses.find((v) => v.number === num);
          const leftText = normalizeVerseTextForDisplay(
            leftVerse?.text ?? "",
            leftVersion
          );
          const rightText = normalizeVerseTextForDisplay(
            rightVerse?.text ?? "",
            rightVersion
          );
          const left = verseTextWithNotes(leftText, leftVersion);
          const right = verseTextWithNotes(rightText, rightVersion);
          const isHighlighted =
            highlightedVerses.includes(num);
          const isHovered = hoveredVerse === num;

          return (
            <div
              key={num}
              id={`synced-verse-${num}`}
              className={cn(
                "group contents scroll-mt-28 transition-colors",
                isHighlighted && "bible-verse--highlight"
              )}
              onMouseEnter={() => setHoveredVerse(num)}
              onMouseLeave={() => setHoveredVerse(null)}
            >
              <button
                type="button"
                onClick={() => onVerseNumberClick(num)}
                aria-label={t("verseOf", { current: num, total: verseNumbers.length })}
                aria-pressed={isHighlighted}
                className={cn(
                  verseNumClass,
                  "bg-muted/80 mt-1 inline-flex min-w-7 shrink-0 cursor-pointer items-start justify-center rounded-md px-1.5 py-1 tabular-nums transition-colors focus:ring-2 focus:ring-primary/40 focus:outline-none",
                  isHovered && !isHighlighted && "bg-primary/10 text-primary-dark",
                  isHighlighted && "bg-second-600 dark:bg-second-700 text-white"
                )}
              >
                {num}
              </button>
              <p
                className={cn(
                  "text-foreground min-h-[1.5em] px-1.5 py-1 pr-3 text-pretty transition-colors duration-300",
                  leftVersion === "vi"
                    ? "font-vietnamese [font-size:inherit]"
                    : left.fontClass,
                  (isHovered || isHighlighted) && "rounded-md",
                  isHovered && !isHighlighted && "bg-primary/10",
                  isHighlighted &&
                    `bg-second-100 dark:bg-second-700/30 dark:border-second-700
                    bible-verse--highlight font-semibold dark:border`
                )}
              >
                {left.parsed && left.parsed.notes.length > 0 ? (
                  <>
                    {left.parsed.parts.map((p, i) =>
                      typeof p === "number" ? (
                        <sup
                          key={i}
                          className="text-muted-foreground align-super text-[0.7em]
                            font-medium"
                          title={left.parsed!.notes[p - 1]}
                        >
                          {p}
                        </sup>
                      ) : (
                        <span key={i}>{p}</span>
                      )
                    )}
                  </>
                ) : (
                  leftText
                )}
              </p>
              <button
                type="button"
                onClick={() => onVerseNumberClick(num)}
                aria-label={t("verseOf", { current: num, total: verseNumbers.length })}
                aria-pressed={isHighlighted}
                className={cn(
                  verseNumClass,
                  "bg-muted/80 mt-1 ml-3 inline-flex min-w-7 shrink-0 cursor-pointer items-start justify-center rounded-md px-1.5 py-1 tabular-nums transition-colors focus:ring-2 focus:ring-primary/40 focus:outline-none",
                  isHovered && !isHighlighted && "bg-primary/10 text-primary-dark",
                  isHighlighted && "bg-second-600 dark:bg-second-700 text-white"
                )}
              >
                {num}
              </button>
              <p
                className={cn(
                  "text-foreground min-h-[1.5em] pl-2 pr-1.5 py-1 text-pretty transition-colors duration-300",
                  rightVersion === "vi"
                    ? "font-vietnamese [font-size:inherit]"
                    : right.fontClass,
                  (isHovered || isHighlighted) && "rounded-md",
                  isHovered && !isHighlighted && "bg-primary/10",
                  isHighlighted &&
                    `bg-second-100 dark:bg-second-700/30 dark:border-second-700
                    bible-verse--highlight font-semibold dark:border`
                )}
              >
                {right.parsed && right.parsed.notes.length > 0 ? (
                  <>
                    {right.parsed.parts.map((p, i) =>
                      typeof p === "number" ? (
                        <sup
                          key={i}
                          className="text-muted-foreground align-super text-[0.7em]
                            font-medium"
                          title={right.parsed!.notes[p - 1]}
                        >
                          {p}
                        </sup>
                      ) : (
                        <span key={i}>{p}</span>
                      )
                    )}
                  </>
                ) : (
                  rightText
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
