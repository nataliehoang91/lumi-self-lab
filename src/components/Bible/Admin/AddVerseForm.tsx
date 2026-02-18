"use client";

import { useState } from "react";

const VERSIONS = [
  { value: "KJV", label: "KJV (English)" },
  { value: "NIV", label: "NIV (English)" },
  { value: "VIE1923", label: "VIE1923 (Vietnamese)" },
] as const;

type Version = (typeof VERSIONS)[number]["value"];

export function AddVerseForm() {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [content, setContent] = useState("");
  const [version, setVersion] = useState<Version>("KJV");
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
    try {
      const res = await fetch("/api/bible/admin/add-verse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: book.trim(),
          chapter: chapterNum,
          verse: verseNum,
          content: content.trim(),
          version,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Failed to save verse." });
        setLoading(false);
        return;
      }
      setMessage({ type: "success", text: "Verse saved." });
      setBook("");
      setChapter("");
      setVerse("");
      setContent("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Book
        </label>
        <input
          type="text"
          value={book}
          onChange={(e) => setBook(e.target.value)}
          placeholder="e.g. John"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Chapter
          </label>
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
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Verse
          </label>
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
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Version
        </label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value as Version)}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
        >
          {VERSIONS.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Verse text…"
          rows={4}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          required
        />
      </div>
      {message && (
        <p
          className={
            message.type === "success"
              ? "text-sm text-green-700"
              : "text-sm text-red-600"
          }
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
