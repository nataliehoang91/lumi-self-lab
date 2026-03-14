"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { ReadFocusProvider } from "@/components/Bible/ReadFocusContext";
import { BibleNavBar } from "@/components/Bible/layout/navbar/BibleNavBar";
import { BibleMainWithPadding } from "@/components/Bible/Read/ReadLayout/BibleMainWithPadding";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";
import { LandingLoader } from "@/components/Bible/LangPage/LandingLoader";

const PROTECTED_BIBLE_STUDY_REGEX = /^\/bible\/(en|vi|zh)\/study(?:\/|$)/;
const LANDING_LOADER_COOKIE = "bible_landing_last_seen";
const LANDING_LOADER_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

function getLandingLoaderAlreadyDone(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const entry = cookies.find((c) => c.startsWith(`${LANDING_LOADER_COOKIE}=`));
    if (!entry) return false;
    const value = entry.split("=")[1];
    const lastSeen = Number.parseInt(decodeURIComponent(value), 10);
    if (!Number.isFinite(lastSeen)) return false;
    const now = Date.now();
    return now - lastSeen < LANDING_LOADER_COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function BibleLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  // Start false so server and client match (avoid hydration error); then sync from cookie in useEffect.
  const [landingDone, setLandingDone] = useState<boolean>(false);

  const isProtected = pathname != null && PROTECTED_BIBLE_STUDY_REGEX.test(pathname);

  useEffect(() => {
    const id = setTimeout(() => {
      if (getLandingLoaderAlreadyDone()) setLandingDone(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isProtected) return;
    if (isSignedIn) return;

    const search = searchParams.toString();
    const currentUrl = pathname + (search ? `?${search}` : "");
    router.replace(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
  }, [isLoaded, isProtected, isSignedIn, pathname, searchParams, router]);

  // Show Scripture·Space landing loader on first Bible entry, then again after cooldown.
  if (!landingDone) {
    return (
      <LandingLoader
        onComplete={() => {
          try {
            const now = Date.now().toString();
            document.cookie = `${LANDING_LOADER_COOKIE}=${encodeURIComponent(
              now
            )}; max-age=${Math.floor(
              LANDING_LOADER_COOLDOWN_MS / 1000
            )}; path=/; samesite=lax`;
          } catch {
            // ignore
          }
          setLandingDone(true);
        }}
      />
    );
  }

  if (isProtected && !isLoaded) {
    // Wait for Clerk auth to load before deciding what to show.
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <FullPageBibleLoader />
        </div>
      }
    >
      <BibleAppProvider>
        <ReadFocusProvider>
          <BibleNavBar />
          <BibleMainWithPadding>{children}</BibleMainWithPadding>
        </ReadFocusProvider>
      </BibleAppProvider>
    </Suspense>
  );
}
