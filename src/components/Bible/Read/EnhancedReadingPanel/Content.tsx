"use client";

import { Copy, Bookmark, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { normalizeVerseTextForDisplay } from "../utils";
import type { ChapterContent } from "../types";
import type { VersionId } from "../constants";
import type { TFunction } from "../types";
import type { FontSize } from "@/components/Bible/BibleAppContext";
import { BookCircleIcon } from "../../GeneralComponents/book-circle-icon";

export interface ReadingPanelContentProps {
  version: VersionId;
  content: ChapterContent | null;
  focusMode: boolean;
  fontSize: FontSize;
  hoveredVerse: number | null;
  onVerseHover: (verse: number | null) => void;
  t: TFunction;
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
  focusMode,
  fontSize,
  hoveredVerse,
  onVerseHover,
  t,
}: ReadingPanelContentProps) {
  const isKJV = version === "kjv";
  const fontSizeClass = fontSizeToClass(fontSize, false);
  const fontSizeClassFocus = fontSizeToClass(fontSize, true);

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
        "space-y-6 leading-relaxed",
        focusMode ? fontSizeClassFocus : fontSizeClass
      )}
    >
      {content.verses.map((verse) => {
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
                  "text-muted-foreground shrink-0 font-medium transition-all",
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
            {!focusMode && hoveredVerse === verse.number && (
              <div
                className="absolute top-0 -right-2 flex gap-1 opacity-0 transition-opacity
                  group-hover:opacity-100"
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
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title={t("readBookmark")}
                  className="border-border bg-card hover:bg-accent h-8 w-8 rounded"
                >
                  <Bookmark className="text-muted-foreground h-3.5 w-3.5" />
                </Button>
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
