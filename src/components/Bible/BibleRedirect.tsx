"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function BibleRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bible/en/read");
  }, [router]);

    return null;
}

