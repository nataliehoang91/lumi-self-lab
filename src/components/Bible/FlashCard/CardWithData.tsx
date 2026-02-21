import { getVerseById } from "@/app/(bible)/bible/flashcard/getVerseById";
import { CardSlot } from "./CardSlot";
import type { Language } from "./FlashCardView";

interface CardWithDataProps {
  verseId: string;
  lang: Language;
  horizontal?: boolean;
  fontSize?: "small" | "medium" | "large";
}

export async function CardWithData({
  verseId,
  lang,
  horizontal = false,
  fontSize = "medium",
}: CardWithDataProps) {
  const verse = await getVerseById(verseId);
  if (!verse) {
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
    />
  );
}
