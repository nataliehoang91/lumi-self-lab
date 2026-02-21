"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FlashCardVertical } from "./FlashCardVertical";
import { FlashCardHorizontal } from "./FlashCardHorizontal";
import type { Language, Verse } from "./FlashCardView";
import type { VerseLike } from "./flashCardShared";

type UIStrings = { clickToReveal: string };

interface LazyFlashCardProps {
  verseId: string;
  isFlipped: boolean;
  onFlip: () => void;
  cardLanguage: Language;
  onCardLanguageChange: (lang: Language) => void;
  t: UIStrings;
  horizontal?: boolean;
}

export function LazyFlashCard({
  verseId,
  isFlipped,
  onFlip,
  cardLanguage,
  onCardLanguageChange,
  t,
  horizontal = false,
}: LazyFlashCardProps) {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/bible/verses/${encodeURIComponent(verseId)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load verse");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setVerse(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load verse.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [verseId]);

  if (loading) {
    return (
      <div className="shrink-0 w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg">
        <Skeleton
          className={cn(
            "w-full rounded-2xl",
            horizontal ? "aspect-4/3 max-h-[280px]" : "h-[280px] sm:h-[320px]"
          )}
        />
      </div>
    );
  }

  if (error || !verse) {
    return (
      <div
        className={cn(
          "shrink-0 w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg flex items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground",
          horizontal ? "aspect-4/3 max-h-[280px]" : "h-[280px] sm:h-[320px]"
        )}
      >
        {error ?? "Not found"}
      </div>
    );
  }

  const common = {
    verse: verse as VerseLike,
    isFlipped,
    onFlip,
    cardLanguage,
    onCardLanguageChange,
    t,
  };

  return horizontal ? (
    <FlashCardHorizontal {...common} />
  ) : (
    <FlashCardVertical {...common} />
  );
}
