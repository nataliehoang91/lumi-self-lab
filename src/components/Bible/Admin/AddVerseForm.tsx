"use client";

import { useState, useEffect, useCallback } from "react";
import {
  InteractiveForm,
  SubmitButton,
  SubmitMessage,
  LoadingMessage,
  FormErrorMessage,
  HiddenFormField,
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
  | "contentVIE1923"
  | "contentKJV"
  | "contentNIV"
  | "contentZH"
  | "general";

export function AddVerseForm() {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [sets, setSets] = useState<FlashCardSet[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [chapters, setChapters] = useState<ChapterRow[]>([]);
  const [bookId, setBookId] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
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
        setContent(null);
      }, 0);
      return () => clearTimeout(tid);
    }
    const tid = setTimeout(() => {
      setChaptersLoading(true);
      setChapter("");
      setVerse("");
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
      const tid = setTimeout(() => setContent(null), 0);
      return () => clearTimeout(tid);
    }
    const tid = setTimeout(() => fetchContent(), 0);
    return () => clearTimeout(tid);
  }, [bookId, chapter, verse, fetchContent]);

  const selectedChapterRow = chapters.find((c) => String(c.chapterNumber) === chapter);
  const verseCount = selectedChapterRow?.verseCount ?? 0;
  const verseOptions = Array.from({ length: verseCount }, (_, i) => i + 1);
  const hasContent =
    content &&
    (content.contentVIE1923 || content.contentKJV || content.contentNIV || content.contentZH);
  const canSubmit = !!bookId && !!chapter && !!verse && !!hasContent;

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
          "contentVIE1923",
          "contentKJV",
          "contentNIV",
          "contentZH",
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
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-800 disabled:opacity-60"
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
          <label className="mb-1 block text-sm font-medium text-stone-700">Collection</label>
          <select
            name="collectionId"
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
            onChange={(e) => setBookId(e.target.value)}
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

        {/* Hidden fields: submit content from pre-loaded verse (when user picks book/chapter/verse) */}
        {content && (
          <>
            <HiddenFormField
              name="contentVIE1923"
              value={content.contentVIE1923?.trim() ?? ""}
            />
            <HiddenFormField name="contentKJV" value={content.contentKJV?.trim() ?? ""} />
            <HiddenFormField name="contentNIV" value={content.contentNIV?.trim() ?? ""} />
            <HiddenFormField name="contentZH" value={content.contentZH?.trim() ?? ""} />
          </>
        )}

        {/* Content preview (read-only) */}
        {contentLoading && bookId && chapter && verse && (
          <p className="text-sm text-stone-500">Loading content…</p>
        )}
        {!contentLoading && bookId && chapter && verse && (
          <>
            {hasContent ? (
              <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm">
                {content?.contentVIE1923 && (
                  <div>
                    <span className="font-medium text-stone-600">Vietnamese (traditional):</span>
                    <p className="mt-1 text-stone-800">{content.contentVIE1923}</p>
                  </div>
                )}
                {content?.contentKJV && (
                  <div>
                    <span className="font-medium text-stone-600">KJV:</span>
                    <p className="mt-1 text-stone-800">{content.contentKJV}</p>
                  </div>
                )}
                {content?.contentNIV && (
                  <div>
                    <span className="font-medium text-stone-600">NIV:</span>
                    <p className="mt-1 text-stone-800">{content.contentNIV}</p>
                  </div>
                )}
                {content?.contentZH && (
                  <div>
                    <span className="font-medium text-stone-600">Chinese (CUV):</span>
                    <p className="mt-1 text-stone-800">{content.contentZH}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-amber-700">
                No content for this verse in the database. Add it to BibleVerseContent to enable
                Save.
              </p>
            )}
          </>
        )}

        <SubmitButton
          disabled={!canSubmit}
          className="rounded-lg bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 disabled:opacity-50"
        >
          <SubmitMessage>Save to flash cards</SubmitMessage>
          <LoadingMessage>Saving…</LoadingMessage>
        </SubmitButton>
      </InteractiveForm>
    </Form>
  );
}
