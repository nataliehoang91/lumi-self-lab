"use client";

import { BookOpen, Copy, Bookmark, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseKJVNotes, hasKJVNotes } from "@/components/Bible/FlashCard/flashCardShared";
import { normalizeVerseTextForDisplay } from "../utils";
import type { ChapterContent } from "../types";
import type { VersionId } from "../constants";
import type { TFunction } from "../types";
import type { FontSize } from "@/components/Bible/BibleAppContext";

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
    return fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";
  }
  return fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";
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
      <div className="flex w-full min-h-[calc(100vh-14rem)] items-center justify-center py-12">
        <div className="text-center text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t("readNoContent")}</p>
          <p className="text-sm mt-2">{t("readSelectAnother")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-6 leading-relaxed", focusMode ? fontSizeClassFocus : fontSizeClass)}
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
                  className="h-8 w-8 rounded border-border bg-card hover:bg-accent"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title={t("readBookmark")}
                  className="h-8 w-8 rounded border-border bg-card hover:bg-accent"
                >
                  <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title={t("readAddNote")}
                  className="h-8 w-8 rounded border-border bg-card hover:bg-accent"
                >
                  <StickyNote className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
