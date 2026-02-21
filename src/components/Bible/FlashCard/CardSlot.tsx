"use client";

import { useState } from "react";
import { FlashCardVertical } from "./FlashCardVertical";
import { FlashCardHorizontal } from "./FlashCardHorizontal";
import { cn } from "@/lib/utils";
import { getBibleIntl } from "@/lib/bible-intl";
import type { Language } from "./FlashCardView";
import type { VerseData } from "@/app/(bible)/bible/flashcard/getVerseById";

interface CardSlotProps {
  verse: VerseData;
  globalLanguage: Language;
  horizontal?: boolean;
  fontSize?: "small" | "medium" | "large";
  flexible?: boolean;
}

export function CardSlot({
  verse,
  globalLanguage,
  horizontal = false,
  fontSize = "medium",
  flexible = false,
}: CardSlotProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardLanguage, setCardLanguage] = useState<Language>(globalLanguage);
  const intl = getBibleIntl(cardLanguage);
  const t = { clickToReveal: intl.t("clickToReveal") };

  const common = {
    verse,
    isFlipped,
    onFlip: () => setIsFlipped((f) => !f),
    cardLanguage,
    onCardLanguageChange: setCardLanguage,
    t,
    flexible,
  };

  const fontSizeClass =
    fontSize === "small" ? "text-sm" : fontSize === "large" ? "text-lg" : "text-base";

  return (
    <div className={cn(fontSizeClass, flexible && "min-w-0")}>
      {horizontal ? (
        <FlashCardHorizontal {...common} />
      ) : (
        <FlashCardVertical {...common} />
      )}
    </div>
  );
}
