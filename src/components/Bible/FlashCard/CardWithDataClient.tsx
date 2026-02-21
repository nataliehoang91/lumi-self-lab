"use client";

import { useState, useEffect } from "react";
import { CardSlot } from "./CardSlot";
import { CardSkeleton } from "./CardSkeleton";
import type { Language } from "./FlashCardView";
import type { VerseData } from "@/app/(bible)/bible/flashcard/getVerseById";

interface CardWithDataClientProps {
  verseId: string;
  initialVerse: VerseData | null;
  lang: Language;
  horizontal?: boolean;
  fontSize?: "small" | "medium" | "large";
  flexible?: boolean;
}

/** Renders card from initialVerse when present; otherwise fetches verse by id from API (fixes empty cards on mobile/PWA). */
export function CardWithDataClient({
  verseId,
  initialVerse,
  lang,
  horizontal = false,
  fontSize = "medium",
  flexible = false,
}: CardWithDataClientProps) {
  const [verse, setVerse] = useState<VerseData | null>(initialVerse);
  const [loading, setLoading] = useState(!initialVerse);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialVerse) {
      setVerse(initialVerse);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(`/api/bible/verses/${encodeURIComponent(verseId)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setVerse(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVerse(null);
          setLoading(false);
          setError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [verseId, initialVerse]);

  if (loading) {
    return <CardSkeleton horizontal={horizontal} />;
  }

  if (error || !verse) {
    return (
      <div
        className={
          horizontal
            ? "flex w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg aspect-4/3 max-h-[280px] items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground"
            : "flex w-full min-w-0 max-w-full sm:min-w-md sm:max-w-lg h-[280px] sm:h-[320px] items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground"
        }
      >
        Not found
      </div>
    );
  }

  return (
    <CardSlot
      verse={verse}
      globalLanguage={lang}
      horizontal={horizontal}
      fontSize={fontSize}
      flexible={flexible}
    />
  );
}
