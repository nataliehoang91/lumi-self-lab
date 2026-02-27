"use client";

import { useEffect } from "react";
import { BookOpenIcon } from "lucide-react";
import { ProgressTextLoader } from "./bible-section-loaders";

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
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-border">
          <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <ProgressTextLoader book={book ?? undefined} chapter={chapter ?? undefined} />
      </div>
    </div>
  );
}
