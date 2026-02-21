"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Verse = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  verseEnd?: number | null;
  titleEn: string | null;
  titleVi: string | null;
  contentVIE1923: string | null;
  contentKJV: string | null;
  contentNIV: string | null;
  contentZH?: string | null;
  content: string | null;
  createdAt: string;
  flashCardSet?: { id: string; name: string } | null;
  flashCardCollection?: { id: string; name: string } | null;
};

function snippet(text: string | null, max = 40): string {
  if (!text || !text.trim()) return "—";
  const t = text.trim();
  return t.length <= max ? t : t.slice(0, max) + "…";
}

export function FlashVerseList() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVerses = () => {
    setLoading(true);
    setError(null);
    fetch("/api/bible/admin/verses", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setVerses)
      .catch(() => setError("Failed to load verses."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVerses();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this verse?")) return;
    setDeletingId(id);
    fetch(`/api/bible/admin/verses/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        fetchVerses();
      })
      .catch(() => {
        setError("Failed to delete.");
        setDeletingId(null);
      })
      .finally(() => setDeletingId(null));
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600" role="alert">
        {error}
      </div>
    );
  }

  if (verses.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        No verses yet. <Link href="/bible/admin/add" className="text-stone-700 underline">Add one</Link>.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="p-3 font-medium text-stone-700">Set</th>
            <th className="p-3 font-medium text-stone-700">Collection</th>
            <th className="p-3 font-medium text-stone-700">Book (EN)</th>
            <th className="p-3 font-medium text-stone-700">Book (VI)</th>
            <th className="p-3 font-medium text-stone-700">Ch</th>
            <th className="p-3 font-medium text-stone-700">Verse(s)</th>
            <th className="p-3 font-medium text-stone-700 max-w-[200px]">Snippet</th>
            <th className="p-3 font-medium text-stone-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {verses.map((v) => (
            <tr key={v.id} className="border-b border-stone-100 hover:bg-stone-50/50">
              <td className="p-3 text-stone-700">{v.flashCardSet?.name ?? "—"}</td>
              <td className="p-3 text-stone-700">{v.flashCardCollection?.name ?? "—"}</td>
              <td className="p-3 text-stone-800">{v.titleEn || v.book}</td>
              <td className="p-3 text-stone-800">{v.titleVi || "—"}</td>
              <td className="p-3 text-stone-700">{v.chapter}</td>
              <td className="p-3 text-stone-700">
                {v.verseEnd != null && v.verseEnd > v.verse
                  ? `${v.verse}-${v.verseEnd}`
                  : v.verse}
              </td>
              <td className="p-3 text-stone-600 max-w-[200px] truncate" title={v.content || ""}>
                {snippet(v.contentNIV || v.contentKJV || v.contentVIE1923 || v.contentZH || v.content)}
              </td>
              <td className="p-3 text-right">
                <Link
                  href={`/bible/admin/flashcard/edit/${v.id}`}
                  className="mr-2 text-stone-600 hover:text-stone-800 underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  disabled={deletingId === v.id}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {deletingId === v.id ? "…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
