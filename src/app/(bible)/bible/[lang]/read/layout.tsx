"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";
import { GeneralErrorFallback } from "@/components/GeneralErrorFallback";

const READ_INTRO_COOKIE = "bible_read_intro_last_seen";
const READ_INTRO_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function hasRecentReadIntro(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const entry = cookies.find((c) => c.startsWith(`${READ_INTRO_COOKIE}=`));
    if (!entry) return false;
    const value = entry.split("=")[1];
    const lastSeen = Number.parseInt(decodeURIComponent(value), 10);
    if (!Number.isFinite(lastSeen)) return false;
    const now = Date.now();
    return now - lastSeen < READ_INTRO_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export default function ReadLayout({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState<boolean>(() => hasRecentReadIntro());

  // Show Bible reading intro loader on first entry, then again after cooldown.
  if (!introDone) {
    return (
      <FullPageBibleLoader
        onComplete={() => {
          try {
            const now = Date.now().toString();
            document.cookie = `${READ_INTRO_COOKIE}=${encodeURIComponent(
              now
            )}; max-age=${Math.floor(
              READ_INTRO_COOLDOWN_MS / 1000
            )}; path=/; samesite=lax`;
          } catch {
            // ignore
          }
          setIntroDone(true);
        }}
      />
    );
  }

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <GeneralErrorFallback
          {...props}
          defaultDescription="We couldn't load the Bible reader. Please try again or go back to the main Bible page."
          homeUrl="/bible"
        />
      )}
    >
      <Suspense fallback={<FullPageBibleLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
