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
import { addVerse } from "@/app/actions/bible/addVerse";

type BibleBook = {
  id: string;
  nameEn: string;
  nameVi: string;
  nameZh?: string | null;
  order: number;
  chapterCount: number;
};
type ChapterRow = { chapterNumber: number; verseCount: number };
type VerseContent = {
  contentVIE1923: string | null;
  contentKJV: string | null;
  contentNIV: string | null;
  contentZH: string | null;
} | null;
type FlashCardSet = { id: string; name: string; sortOrder: number };
type Collection = { id: string; name: string };

type AddVerseFields =
  | "flashCardSetId"
  | "collectionId"
  | "bookId"
  | "chapter"
  | "verse"
  | "verseEnd"
  | "referenceLabelEn"
  | "referenceLabelVi"
  | "referenceLabelZh"
  | "contentVIE1923"
  | "contentKJV"
  | "contentNIV"
  | "contentZH"
  | "contentDisplayVIE"
  | "contentDisplayKJV"
  | "contentDisplayNIV"
  | "contentDisplayZH"
  | "general";

export function AddVerseForm() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [sets, setSets] = useState<FlashCardSet[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  const [verseEnd, setVerseEnd] = useState("");
  const [referenceLabelEn, setReferenceLabelEn] = useState("");
  const [referenceLabelVi, setReferenceLabelVi] = useState("");
  const [referenceLabelZh, setReferenceLabelZh] = useState("");
  const [contentVIE1923, setContentVIE1923] = useState("");
  const [contentKJV, setContentKJV] = useState("");
  const [contentNIV, setContentNIV] = useState("");
  const [contentZH, setContentZH] = useState("");
  const [contentDisplayVIE, setContentDisplayVIE] = useState("");
  const [contentDisplayKJV, setContentDisplayKJV] = useState("");
  const [contentDisplayNIV, setContentDisplayNIV] = useState("");
  const [contentDisplayZH, setContentDisplayZH] = useState("");
  const [content, setContent] = useState<VerseContent>(null);
  const [booksLoading, setBooksLoading] = useState(true);
  const [setsLoading, setSetsLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

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
      const tid = setTimeout(() => {
        setChapters([]);
        setChapter("");
        setVerse("");
        setVerseEnd("");
        setContent(null);
      }, 0);
      return () => clearTimeout(tid);
    }
    const tid = setTimeout(() => {
      setChaptersLoading(true);
      setChapter("");
      setVerse("");
      setVerseEnd("");
      setContent(null);
      fetch(`/api/bible/admin/books/${bookId}/chapters`, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : []))
        .then(setChapters)
        .finally(() => setChaptersLoading(false));
    }, 0);
    return () => clearTimeout(tid);
  }, [bookId]);

  const fetchContent = useCallback(() => {
    if (!bookId || !chapter || !verse) {
      setContent(null);
      return;
    }
    setContentLoading(true);
    const verseEndNum = verseEnd ? parseInt(verseEnd, 10) : null;
    const useRange =
      verseEndNum != null &&
      !Number.isNaN(verseEndNum) &&
      verseEndNum >= parseInt(verse, 10);
    const url = new URL("/api/bible/admin/verse-content", window.location.origin);
    url.searchParams.set("bookId", bookId);
    url.searchParams.set("chapter", chapter);
    url.searchParams.set("verse", verse);
    if (useRange) url.searchParams.set("verseEnd", String(verseEndNum));
    fetch(url.toString(), { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setContent(data))
      .finally(() => setContentLoading(false));
  }, [bookId, chapter, verse, verseEnd]);

  useEffect(() => {
    if (!bookId || !chapter || !verse) {
      const tid = setTimeout(() => setContent(null), 0);
      return () => clearTimeout(tid);
    }
    const tid = setTimeout(() => fetchContent(), 0);
    return () => clearTimeout(tid);
  }, [bookId, chapter, verse, verseEnd, fetchContent]);

  useEffect(() => {
    if (content) {
      setContentVIE1923(content.contentVIE1923?.trim() ?? "");
      setContentKJV(content.contentKJV?.trim() ?? "");
      setContentNIV(content.contentNIV?.trim() ?? "");
      setContentZH(content.contentZH?.trim() ?? "");
    }
  }, [content]);

  useEffect(() => {
    if (!bookId || !chapter || !verse || books.length === 0) return;
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    const ch = parseInt(chapter, 10);
    const v = parseInt(verse, 10);
    const vEnd = verseEnd ? parseInt(verseEnd, 10) : null;
    const verseRef = vEnd != null && vEnd > v ? `${ch}:${v}-${vEnd}` : `${ch}:${v}`;
    setReferenceLabelEn(`${book.nameEn} ${verseRef}`);
    setReferenceLabelVi(`${book.nameVi} ${verseRef}`);
    setReferenceLabelZh(book.nameZh ? `${book.nameZh} ${verseRef}` : "");
  }, [bookId, chapter, verse, verseEnd, books]);

  const selectedChapterRow = chapters.find((c) => String(c.chapterNumber) === chapter);
  const verseCount = selectedChapterRow?.verseCount ?? 0;
  const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1);
  const verseNum = parseInt(verse, 10);
  const verseEndNum = verseEnd ? parseInt(verseEnd, 10) : null;
  const validRange =
    !verseEnd ||
    (verseEndNum != null &&
      !Number.isNaN(verseEndNum) &&
      verseEndNum >= verseNum &&
      verseEndNum - verseNum <= 50);
  const hasContent =
    (contentVIE1923.trim() !== "" ||
      contentKJV.trim() !== "" ||
      contentNIV.trim() !== "" ||
      contentZH.trim() !== "") &&
    !!content;
  const canSubmit = !!bookId && !!chapter && !!verse && !!hasContent && validRange;

  return (
    <Form asChild className="contents">
      <InteractiveForm<AddVerseFields>
        className="flex flex-col gap-4"
        fields={[
          "flashCardSetId",
          "collectionId",
          "bookId",
          "chapter",
          "verse",
          "verseEnd",
          "referenceLabelEn",
          "referenceLabelVi",
          "referenceLabelZh",
          "contentVIE1923",
          "contentKJV",
          "contentNIV",
          "contentZH",
          "contentDisplayVIE",
          "contentDisplayKJV",
          "contentDisplayNIV",
          "contentDisplayZH",
          "general",
        ]}
        action={addVerse}
      >
        <FormErrorMessage name="general" match="unauthorized">
          Session expired. Please log in again.
        </FormErrorMessage>
        <FormErrorMessage name="general" match="set_required">
          Please select a set.
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
          Failed to save verse. Please try again.
        </FormErrorMessage>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">Set</label>
          <select
            name="flashCardSetId"
            required
            disabled={setsLoading}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
          >
            <option value="">Select set</option>
            {sets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Collection
          </label>
          <select
            name="collectionId"
            disabled={collectionsLoading}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
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
            onChange={(e) => setBookId(e.target.value)}
            required
            disabled={booksLoading}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
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
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Chapter
            </label>
            <select
              name="chapter"
              value={chapter}
              onChange={(e) => {
                setChapter(e.target.value);
                setVerse("");
              }}
              required
              disabled={chaptersLoading || !bookId}
              className="w-full rounded-lg border border-stone-300 px-3 py-2
                text-stone-800 disabled:opacity-60"
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
              name="verse"
              value={verse}
              onChange={(e) => {
                setVerse(e.target.value);
                setVerseEnd("");
              }}
              required
              disabled={!verseCount}
              className="w-full rounded-lg border border-stone-300 px-3 py-2
                text-stone-800 disabled:opacity-60"
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
              className="w-full rounded-lg border border-stone-300 px-3 py-2
                text-stone-800 disabled:opacity-60"
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
            <p className="mt-0.5 text-xs text-stone-500">
              e.g. 21 + end 22 → Luke 1:21-22 (one card, two verses)
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3">
          <p className="mb-2 text-sm font-medium text-stone-700">
            Reference label (optional)
          </p>
          <p className="mb-2 text-xs text-stone-500">
            Custom label for the card, e.g. &quot;Isaiah 50:4b&quot;. Link still goes to the
            verse above.
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <label className="mb-0.5 block text-xs text-stone-600">EN</label>
              <input
                type="text"
                name="referenceLabelEn"
                value={referenceLabelEn}
                onChange={(e) => setReferenceLabelEn(e.target.value)}
                placeholder="e.g. Isaiah 50:4b"
                className="w-full rounded border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-stone-600">VI</label>
              <input
                type="text"
                name="referenceLabelVi"
                value={referenceLabelVi}
                onChange={(e) => setReferenceLabelVi(e.target.value)}
                className="w-full rounded border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-xs text-stone-600">中</label>
              <input
                type="text"
                name="referenceLabelZh"
                value={referenceLabelZh}
                onChange={(e) => setReferenceLabelZh(e.target.value)}
                className="w-full rounded border border-stone-300 px-2 py-1.5 text-sm text-stone-800"
              />
            </div>
          </div>
        </div>

        {contentLoading && bookId && chapter && verse && (
          <p className="text-sm text-stone-500">Loading content…</p>
        )}
        {!contentLoading && bookId && chapter && verse && !hasContent && content !== null && (
          <p className="text-sm text-amber-700">
            No content for this verse in the database. Add it to BibleVerseContent to
            enable Save.
          </p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700">
            Content (Vietnamese – traditional)
          </label>
          <textarea
            name="contentVIE1923"
            value={contentVIE1923}
            onChange={(e) => setContentVIE1923(e.target.value)}
            rows={3}
            disabled={content === null}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
          />
          <label className="mt-1 block text-xs text-stone-500">
            Display on card (optional) – only this part is shown if set
          </label>
          <textarea
            name="contentDisplayVIE"
            value={contentDisplayVIE}
            onChange={(e) => setContentDisplayVIE(e.target.value)}
            rows={2}
            placeholder="Leave empty to show full content above"
            className="mt-0.5 w-full rounded border border-stone-200 px-2 py-1.5 text-sm text-stone-700"
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
            disabled={content === null}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
          />
          <label className="mt-1 block text-xs text-stone-500">
            Display on card (optional)
          </label>
          <textarea
            name="contentDisplayKJV"
            value={contentDisplayKJV}
            onChange={(e) => setContentDisplayKJV(e.target.value)}
            rows={2}
            placeholder="e.g. only the second sentence"
            className="mt-0.5 w-full rounded border border-stone-200 px-2 py-1.5 text-sm text-stone-700"
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
            disabled={content === null}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
          />
          <label className="mt-1 block text-xs text-stone-500">
            Display on card (optional)
          </label>
          <textarea
            name="contentDisplayNIV"
            value={contentDisplayNIV}
            onChange={(e) => setContentDisplayNIV(e.target.value)}
            rows={2}
            className="mt-0.5 w-full rounded border border-stone-200 px-2 py-1.5 text-sm text-stone-700"
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
            disabled={content === null}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800
              disabled:opacity-60"
          />
          <label className="mt-1 block text-xs text-stone-500">
            Display on card (optional)
          </label>
          <textarea
            name="contentDisplayZH"
            value={contentDisplayZH}
            onChange={(e) => setContentDisplayZH(e.target.value)}
            rows={2}
            className="mt-0.5 w-full rounded border border-stone-200 px-2 py-1.5 text-sm text-stone-700"
          />
        </div>

        <SubmitButton
          disabled={!canSubmit}
          className="rounded-lg bg-stone-800 px-4 py-2 text-white hover:bg-stone-700
            disabled:opacity-50"
        >
          <SubmitMessage>Save to flash cards</SubmitMessage>
          <LoadingMessage>Saving…</LoadingMessage>
        </SubmitButton>
      </InteractiveForm>
    </Form>
  );
}
