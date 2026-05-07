"use client";

import { BibleErrorPage } from "@/components/Bible/GeneralComponents/BibleErrorPage";

export default function FlashcardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <BibleErrorPage
      error={error}
      reset={reset}
      description="We couldn't load the flashcards. Please try again."
    />
  );
}
