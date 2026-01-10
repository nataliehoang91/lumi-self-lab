"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingIcon } from "@/components/CoreAdvancedComponent/components/LoadingIcon";

interface AlreadyLoggedInRedirectProps {
  callbackUrl?: string;
}

export const AlreadyLoggedInRedirect = ({
  callbackUrl,
}: AlreadyLoggedInRedirectProps) => {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c - 1);
    }, 1000);
    const timeout = setTimeout(() => {
      router.refresh();
      // Use callbackUrl if provided, otherwise default to /dashboard/public-companies
      // Redirect directly to avoid double redirect (dashboard -> dashboard/public-companies)
      const redirectUrl = callbackUrl
        ? decodeURIComponent(callbackUrl)
        : "/dashboard/public-companies";
      router.replace(redirectUrl);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router, callbackUrl]);

  return (
    <div className="text-center text-muted-foreground mt-4 gap-3.5 flex flex-col items-center justify-center">
      You are already logged in. Redirecting to home in
      <span className="text-primary font-bold">{count}</span>
      <LoadingIcon />
    </div>
  );
};
