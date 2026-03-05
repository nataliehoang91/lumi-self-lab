"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type FlashCardCommonProps,
  type EnVersion,
  getDisplayContent,
  getDisplayTitle,
  hasKJVNotes,
  parseKJVNotes,
  speakText,
} from "./flashCardShared";
import {
  useFlashcardBooks,
  buildVerseReadHref,
} from "./FlashcardBooksContext";

export function FlashCardVertical({
  verse,
  isFlipped,
  onFlip,
  cardLanguage,
  onCardLanguageChange,
  t,
  flexible = false,
}: FlashCardCommonProps) {
  const [enVersion, setEnVersion] = useState<EnVersion>("NIV");
  const displayContent = getDisplayContent(verse, cardLanguage, enVersion);
  const displayTitle = getDisplayTitle(verse, cardLanguage);
  const flashcardBooks = useFlashcardBooks();
  const verseReadHref =
    flashcardBooks &&
    buildVerseReadHref(
      flashcardBooks.books,
      flashcardBooks.lang,
      verse.book,
      verse.chapter,
      verse.verse,
      verse.verseEnd
    );
  const showKJVNotes =
    cardLanguage === "EN" && enVersion === "KJV" && hasKJVNotes(displayContent ?? "");
  const kjvParsed = showKJVNotes && displayContent ? parseKJVNotes(displayContent) : null;

  return (
    <div
      className={cn(
        "w-full max-w-full min-w-0 shrink-0 cursor-pointer",
        !flexible && "sm:max-w-lg sm:min-w-md"
      )}
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative h-[280px] min-h-[200px] w-full transition-transform
          duration-500 sm:h-[320px]"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="bg-card border-border absolute inset-0 flex min-w-0 flex-col
            items-center justify-center overflow-hidden rounded-2xl border p-4 shadow-lg
            sm:p-5 dark:border-zinc-700 dark:bg-zinc-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="outline" className="shrink-0 text-xs">
            {cardLanguage === "VI" ? "VI" : cardLanguage === "ZH" ? "中" : "EN"}
          </Badge>
          <h2
            className={cn(
              "text-foreground mt-2 min-w-0 px-2 text-center text-base font-bold",
              "break-words sm:mt-3 sm:text-xl md:text-2xl",
              cardLanguage === "VI" && "font-vietnamese-flashcard"
            )}
          >
            {displayTitle}
          </h2>
          <p className="text-muted-foreground mt-1 shrink-0 text-xs sm:mt-2">
            {t.clickToReveal}
          </p>
        </div>

        <div
          className="bg-card border-border absolute inset-0 flex flex-col rounded-2xl
            border p-5 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            <div className="flex flex-1 items-center justify-center">
              {kjvParsed && kjvParsed.notes.length > 0 ? (
                <p
                  className={cn(
                    "text-center [font-size:inherit] leading-relaxed text-pretty",
                    cardLanguage === "VI" ? "font-vietnamese-flashcard" : "font-serif"
                  )}
                >
                  {kjvParsed.parts.map((p, i) =>
                    typeof p === "number" ? (
                      <sup
                        key={i}
                        className="text-muted-foreground align-super text-[0.7em]
                          font-medium"
                        title={kjvParsed!.notes[p - 1]}
                      >
                        {p}
                      </sup>
                    ) : (
                      <span key={i}>{p}</span>
                    )
                  )}
                </p>
              ) : (
                <p
                  className={cn(
                    `line-clamp-6 text-center [font-size:inherit] leading-relaxed
                      text-pretty`,
                    cardLanguage === "VI" ? "font-vietnamese-flashcard" : "font-serif"
                  )}
                >
                  {displayContent || "—"}
                </p>
              )}
            </div>
            {kjvParsed && kjvParsed.notes.length > 0 && (
              <div
                className="border-border/60 text-muted-foreground mt-2 max-h-[30%]
                  shrink-0 space-y-0.5 overflow-auto border-t pt-2 text-left text-xs"
              >
                {kjvParsed.notes.map((note, i) => (
                  <div key={i}>
                    <span className="text-foreground/80 font-medium">{i + 1}.</span>{" "}
                    {note}
                  </div>
                ))}
              </div>
            )}
            {verseReadHref && verseReadHref !== "#" && (
              <p
                className={cn(
                  "text-muted-foreground/80 mt-2 mb-3 shrink-0 text-center text-sm",
                  cardLanguage === "VI" ? "font-vietnamese-flashcard" : "font-mono"
                )}
              >
                <Link
                  href={verseReadHref}
                  onClick={(e) => e.stopPropagation()}
                  className="text-second-600 hover:text-second-800 underline
                    underline-offset-2 transition-colors"
                >
                  {displayTitle}
                </Link>
              </p>
            )}
          </div>
          <div
            className="flex shrink-0 flex-wrap items-center justify-between gap-1 border-t
              pt-3"
          >
            <div className="bg-muted/50 flex items-center gap-0.5 rounded-md border p-0.5">
              <Button
                variant={cardLanguage === "EN" ? "default" : "ghost"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardLanguageChange("EN");
                }}
                className="h-6 px-1.5 text-xs"
                title="English (this card only)"
              >
                EN
              </Button>
              <Button
                variant={cardLanguage === "VI" ? "default" : "ghost"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardLanguageChange("VI");
                }}
                className="h-6 px-1.5 text-xs"
                title="Tiếng Việt (this card only)"
              >
                VI
              </Button>
              <Button
                variant={cardLanguage === "ZH" ? "default" : "ghost"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCardLanguageChange("ZH");
                }}
                className="h-6 px-1.5 text-xs"
                title="中文 (this card only)"
              >
                中
              </Button>
            </div>
            {cardLanguage === "EN" && (
              <div
                className="bg-muted/50 flex items-center gap-0.5 rounded-md border p-0.5"
              >
                <Button
                  variant={enVersion === "KJV" ? "sage" : "ghost"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnVersion("KJV");
                  }}
                  className="h-6 px-1.5 text-xs"
                >
                  KJV
                </Button>
                <Button
                  variant={enVersion === "NIV" ? "default" : "ghost"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEnVersion("NIV");
                  }}
                  className={cn(
                    "h-6 px-1.5 text-xs",
                    enVersion === "NIV" &&
                      "bg-sky-blue text-sky-blue-foreground hover:bg-sky-blue/90 border-0"
                  )}
                >
                  NIV
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Read verse"
              onClick={(e) => {
                e.stopPropagation();
                speakText(displayContent || displayTitle, cardLanguage);
              }}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
