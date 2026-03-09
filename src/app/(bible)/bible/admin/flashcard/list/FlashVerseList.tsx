"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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
  bibleBook?: { id: string; nameEn: string; nameVi: string; nameZh: string | null; order: number } | null;
};

type SortKey = "book" | "chapter" | "verse" | "set" | "collection" | "createdAt";

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
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const sortedVerses = useMemo(() => {
    const list = [...verses];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "book":
          cmp =
            (a.bibleBook?.order ?? 999) - (b.bibleBook?.order ?? 999) ||
            a.book.localeCompare(b.book);
          break;
        case "chapter":
          cmp = a.chapter - b.chapter || a.verse - b.verse;
          break;
        case "verse":
          cmp = a.verse - b.verse || (a.chapter - b.chapter) * 1000;
          break;
        case "set":
          cmp = (a.flashCardSet?.name ?? "").localeCompare(b.flashCardSet?.name ?? "");
          break;
        case "collection":
          cmp = (a.flashCardCollection?.name ?? "").localeCompare(
            b.flashCardCollection?.name ?? ""
          );
          break;
        case "createdAt":
          cmp = a.createdAt.localeCompare(b.createdAt);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [verses, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    setSortKey(key);
    setSortDir((d) => (sortKey === key && d === "desc" ? "asc" : "desc"));
  };

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey !== column ? (
      <ArrowUpDown className="ml-0.5 inline h-3.5 w-3.5 opacity-50" />
    ) : sortDir === "asc" ? (
      <ArrowUp className="ml-0.5 inline h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-0.5 inline h-3.5 w-3.5" />
    );

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
        <div
          className="inline-block h-6 w-6 animate-spin rounded-full border-2
            border-stone-300 border-t-stone-600"
        />
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
        No verses yet.{" "}
        <Link href="/bible/admin/add" className="text-stone-700 underline">
          Add one
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="p-3 font-medium text-stone-700">
              <button
                type="button"
                onClick={() => toggleSort("set")}
                className="flex items-center hover:text-stone-900"
              >
                Set
                <SortIcon column="set" />
              </button>
            </th>
            <th className="p-3 font-medium text-stone-700">
              <button
                type="button"
                onClick={() => toggleSort("collection")}
                className="flex items-center hover:text-stone-900"
              >
                Collection
                <SortIcon column="collection" />
              </button>
            </th>
            <th className="p-3 font-medium text-stone-700">
              <button
                type="button"
                onClick={() => toggleSort("book")}
                className="flex items-center hover:text-stone-900"
              >
                Book (EN)
                <SortIcon column="book" />
              </button>
            </th>
            <th className="p-3 font-medium text-stone-700">Book (VI)</th>
            <th className="p-3 font-medium text-stone-700">
              <button
                type="button"
                onClick={() => toggleSort("chapter")}
                className="flex items-center hover:text-stone-900"
              >
                Ch
                <SortIcon column="chapter" />
              </button>
            </th>
            <th className="p-3 font-medium text-stone-700">
              <button
                type="button"
                onClick={() => toggleSort("verse")}
                className="flex items-center hover:text-stone-900"
              >
                Verse(s)
                <SortIcon column="verse" />
              </button>
            </th>
            <th className="max-w-[200px] p-3 font-medium text-stone-700">Snippet</th>
            <th className="p-3 font-medium text-stone-700">
              <button
                type="button"
                onClick={() => toggleSort("createdAt")}
                className="flex items-center hover:text-stone-900"
              >
                Date
                <SortIcon column="createdAt" />
              </button>
            </th>
            <th className="p-3 text-right font-medium text-stone-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedVerses.map((v) => (
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
              <td
                className="max-w-[200px] truncate p-3 text-stone-600"
                title={v.content || ""}
              >
                {snippet(
                  v.contentNIV ||
                    v.contentKJV ||
                    v.contentVIE1923 ||
                    v.contentZH ||
                    v.content
                )}
              </td>
              <td className="whitespace-nowrap p-3 text-stone-500">
                {v.createdAt
                  ? new Date(v.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </td>
              <td className="p-3 text-right">
                <Link
                  href={`/bible/admin/flashcard/edit/${v.id}`}
                  className="mr-2 text-stone-600 underline hover:text-stone-800"
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
