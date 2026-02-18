"use client";

import { useEffect, useState } from "react";
import { FlashCard } from "./FlashCard";

export type FlashVerse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  version: string;
  language: string;
  createdAt: string;
};

export function FlashCardGrid() {
  const [verses, setVerses] = useState<FlashVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/flash")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load verses");
        return res.json();
      })
      .then(setVerses)
      .catch(() => setError("Could not load verses."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-400 border-t-stone-700" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl bg-amber-50 p-4 text-amber-800" role="alert">
        {error}
      </p>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-stone-600 shadow-md">
        No verses yet. Add some in Admin.
      </div>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Flash cards">
      {verses.map((v) => (
        <li key={v.id}>
          <FlashCard verse={v} />
        </li>
      ))}
    </ul>
  );
}
