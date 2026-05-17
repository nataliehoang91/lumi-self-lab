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

// ── Favorite topics ───────────────────────────────────────────────────────────

const FAVORITES_KEY = "bible-favorite-topics";

export function useFavoriteTopics(): string[] {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
  }, []);

  return favorites;
}

/** Toggles favorite; returns true if now favorited. */
export function toggleFavoriteTopic(slug: string): boolean {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const prev: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const isFav = prev.includes(slug);
    const next = isFav ? prev.filter((s) => s !== slug) : [slug, ...prev];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return !isFav;
  } catch {
    return false;
  }
}
