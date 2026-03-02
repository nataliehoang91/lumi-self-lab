"use client";

import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { BibleAppProvider } from "@/components/Bible/BibleAppContext";
import { ReadFocusProvider } from "@/components/Bible/ReadFocusContext";
import { BibleNavBar } from "@/components/Bible/BibleNavBar";
import { BibleMainWithPadding } from "@/components/Bible/Read/ReadLayout/BibleMainWithPadding";
import { FullPageBibleLoader } from "@/components/Bible/GeneralComponents/full-page-bible-loader";

const PROTECTED_BIBLE_STUDY_REGEX = /^\/bible\/(en|vi|zh)\/study(?:\/|$)/;

export function BibleLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

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
    // Wait for Clerk auth to load before deciding what to show.
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
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
