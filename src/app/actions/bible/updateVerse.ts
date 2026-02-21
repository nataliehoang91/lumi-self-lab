"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type UpdateVerseResult = {
  errors?: { general?: string[] };
  redirect?: string;
  refresh?: boolean;
  result?: { updated: true };
};

export async function updateVerse(
  verseId: string,
  formData: FormData
): Promise<UpdateVerseResult> {
  const cookieStore = await cookies();
  if (cookieStore.get("is_admin")?.value !== "true") {
    return { errors: { general: ["unauthorized"] } };
  }

  const bookId = (formData.get("bookId") as string)?.trim();
  const flashCardSetIdRaw = formData.get("flashCardSetId");
  const flashCardSetId =
    flashCardSetIdRaw === null || flashCardSetIdRaw === "" ? null : (flashCardSetIdRaw as string)?.trim();
  const collectionIdRaw = formData.get("collectionId");
  const collectionId =
    collectionIdRaw === null || collectionIdRaw === "" ? null : (collectionIdRaw as string)?.trim();
  const chapterRaw = formData.get("chapter");
  const verseRaw = formData.get("verse");
  const verseEndRaw = formData.get("verseEnd");
  const chapter = chapterRaw != null ? Number(chapterRaw) : NaN;
  const verse = verseRaw != null ? Number(verseRaw) : NaN;
  const verseEnd =
    verseEndRaw != null && String(verseEndRaw).trim() !== ""
      ? Number(verseEndRaw)
      : null;

  if (!bookId) {
    return { errors: { general: ["book_required"] } };
  }
  if (!Number.isFinite(chapter) || chapter < 1) {
    return { errors: { general: ["invalid_chapter"] } };
  }
  if (!Number.isFinite(verse) || verse < 1) {
    return { errors: { general: ["invalid_verse"] } };
  }
  if (
    verseEnd != null &&
    (!Number.isFinite(verseEnd) || verseEnd < verse || verseEnd > verse + 50)
  ) {
    return { errors: { general: ["invalid_verse_end"] } };
  }

  const bibleBook = await prisma.bibleBook.findUnique({
    where: { id: bookId },
  });
  if (!bibleBook) {
    return { errors: { general: ["book_not_found"] } };
  }
  if (chapter > bibleBook.chapterCount) {
    return {
      errors: {
        general: ["chapter_out_of_range"],
      },
    };
  }

  const trimVI = (formData.get("contentVIE1923") as string)?.trim() ?? "";
  const trimKJV = (formData.get("contentKJV") as string)?.trim() ?? "";
  const trimNIV = (formData.get("contentNIV") as string)?.trim() ?? "";
  const trimZH = (formData.get("contentZH") as string)?.trim() ?? "";
  const hasContent = trimVI !== "" || trimKJV !== "" || trimNIV !== "" || trimZH !== "";

  if (!hasContent) {
    return {
      errors: {
        general: ["content_required"],
      },
    };
  }

  if (flashCardSetId) {
    const setExists = await prisma.flashCardSet.findUnique({
      where: { id: flashCardSetId },
    });
    if (!setExists) {
      return { errors: { general: ["invalid_set"] } };
    }
  }

  if (collectionId) {
    const colExists = await prisma.flashCardCollection.findUnique({
      where: { id: collectionId },
    });
    if (!colExists) {
      return { errors: { general: ["invalid_collection"] } };
    }
  }

  const contentFallback = trimNIV || trimKJV || trimVI || trimZH;
  const verseRef =
    verseEnd != null && verseEnd > verse
      ? `${chapter}:${verse}-${verseEnd}`
      : `${chapter}:${verse}`;

  try {
    await prisma.flashVerse.update({
      where: { id: verseId },
      data: {
        flashCardSetId,
        collectionId,
        bookId: bibleBook.id,
        book: bibleBook.nameEn,
        chapter,
        verse,
        verseEnd: verseEnd != null && verseEnd > verse ? verseEnd : null,
        titleEn: `${bibleBook.nameEn} ${verseRef}`,
        titleVi: `${bibleBook.nameVi} ${verseRef}`,
        titleZh: bibleBook.nameZh ? `${bibleBook.nameZh} ${verseRef}` : null,
        contentVIE1923: trimVI || null,
        contentKJV: trimKJV || null,
        contentNIV: trimNIV || null,
        contentZH: trimZH || null,
        content: contentFallback,
      },
    });
    return { redirect: "/bible/admin/flashcard/list", refresh: true, result: { updated: true } };
  } catch (e) {
    console.error("updateVerse action", e);
    return { errors: { general: ["save_failed"] } };
  }
}
