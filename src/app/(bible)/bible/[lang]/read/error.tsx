"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ReadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Read error:", error);
  }, [error]);

  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center justify-center px-4
        pt-14"
    >
      <div
        className="border-destructive/30 bg-destructive/5 w-full max-w-md rounded-xl
          border p-6 text-center"
      >
        <h2 className="text-destructive mb-2 text-lg font-semibold">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-4 text-sm">
          {error.message || "Failed to load the read page."}
        </p>
        <Button variant="outline" onClick={reset} className="w-full sm:w-auto">
          Try again
        </Button>
      </div>
    </div>
  );
}
