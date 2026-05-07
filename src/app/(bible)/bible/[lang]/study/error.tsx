"use client";

import { BibleErrorPage } from "@/components/Bible/GeneralComponents/BibleErrorPage";

export default function StudyError({
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
      description="We couldn't load your study lists. Please try again."
    />
  );
}
