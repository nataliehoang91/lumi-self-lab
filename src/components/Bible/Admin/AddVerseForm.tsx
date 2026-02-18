"use client";

import { useState } from "react";

export function AddVerseForm() {
  const [bookEn, setBookEn] = useState("");
  const [bookVi, setBookVi] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [contentVIE1923, setContentVIE1923] = useState("");
  const [contentKJV, setContentKJV] = useState("");
  const [contentNIV, setContentNIV] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    const chapterNum = parseInt(chapter, 10);
    const verseNum = parseInt(verse, 10);
    if (Number.isNaN(chapterNum) || Number.isNaN(verseNum)) {
      setMessage({ type: "error", text: "Chapter and verse must be numbers." });
      setLoading(false);
      return;
    }
    const hasContent = contentVIE1923.trim() || contentKJV.trim() || contentNIV.trim();
    if (!hasContent) {
      setMessage({ type: "error", text: "Add at least one version (Vietnamese, KJV, or NIV)." });
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/bible/admin/add-verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: bookEn.trim(),
          chapter: chapterNum,
          verse: verseNum,
          titleEn: bookEn.trim() || undefined,
          titleVi: bookVi.trim() || undefined,
          contentVIE1923: contentVIE1923.trim() || undefined,
          contentKJV: contentKJV.trim() || undefined,
          contentNIV: contentNIV.trim() || undefined,
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
      setMessage({ type: "success", text: "Verse saved." });
      setBookEn("");
      setBookVi("");
      setChapter("");
      setVerse("");
      setContentVIE1923("");
      setContentKJV("");
      setContentNIV("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Book (English)</label>
        <input
          type="text"
          value={bookEn}
          onChange={(e) => setBookEn(e.target.value)}
          placeholder="e.g. Acts, John"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Book (Vietnamese)</label>
        <input
          type="text"
          value={bookVi}
          onChange={(e) => setBookVi(e.target.value)}
          placeholder="e.g. Công vụ, Giăng"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Chapter</label>
          <input
            type="number"
            min={1}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Verse</label>
          <input
            type="number"
            min={1}
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
            required
          />
        </div>
      </div>

      {/* Vietnamese first (traditional) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Content (Vietnamese – traditional)
        </label>
        <textarea
          value={contentVIE1923}
          onChange={(e) => setContentVIE1923(e.target.value)}
          placeholder="Vietnamese verse text…"
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>

      {/* English: KJV and NIV */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Content (English – KJV)
        </label>
        <textarea
          value={contentKJV}
          onChange={(e) => setContentKJV(e.target.value)}
          placeholder="KJV verse text…"
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Content (English – NIV)
        </label>
        <textarea
          value={contentNIV}
          onChange={(e) => setContentNIV(e.target.value)}
          placeholder="NIV verse text…"
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        />
      </div>

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
        disabled={loading}
        className="rounded-lg bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save verse"}
      </button>
    </form>
  );
}
