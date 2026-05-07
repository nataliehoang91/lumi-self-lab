"use client";

import { useState, useEffect } from "react";

/**
 * Shows an intro loader exactly once per key (stored in localStorage forever).
 * Returns { isMounted, introDone, markDone } for use in layouts.
 */
export function useIntroLoader(storageKey: string) {
  const [isMounted, setIsMounted] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      if (localStorage.getItem(storageKey) === "1") {
        setIntroDone(true);
      }
    } catch {
      setIntroDone(true);
    }
  }, [storageKey]);

  function markDone() {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
    setIntroDone(true);
  }

  return { isMounted, introDone, markDone };
}
