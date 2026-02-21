import { getVerseById } from "@/app/(bible)/bible/flashcard/getVerseById";
import { CardWithDataClient } from "./CardWithDataClient";
import type { Language } from "./FlashCardView";

interface CardWithDataProps {
  verseId: string;
  lang: Language;
  horizontal?: boolean;
  fontSize?: "small" | "medium" | "large";
  /** When true (e.g. grid layout), card fits container with no min width. */
  flexible?: boolean;
}

/** Fetches verse on server; client fallback fetches via API when server data is missing (e.g. mobile/PWA). */
export async function CardWithData({
  verseId,
  lang,
  horizontal = false,
  fontSize = "medium",
  flexible = false,
}: CardWithDataProps) {
  const verse = await getVerseById(verseId);
  return (
    <CardWithDataClient
      verseId={verseId}
      initialVerse={verse}
      lang={lang}
      horizontal={horizontal}
      fontSize={fontSize}
      flexible={flexible}
    />
  );
}
