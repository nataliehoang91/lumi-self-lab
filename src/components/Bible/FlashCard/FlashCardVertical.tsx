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
  speakText,
} from "./flashCardShared";

export function FlashCardVertical({
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

  return (
    <div
      className="w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg shrink-0 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-[280px] sm:h-[320px] transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl bg-card dark:bg-slate-800 border border-border dark:border-slate-700 shadow-lg p-5 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="outline" className="text-xs">
            {cardLanguage === "VI" ? "VI" : cardLanguage === "ZH" ? "中" : "EN"}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mt-3 px-2">
            {displayTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-2">{t.clickToReveal}</p>
        </div>

        <div
          className="absolute inset-0 rounded-2xl bg-card dark:bg-slate-800 border border-border dark:border-slate-700 shadow-lg p-5 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 flex items-center justify-center min-h-0 overflow-auto">
            <p
              className={cn(
                "leading-relaxed text-center text-pretty line-clamp-6 [font-size:inherit]",
                cardLanguage === "VI" ? "font-vietnamese" : "font-serif"
              )}
            >
              {displayContent || "—"}
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t gap-1 flex-wrap shrink-0">
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
