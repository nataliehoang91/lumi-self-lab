"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface BibleErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  description?: string;
  homeUrl?: string;
}

export function BibleErrorPage({
  error,
  reset,
  description = "Something went wrong loading this page.",
  homeUrl = "/bible",
}: BibleErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm space-y-4">
        <div
          className="bg-destructive/8 border-destructive/20 mx-auto flex h-14 w-14
            items-center justify-center rounded-full border"
        >
          <RefreshCw className="text-destructive h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h2 className="text-foreground text-base font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <p className="text-destructive bg-destructive/5 rounded-lg px-3 py-2 font-mono text-xs break-words">
            {error.message}
          </p>
        )}

        <div className="flex justify-center gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={() => router.push(homeUrl)}>
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Back to Bible
          </Button>
          <Button size="sm" onClick={reset}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
