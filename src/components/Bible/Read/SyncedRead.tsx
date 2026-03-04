"use client";

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
    leftBook,
    leftChapter,
  } = useRead();

  if (rightVersion === null) return null;

  const loading = loadingLeft || loadingRight;
  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const fontSizeClassFocus =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";
  const verseNumClass = cn(
    focusMode ? "text-base" : "text-sm",
    "text-muted-foreground font-medium shrink-0 transition-all"
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

          return (
            <div
              key={num}
              className="group contents"
              onMouseEnter={() => setHoveredVerse(num)}
              onMouseLeave={() => setHoveredVerse(null)}
            >
              <span
                className={cn(
                  verseNumClass,
                  "pt-0.5",
                  hoveredVerse === num && "text-primary"
                )}
              >
                {num}
              </span>
              <p
                className={cn(
                  "text-foreground min-h-[1.5em] pr-3 text-pretty",
                  leftVersion === "vi"
                    ? "font-vietnamese [font-size:inherit]"
                    : left.fontClass
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
              <span
                className={cn(
                  verseNumClass,
                  "shrink-0 pt-0.5 pl-5",
                  hoveredVerse === num && "text-primary"
                )}
              >
                {num}
              </span>
              <p
                className={cn(
                  "text-foreground min-h-[1.5em] pl-4 text-pretty",
                  rightVersion === "vi"
                    ? "font-vietnamese [font-size:inherit]"
                    : right.fontClass
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
