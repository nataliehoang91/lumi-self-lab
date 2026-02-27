"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export function BibleProtectedRedirect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const search = searchParams.toString();
    const currentUrl = pathname + (search ? `?${search}` : "");
    router.replace(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
  }, [pathname, searchParams, router]);

  return null;
}

