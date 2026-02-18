"use client";

import { useState, useEffect, useCallback } from "react";

type BibleBook = { id: string; nameEn: string; nameVi: string; nameZh?: string | null; order: number; chapterCount: number };
type ChapterRow = { chapterNumber: number; verseCount: number };
type VerseContent = { contentVIE1923: string | null; contentKJV: string | null; contentNIV: string | null; contentZH: string | null } | null;

export function AddVerseForm() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [content, setContent] = useState<VerseContent>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [booksLoading, setBooksLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    fetch("/api/bible/admin/books", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setBooks)
      .finally(() => setBooksLoading(false));
  }, []);

  useEffect(() => {
    if (!bookId) {
      setChapters([]);
      setChapter("");
      setVerse("");
      setContent(null);
      return;
    }
    setChaptersLoading(true);
    setChapter("");
    setVerse("");
    setContent(null);
    fetch(`/api/bible/admin/books/${bookId}/chapters`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setChapters)
      .finally(() => setChaptersLoading(false));
  }, [bookId]);

  const fetchContent = useCallback(() => {
    if (!bookId || !chapter || !verse) {
      setContent(null);
      return;
    }
    setContentLoading(true);
    fetch(
      `/api/bible/admin/verse-content?bookId=${encodeURIComponent(bookId)}&chapter=${encodeURIComponent(chapter)}&verse=${encodeURIComponent(verse)}`,
      { credentials: "include" }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setContent(data))
      .finally(() => setContentLoading(false));
  }, [bookId, chapter, verse]);

  useEffect(() => {
    if (!bookId || !chapter || !verse) {
      setContent(null);
      return;
    }
    fetchContent();
  }, [bookId, chapter, verse, fetchContent]);

  const selectedChapterRow = chapters.find((c) => String(c.chapterNumber) === chapter);
  const verseCount = selectedChapterRow?.verseCount ?? 0;
  const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1);

  const hasContent = content && (content.contentVIE1923 || content.contentKJV || content.contentNIV || content.contentZH);
  const canSave = !!bookId && !!chapter && !!verse && hasContent && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave || !content) return;
    setMessage(null);
    setLoading(true);
    const chapterNum = parseInt(chapter, 10);
    const verseNum = parseInt(verse, 10);
    try {
      const res = await fetch("/api/bible/admin/add-verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          chapter: chapterNum,
          verse: verseNum,
          contentVIE1923: content.contentVIE1923?.trim() || undefined,
          contentKJV: content.contentKJV?.trim() || undefined,
          contentNIV: content.contentNIV?.trim() || undefined,
          contentZH: content.contentZH?.trim() || undefined,
        }),
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage({
          type: "error",
          text: res.status === 401 ? "Session expired. Please log in again." : (data.error ?? "Failed to save verse."),
        });
        setLoading(false);
        return;
      }
      setMessage({ type: "success", text: "Verse saved to flash cards." });
      setVerse("");
      setContent(null);
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Book</label>
        <select
          value={bookId}
          onChange={(e) => {
            setBookId(e.target.value);
          }}
          required
          disabled={booksLoading}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
        >
          <option value="">Select book (EN / VI / 中)</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nameEn} / {b.nameVi}
              {b.nameZh ? ` / ${b.nameZh}` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Chapter</label>
          <select
            value={chapter}
            onChange={(e) => {
              setChapter(e.target.value);
              setVerse("");
            }}
            required
            disabled={chaptersLoading || !bookId}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
          >
            <option value="">Select chapter</option>
            {chapters.map((c) => (
              <option key={c.chapterNumber} value={c.chapterNumber}>
                {c.chapterNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Verse</label>
          <select
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            required
            disabled={!verseCount}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
          >
            <option value="">Select verse</option>
            {verseOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content from DB: read-only, loads when book/chapter/verse selected */}
      {contentLoading && bookId && chapter && verse && (
        <p className="text-sm text-stone-500">Loading content…</p>
      )}
      {!contentLoading && bookId && chapter && verse && (
        <>
          {hasContent ? (
            <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
              {content.contentVIE1923 && (
                <div>
                  <span className="font-medium text-stone-600">Vietnamese (traditional):</span>
                  <p className="mt-1 text-stone-800">{content.contentVIE1923}</p>
                </div>
              )}
              {content.contentKJV && (
                <div>
                  <span className="font-medium text-stone-600">KJV:</span>
                  <p className="mt-1 text-stone-800">{content.contentKJV}</p>
                </div>
              )}
              {content.contentNIV && (
                <div>
                  <span className="font-medium text-stone-600">NIV:</span>
                  <p className="mt-1 text-stone-800">{content.contentNIV}</p>
                </div>
              )}
              {content.contentZH && (
                <div>
                  <span className="font-medium text-stone-600">Chinese (CUV):</span>
                  <p className="mt-1 text-stone-800">{content.contentZH}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-amber-700">No content for this verse in the database. Add it to BibleVerseContent to enable Save.</p>
          )}
        </>
      )}

      {message && (
        <p
          className={message.type === "success" ? "text-sm text-green-700" : "text-sm text-red-600"}
          role="alert"
        >
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={!canSave}
        className="rounded-lg bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save to flash cards"}
      </button>
    </form>
  );
}
