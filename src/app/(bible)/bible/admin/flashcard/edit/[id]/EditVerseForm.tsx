"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type BibleBook = { id: string; nameEn: string; nameVi: string; nameZh?: string | null; order: number; chapterCount: number };
type ChapterRow = { chapterNumber: number; verseCount: number };

type VerseResponse = {
  book: string;
  bookId?: string | null;
  bibleBook?: BibleBook | null;
  chapter: number;
  verse: number;
  contentVIE1923?: string | null;
  contentKJV?: string | null;
  contentNIV?: string | null;
  contentZH?: string | null;
};

export function EditVerseForm({ verseId }: { verseId: string }) {
  const router = useRouter();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [contentVIE1923, setContentVIE1923] = useState("");
  const [contentKJV, setContentKJV] = useState("");
  const [contentNIV, setContentNIV] = useState("");
  const [contentZH, setContentZH] = useState("");

  useEffect(() => {
    fetch("/api/bible/admin/books", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setBooks)
      .finally(() => setBooksLoading(false));
  }, []);

  useEffect(() => {
    if (!bookId) {
      setChapters([]);
      return;
    }
    setChaptersLoading(true);
    fetch(`/api/bible/admin/books/${bookId}/chapters`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setChapters)
      .finally(() => setChaptersLoading(false));
  }, [bookId]);

  useEffect(() => {
    if (books.length === 0) return;
    setLoading(true);
    fetch(`/api/bible/admin/verses/${verseId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((v: VerseResponse) => {
        const id = v.bookId ?? books.find((b) => b.nameEn === v.book)?.id ?? "";
        setBookId(id);
        setChapter(String(v.chapter));
        setVerse(String(v.verse));
        setContentVIE1923(v.contentVIE1923 ?? "");
        setContentKJV(v.contentKJV ?? "");
        setContentNIV(v.contentNIV ?? "");
        setContentZH(v.contentZH ?? "");
      })
      .catch(() => setMessage({ type: "error", text: "Verse not found." }))
      .finally(() => setLoading(false));
  }, [verseId, books]);

  const selectedChapterRow = chapters.find((c) => String(c.chapterNumber) === chapter);
  const verseCount = selectedChapterRow?.verseCount ?? 0;
  const chapterOptions = chapters;
  const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    const chapterNum = parseInt(chapter, 10);
    const verseNum = parseInt(verse, 10);
    if (!bookId) {
      setMessage({ type: "error", text: "Please select a book." });
      setSaving(false);
      return;
    }
    if (Number.isNaN(chapterNum) || chapterNum < 1) {
      setMessage({ type: "error", text: "Invalid chapter." });
      setSaving(false);
      return;
    }
    if (verseNum > verseCount) {
      setMessage({ type: "error", text: `Verse must be 1–${verseCount} for this chapter.` });
      setSaving(false);
      return;
    }
    if (Number.isNaN(verseNum) || verseNum < 1) {
      setMessage({ type: "error", text: "Verse must be a positive number." });
      setSaving(false);
      return;
    }
    const hasContent = contentVIE1923.trim() || contentKJV.trim() || contentNIV.trim() || contentZH.trim();
    if (!hasContent) {
      setMessage({ type: "error", text: "Add at least one version (Vietnamese, KJV, NIV, or Chinese)." });
      setSaving(false);
      return;
    }
    try {
      const res = await fetch(`/api/bible/admin/verses/${verseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          chapter: chapterNum,
          verse: verseNum,
          contentVIE1923: contentVIE1923.trim() || undefined,
          contentKJV: contentKJV.trim() || undefined,
          contentNIV: contentNIV.trim() || undefined,
          contentZH: contentZH.trim() || undefined,
        }),
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMessage({
          type: "error",
          text: res.status === 401 ? "Session expired." : (data.error ?? "Failed to save."),
        });
        setSaving(false);
        return;
      }
      setMessage({ type: "success", text: "Verse updated." });
      router.push("/bible/admin/flashcard/list");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  if (loading || booksLoading) {
    return (
      <div className="py-8 text-center text-stone-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Book</label>
        <select
          value={bookId}
          onChange={(e) => {
            setBookId(e.target.value);
            setChapter("");
          }}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
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
            onChange={(e) => { setChapter(e.target.value); setVerse(""); }}
            required
            disabled={chaptersLoading || !bookId}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
          >
            <option value="">Select chapter</option>
            {chapterOptions.map((c) => (
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
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Content (Vietnamese – traditional)</label>
        <textarea
          value={contentVIE1923}
          onChange={(e) => setContentVIE1923(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Content (English – KJV)</label>
        <textarea
          value={contentKJV}
          onChange={(e) => setContentKJV(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Content (English – NIV)</label>
        <textarea
          value={contentNIV}
          onChange={(e) => setContentNIV(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Content (Chinese – CUV)</label>
        <textarea
          value={contentZH}
          onChange={(e) => setContentZH(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>
      {message && (
        <p className={message.type === "success" ? "text-sm text-green-700" : "text-sm text-red-600"} role="alert">
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
