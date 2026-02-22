"use client";

import { useState, useCallback } from "react";
import { FlashCardVertical } from "./FlashCardVertical";
import { FlashCardHorizontal } from "./FlashCardHorizontal";
import { cn } from "@/lib/utils";
import { getBibleIntl } from "@/lib/bible-intl";
import type { Language } from "./FlashCardView";
import type { VerseData } from "@/app/actions/bible/getVerseById";

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
  const [userCardLanguage, setUserCardLanguage] = useState<Language | null>(null);
  const intl = getBibleIntl(userCardLanguage ?? globalLanguage);
  const t = { clickToReveal: intl.t("clickToReveal") };

  // Navbar language applies to card unless user chose a language on this card
  const cardLanguage = userCardLanguage ?? globalLanguage;

  const setCardLanguage = useCallback((lang: Language) => {
    setUserCardLanguage(lang);
  }, []);

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
