"use client";

import { BibleErrorPage } from "@/components/Bible/GeneralComponents/BibleErrorPage";

export default function ReadError({
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
      description="We couldn't load the Bible reader. Please try again."
    />
  );
}
