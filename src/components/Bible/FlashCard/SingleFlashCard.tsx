"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Volume2 } from "lucide-react";

// Local copy of flashcard types so this component doesn't depend on app routes.
export type Language = "EN" | "VI" | "ZH";

export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  titleEn?: string | null;
  titleVi?: string | null;
  contentVIE1923?: string | null;
  contentKJV?: string | null;
  contentNIV?: string | null;
  contentZH?: string | null;
  content?: string | null;
  titleZh?: string | null;
  version?: string | null;
  language?: string | null;
  createdAt: string;
}

type EnVersion = "KJV" | "NIV";

type UIStrings = {
  clickToReveal: string;
};

function normalizeQuotes(text: string): string {
  return text.replace(/`/g, "'");
}

function speakText(text: string, lang: Language) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  const utterance = new SpeechSynthesisUtterance(trimmed);

  if (lang === "VI") utterance.lang = "vi-VN";
  else if (lang === "ZH") utterance.lang = "zh-CN";
  else utterance.lang = "en-US";

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

interface SingleFlashCardProps {
  verse: Verse;
  isFlipped: boolean;
  onFlip: () => void;
  cardLanguage: Language;
  onCardLanguageChange: (lang: Language) => void;
  t: UIStrings;
  horizontal?: boolean;
}

function getDisplayContent(verse: Verse, cardLanguage: Language, enVersion: EnVersion): string {
  if (cardLanguage === "VI") {
    const raw = verse.contentVIE1923?.trim() || verse.content?.trim() || "";
    return normalizeQuotes(raw);
  }
  if (cardLanguage === "ZH") {
    const raw = verse.contentZH?.trim() || verse.content?.trim() || "";
    return normalizeQuotes(raw);
  }
  if (enVersion === "KJV") {
    const raw = verse.contentKJV?.trim() || verse.content?.trim() || "";
    return normalizeQuotes(raw);
  }
  const raw = verse.contentNIV?.trim() || verse.content?.trim() || "";
  return normalizeQuotes(raw);
}

function getDisplayTitle(verse: Verse, cardLanguage: Language): string {
  const ref = `${verse.chapter}:${verse.verse}`;
  if (cardLanguage === "VI" && verse.titleVi?.trim()) return verse.titleVi.trim();
  if (cardLanguage === "ZH" && verse.titleZh?.trim()) return verse.titleZh.trim();
  if (cardLanguage === "EN" && verse.titleEn?.trim()) return verse.titleEn.trim();
  return `${verse.book} ${ref}`;
}

export function SingleFlashCard({
  verse,
  isFlipped,
  onFlip,
  cardLanguage,
  onCardLanguageChange,
  t,
  horizontal = false,
}: SingleFlashCardProps) {
  const [enVersion, setEnVersion] = useState<EnVersion>("NIV");
  const displayContent = getDisplayContent(verse, cardLanguage, enVersion);
  const displayTitle = getDisplayTitle(verse, cardLanguage);

  return (
    <div
      className={cn(
        "shrink-0 w-full min-w-0 cursor-pointer",
        horizontal && "w-[260px] sm:w-[280px] min-w-[260px] sm:min-w-[280px]"
      )}
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-[240px] sm:h-[260px] transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border shadow-lg p-4 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Badge variant="outline" className="text-xs">
            {cardLanguage === "VI" ? "VI" : cardLanguage === "ZH" ? "中" : "EN"}
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mt-2">
            {displayTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">{t.clickToReveal}</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border shadow-lg p-4 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 flex items-center justify-center min-h-0">
            <p className="font-serif leading-relaxed text-center text-pretty line-clamp-6 [font-size:inherit]">
              {displayContent || "—"}
            </p>
          </div>
          <div className="flex items-center justify-between pt-3 border-t gap-1 flex-wrap">
            {/* Card language (this card only) */}
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

            {/* When EN: KJV | NIV toggle (this card only) */}
            {cardLanguage === "EN" && (
              <div className="flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5">
                <Button
                  variant={enVersion === "KJV" ? "default" : "ghost"}
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
                  className="h-6 px-1.5 text-xs"
                >
                  NIV
                </Button>
              </div>
            )}

            {/* Sound (inside card) */}
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
