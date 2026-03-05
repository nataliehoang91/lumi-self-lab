"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect for /. Sends visitors to /waitlist.
 */
export function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/waitlist");
  }, [router]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">Redirecting…</p>
    </div>
  );
}
