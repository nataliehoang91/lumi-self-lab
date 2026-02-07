"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect for /. Middleware normally handles / → /dashboard or /welcome;
 * this runs only if the page is ever rendered, and redirects to /welcome to avoid
 * server redirect() which can cause "negative time stamp" Performance API errors.
 */
export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/welcome");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Redirecting…</p>
    </div>
  );
}
