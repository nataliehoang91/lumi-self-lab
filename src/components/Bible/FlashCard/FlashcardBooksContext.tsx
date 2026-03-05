"use client";

import { createContext, useContext, useMemo } from "react";
import type { BibleBook } from "@/components/Bible/Read/types";

export interface FlashcardBooksContextValue {
  books: BibleBook[];
  lang: string;
}

const FlashcardBooksContext = createContext<FlashcardBooksContextValue | null>(
  null
);

export function FlashcardBooksProvider({
  books,
  lang,
  children,
}: {
  books: BibleBook[];
  lang: string;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ books, lang }), [books, lang]);
  return (
    <FlashcardBooksContext.Provider value={value}>
      {children}
    </FlashcardBooksContext.Provider>
  );
}

export function useFlashcardBooks(): FlashcardBooksContextValue | null {
  return useContext(FlashcardBooksContext);
}

/** Build read page href for a verse. Resolves book by English or Vietnamese name. */
export function buildVerseReadHref(
  books: BibleBook[],
  lang: string,
  bookName: string,
  chapter: number,
  verse: number,
  verseEnd?: number | null
): string {
  const key = bookName.trim().toLowerCase();
  const book = books.find(
    (b) =>
      b.nameEn.toLowerCase() === key ||
      (b.nameVi && b.nameVi.trim().toLowerCase() === key)
  );
  if (!book) return "#";
  const testament = book.order <= 39 ? "ot" : "nt";
  const version = lang === "vi" ? "vi" : "niv";
  const sp = new URLSearchParams();
  sp.set("version1", version);
  sp.set("sync", "true");
  sp.set("book1", book.id);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));
  if (verseEnd != null && verseEnd > verse) sp.set("verseEnd", String(verseEnd));
  return `/bible/${lang}/read?${sp.toString()}`;
}
