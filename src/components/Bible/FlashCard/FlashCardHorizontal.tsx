"use client";

import { useState } from "react";
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

export function FlashCardHorizontal({
  verse,
  isFlipped,
  onFlip,
  cardLanguage,
  onCardLanguageChange,
  t,
}: FlashCardCommonProps) {
  const [enVersion, setEnVersion] = useState<EnVersion>("NIV");
  const displayContent = getDisplayContent(verse, cardLanguage, enVersion);
  const displayTitle = getDisplayTitle(verse, cardLanguage);
  const showKJVNotes =
    cardLanguage === "EN" && enVersion === "KJV" && hasKJVNotes(displayContent ?? "");
  const kjvParsed = showKJVNotes && displayContent ? parseKJVNotes(displayContent) : null;

  return (
    <div
      className="w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg shrink-0 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full aspect-4/3 max-h-[280px] transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl bg-card dark:bg-slate-800 border border-border dark:border-slate-700 shadow-lg p-4 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="outline" className="text-xs">
            {cardLanguage === "VI" ? "VI" : cardLanguage === "ZH" ? "中" : "EN"}
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold text-foreground text-center mt-2 px-1">
            {displayTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{t.clickToReveal}</p>
        </div>

        <div
          className="absolute inset-0 rounded-2xl bg-card dark:bg-slate-800 border border-border dark:border-slate-700 shadow-lg p-4 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 flex flex-col min-h-0 overflow-auto">
            <div className="flex-1 flex items-center justify-center">
              {kjvParsed && kjvParsed.notes.length > 0 ? (
                <p
                  className={cn(
                    "leading-relaxed text-center text-pretty text-sm [font-size:inherit]",
                    cardLanguage === "VI" ? "font-vietnamese" : "font-serif"
                  )}
                >
                  {kjvParsed.parts.map((p, i) =>
                    typeof p === "number" ? (
                      <sup
                        key={i}
                        className="align-super text-[0.7em] font-medium text-muted-foreground"
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
                    "leading-relaxed text-center text-pretty line-clamp-4 text-sm [font-size:inherit]",
                    cardLanguage === "VI" ? "font-vietnamese" : "font-serif"
                  )}
                >
                  {displayContent || "—"}
                </p>
              )}
            </div>
            {kjvParsed && kjvParsed.notes.length > 0 && (
              <div className="mt-1.5 pt-1.5 border-t border-border/60 text-left text-xs text-muted-foreground shrink-0 space-y-0.5 max-h-[28%] overflow-auto">
                {kjvParsed.notes.map((note, i) => (
                  <div key={i}>
                    <span className="font-medium text-foreground/80">{i + 1}.</span> {note}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t gap-1 flex-wrap shrink-0">
            <div className="flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5">
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
              <div className="flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5">
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
