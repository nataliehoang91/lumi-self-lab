"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface StudyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function StudyError({ error, reset }: StudyErrorProps) {
  useEffect(() => {
    // Log to console for now; hook for future monitoring
    console.error("Bible study route error:", error);
  }, [error]);

  return (
    <div
      className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center
        space-y-4 px-4 text-center"
    >
      <div className="max-w-md space-y-1">
        <h1 className="text-foreground text-lg font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          We couldn&apos;t load your study lists right now. Please try again in a moment.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
