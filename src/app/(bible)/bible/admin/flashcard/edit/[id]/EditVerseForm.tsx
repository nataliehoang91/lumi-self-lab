"use client";

import { useState, useEffect, useCallback } from "react";
import {
  InteractiveForm,
  SubmitButton,
  SubmitMessage,
  LoadingMessage,
  FormErrorMessage,
} from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import { Form } from "@/components/CoreAdvancedComponent/components/form";
import { updateVerse } from "@/app/actions/bible/updateVerse";

type BibleBook = {
  id: string;
  nameEn: string;
  nameVi: string;
  nameZh?: string | null;
  order: number;
  chapterCount: number;
};
type ChapterRow = { chapterNumber: number; verseCount: number };
type FlashCardSet = { id: string; name: string; sortOrder: number };
type Collection = { id: string; name: string };

type VerseResponse = {
  book: string;
  bookId?: string | null;
  bibleBook?: BibleBook | null;
  flashCardSetId?: string | null;
  flashCardSet?: { id: string; name: string } | null;
  collectionId?: string | null;
  flashCardCollection?: { id: string; name: string } | null;
  chapter: number;
  verse: number;
  verseEnd?: number | null;
  contentVIE1923?: string | null;
  contentKJV?: string | null;
  contentNIV?: string | null;
  contentZH?: string | null;
};

type EditVerseFields =
  | "flashCardSetId"
  | "collectionId"
  | "bookId"
  | "chapter"
  | "verse"
  | "verseEnd"
  | "contentVIE1923"
  | "contentKJV"
  | "contentNIV"
  | "contentZH"
  | "general";

export function EditVerseForm({ verseId }: { verseId: string }) {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [sets, setSets] = useState<FlashCardSet[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [setsLoading, setSetsLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookId, setBookId] = useState("");
  const [flashCardSetId, setFlashCardSetId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [verseEnd, setVerseEnd] = useState("");
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
    fetch("/api/bible/admin/flashcard-sets", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setSets)
      .finally(() => setSetsLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/bible/collections", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setCollections)
      .finally(() => setCollectionsLoading(false));
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
    setLoadError(null);
    fetch(`/api/bible/admin/verses/${verseId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((v: VerseResponse) => {
        const id = v.bookId ?? books.find((b) => b.nameEn === v.book)?.id ?? "";
        setBookId(id);
        setFlashCardSetId(v.flashCardSetId ?? "");
        setCollectionId(v.collectionId ?? "");
        setChapter(String(v.chapter));
        setVerse(String(v.verse));
        setVerseEnd(v.verseEnd != null && v.verseEnd > v.verse ? String(v.verseEnd) : "");
        setContentVIE1923(v.contentVIE1923 ?? "");
        setContentKJV(v.contentKJV ?? "");
        setContentNIV(v.contentNIV ?? "");
        setContentZH(v.contentZH ?? "");
      })
      .catch(() => setLoadError("Verse not found."))
      .finally(() => setLoading(false));
  }, [verseId, books]);

  const selectedChapterRow = chapters.find((c) => String(c.chapterNumber) === chapter);
  const verseCount = selectedChapterRow?.verseCount ?? 0;
  const chapterOptions = chapters;
  const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1);

  const handleUpdate = useCallback(
    (formData: FormData) => updateVerse(verseId, formData),
    [verseId]
  );

  if (loading || booksLoading) {
    return (
      <div className="py-8 text-center text-stone-500">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
      </div>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {loadError}
      </p>
    );
  }

  return (
    <Form asChild className="contents">
      <InteractiveForm<EditVerseFields>
        className="flex flex-col gap-4"
        fields={[
          "flashCardSetId",
          "collectionId",
          "bookId",
          "chapter",
          "verse",
          "contentVIE1923",
          "contentKJV",
          "contentNIV",
          "contentZH",
          "general",
        ]}
        action={handleUpdate}
      >
        <FormErrorMessage name="general" match="unauthorized">
          Session expired. Please log in again.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="book_required">
          Please select a book.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="invalid_chapter">
          Invalid chapter.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="invalid_verse">
          Invalid verse.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="invalid_verse_end">
          Verse end must be ≥ verse and at most 50 verses.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="book_not_found">
          Book not found.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="chapter_out_of_range">
          Chapter is out of range for this book.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="content_required">
          At least one version content (Vietnamese, KJV, NIV, or Chinese) is required.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="invalid_set">
          Invalid flash card set.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="invalid_collection">
          Invalid collection.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="save_failed">
          Failed to save changes. Please try again.
        </FormErrorMessage>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Set</label>
          <select
            name="flashCardSetId"
            value={flashCardSetId}
            onChange={(e) => setFlashCardSetId(e.target.value)}
            disabled={setsLoading}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
          >
            <option value="">No set</option>
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Collection</label>
          <select
            name="collectionId"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            disabled={collectionsLoading}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
          >
            <option value="">No collection</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Book</label>
          <select
            name="bookId"
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
              name="chapter"
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
              name="verse"
              value={verse}
              onChange={(e) => {
                setVerse(e.target.value);
                setVerseEnd("");
              }}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Verse end (optional)
            </label>
            <select
              name="verseEnd"
              value={verseEnd}
              onChange={(e) => setVerseEnd(e.target.value)}
              disabled={!verseCount || !verse}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
            >
              <option value="">Single verse</option>
              {verseOptions
                .filter((n) => !verse || n >= parseInt(verse, 10))
                .map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Content (Vietnamese – traditional)
          </label>
          <textarea
            name="contentVIE1923"
            value={contentVIE1923}
            onChange={(e) => setContentVIE1923(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Content (English – KJV)
          </label>
          <textarea
            name="contentKJV"
            value={contentKJV}
            onChange={(e) => setContentKJV(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Content (English – NIV)
          </label>
          <textarea
            name="contentNIV"
            value={contentNIV}
            onChange={(e) => setContentNIV(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Content (Chinese – CUV)
          </label>
          <textarea
            name="contentZH"
            value={contentZH}
            onChange={(e) => setContentZH(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800"
          />
        </div>
        <SubmitButton className="rounded-lg bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 disabled:opacity-50">
          <SubmitMessage>Save changes</SubmitMessage>
          <LoadingMessage>Saving…</LoadingMessage>
        </SubmitButton>
      </InteractiveForm>
    </Form>
  );
}
