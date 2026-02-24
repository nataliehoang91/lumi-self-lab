"use client";

import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { TRANSLATIONS } from "./constants";
import { normalizeVerseTextForDisplay } from "./utils";
import type { ChapterContent } from "./types";
import type { VersionId } from "./constants";
import type { FontSize } from "@/components/Bible/BibleAppContext";
import type { TFunction } from "./types";

interface SyncedVerseListProps {
  leftContent: ChapterContent | null;
  rightContent: ChapterContent | null;
  leftVersion: VersionId | null;
  rightVersion: VersionId;
  loading: boolean;
  fontSize: FontSize;
  focusMode: boolean;
  hoveredVerse: number | null;
  onVerseHover: (n: number | null) => void;
  t: TFunction;
}

function verseTextWithNotes(
  text: string,
  version: VersionId | null,
  versionKey: "vi" | "bible-english"
) {
  const isKJV = version === "kjv";
  const showNotes = isKJV && hasKJVNotes(text);
  const parsed = showNotes ? parseKJVNotes(text) : null;
  const fontClass =
    version === "vi"
      ? "font-vietnamese [font-size:inherit]"
      : "font-bible-english text-[1.1em]";
  return { text, parsed, fontClass };
}

export function SyncedVerseList({
  leftContent,
  rightContent,
  leftVersion,
  rightVersion,
  loading,
  fontSize,
  focusMode,
  hoveredVerse,
  onVerseHover,
  t,
}: SyncedVerseListProps) {
  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
  const fontSizeClassFocus =
    fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";
  const verseNumClass = cn(
    focusMode ? "text-base" : "text-sm",
    "text-muted-foreground font-medium shrink-0 transition-all"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  const leftVerses = leftContent?.verses ?? [];
  const rightVerses = rightContent?.verses ?? [];
  const verseNumbers = [
    ...new Set([
      ...leftVerses.map((v) => v.number),
      ...rightVerses.map((v) => v.number),
    ]),
  ].sort((a, b) => a - b);

  if (verseNumbers.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>{t("readNoContent")}</p>
        <p className="text-sm mt-2">{t("readSelectAnother")}</p>
      </div>
    );
  }

  const leftLabel = leftVersion
    ? (TRANSLATIONS.find((tr) => tr.id === leftVersion)?.fullName ?? leftVersion)
    : "";
  const rightLabel = TRANSLATIONS.find((tr) => tr.id === rightVersion)?.fullName ?? rightVersion;

  return (
    <div className="relative">
      {/* Full-height vertical divider between left and right panels */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 w-px bg-primary pointer-events-none"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      <div
        className={cn(
          "leading-relaxed gap-x-2 gap-y-6",
          focusMode ? fontSizeClassFocus : fontSizeClass
        )}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto 1fr",
          alignItems: "start",
        }}
      >
        <span aria-hidden className="text-xs font-medium text-muted-foreground tracking-wide uppercase" />
        <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          {leftLabel}
        </span>
      <span aria-hidden className="text-xs font-medium text-muted-foreground tracking-wide uppercase" />
      <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
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
        const left = verseTextWithNotes(leftText, leftVersion, "bible-english");
        const right = verseTextWithNotes(rightText, rightVersion, "bible-english");

        return (
          <div
            key={num}
            className="contents group"
            onMouseEnter={() => onVerseHover(num)}
            onMouseLeave={() => onVerseHover(null)}
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
                "text-foreground text-pretty min-h-[1.5em] pr-3",
                leftVersion === "vi" ? "font-vietnamese [font-size:inherit]" : left.fontClass
              )}
            >
              {left.parsed && left.parsed.notes.length > 0 ? (
                <>
                  {left.parsed.parts.map((p, i) =>
                    typeof p === "number" ? (
                      <sup
                        key={i}
                        className="align-super text-[0.7em] font-medium text-muted-foreground"
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
                "pt-0.5 shrink-0 pl-5",
                hoveredVerse === num && "text-primary"
              )}
            >
              {num}
            </span>
            <p
              className={cn(
                "text-foreground text-pretty min-h-[1.5em] pl-4",
                rightVersion === "vi" ? "font-vietnamese [font-size:inherit]" : right.fontClass
              )}
            >
              {right.parsed && right.parsed.notes.length > 0 ? (
                <>
                  {right.parsed.parts.map((p, i) =>
                    typeof p === "number" ? (
                      <sup
                        key={i}
                        className="align-super text-[0.7em] font-medium text-muted-foreground"
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
