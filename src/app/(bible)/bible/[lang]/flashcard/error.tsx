"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function FlashcardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Flashcard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen pt-14 flex flex-col items-center justify-center px-4 bg-linear-to-b from-background to-muted/20">
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 max-w-md w-full text-center">
        <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message || "Failed to load flash cards."}
        </p>
        <Button variant="outline" onClick={reset} className="w-full sm:w-auto">
          Try again
        </Button>
      </div>
    </div>
  );
}
