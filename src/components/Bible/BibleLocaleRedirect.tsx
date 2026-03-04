"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredBibleLocale, type BibleLocaleSegment } from "@/lib/bible-locale-storage";

type Props = {
  /** Fallback locale when nothing is in localStorage (e.g. from server headers or params). */
  fallbackLocale: BibleLocaleSegment;
};

/**
 * Redirects to /bible/{locale}: uses stored locale from localStorage if present, else fallbackLocale.
 * Mount this on the root /bible page so the first client-side navigation respects saved preference.
 */
export function BibleLocaleRedirect({ fallbackLocale }: Props) {
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredBibleLocale();
    const locale = stored ?? fallbackLocale;
    router.replace(`/bible/${locale}`);
  }, [fallbackLocale, router]);

  return null;
}
