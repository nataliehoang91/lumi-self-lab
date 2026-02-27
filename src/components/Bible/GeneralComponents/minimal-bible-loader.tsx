"use client";

import { useEffect } from "react";
import { ProgressTextLoader } from "./bible-section-loaders";
import { BookCircleIcon } from "./book-circle-icon";

interface BibleMinimalLoaderProps {
  onComplete?: () => void;
  book?: string;
  chapter?: number;
}

export function BibleMinimalLoader({ onComplete, book, chapter }: BibleMinimalLoaderProps) {
  useEffect(() => {
    if (!onComplete) return;
    const timeout = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex min-h-screen min-w-full items-center justify-center">
      <div className="space-y-4 text-center px-6">
        <BookCircleIcon className="mx-auto mb-2" />
        <ProgressTextLoader book={book ?? undefined} chapter={chapter ?? undefined} />
      </div>
    </div>
  );
}
