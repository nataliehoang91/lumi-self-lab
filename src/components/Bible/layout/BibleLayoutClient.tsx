"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { ReadFocusProvider } from "@/components/Bible/ReadFocusContext";
import { BibleNavBar } from "@/components/Bible/layout/navbar/BibleNavBar";
import { BibleMainWithPadding } from "@/components/Bible/Read/ReadLayout/BibleMainWithPadding";
import { LandingLoader } from "@/components/Bible/LangPage/LandingLoader";
import { useIntroLoader } from "@/hooks/use-intro-loader";
import { useTheme } from "@/components/theme-provider";

const PROTECTED_BIBLE_STUDY_REGEX = /^\/bible\/(en|vi)\/study(?:\/|$)/;

export function BibleLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { isMounted, introDone, markDone } = useIntroLoader("bible_landing_seen");
  const { palette } = useTheme();

  const isProtected = pathname != null && PROTECTED_BIBLE_STUDY_REGEX.test(pathname);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isProtected) return;
    if (isSignedIn) return;

    const search = searchParams.toString();
    const currentUrl = pathname + (search ? `?${search}` : "");
    router.replace(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
  }, [isLoaded, isProtected, isSignedIn, pathname, searchParams, router]);

  if (isProtected && !isLoaded) {
    // Show layout shell while Clerk resolves auth — avoids blank screen flash
    return (
      <div className={palette === "warm" ? "theme-warm" : undefined}>
        <Suspense fallback={null}>
          <BibleAppProvider>
            <ReadFocusProvider>
              <BibleNavBar />
              <BibleMainWithPadding>
                <div className="mx-auto min-h-screen max-w-7xl animate-pulse px-4 py-8 lg:px-0">
                  <div className="space-y-4">
                    <div className="bg-muted h-6 w-48 rounded" />
                    <div className="bg-muted h-4 w-72 rounded" />
                  </div>
                </div>
              </BibleMainWithPadding>
            </ReadFocusProvider>
          </BibleAppProvider>
        </Suspense>
      </div>
    );
  }

  return (
    <div className={palette === "warm" ? "theme-warm" : undefined}>
      <Suspense fallback={null}>
        <BibleAppProvider>
          <ReadFocusProvider>
            <BibleNavBar />
            <BibleMainWithPadding>{children}</BibleMainWithPadding>
          </ReadFocusProvider>
        </BibleAppProvider>
      </Suspense>
      {/* LandingLoader renders as a fixed overlay on the client only.
          SSR always outputs the real layout so crawlers see actual content. */}
      {isMounted && !introDone && (
        <LandingLoader onComplete={markDone} />
      )}
    </div>
  );
}
