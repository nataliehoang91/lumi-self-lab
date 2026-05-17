"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bible-recent-topics";
const MAX_RECENT = 10;

export function useRecentTopics(): string[] {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
  }, []);

  return recent;
}

export function trackTopicView(slug: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prev: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
