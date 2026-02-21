"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export type AddVerseResult = {
  errors?: { general?: string[] };
  refresh?: boolean;
  result?: { added: true };
};

export async function addVerse(formData: FormData): Promise<AddVerseResult> {
  const cookieStore = await cookies();
  if (cookieStore.get("is_admin")?.value !== "true") {
    return { errors: { general: ["unauthorized"] } };
  }

  const bookId = (formData.get("bookId") as string)?.trim();
  const flashCardSetId = (formData.get("flashCardSetId") as string)?.trim();
  const collectionId = (formData.get("collectionId") as string)?.trim() || null;
  const chapterRaw = formData.get("chapter");
  const verseRaw = formData.get("verse");
  const chapter = chapterRaw != null ? Number(chapterRaw) : NaN;
  const verse = verseRaw != null ? Number(verseRaw) : NaN;

  if (!bookId) {
    return { errors: { general: ["book_required"] } };
  }
  if (!flashCardSetId) {
    return { errors: { general: ["set_required"] } };
  }
  if (!Number.isFinite(chapter) || chapter < 1) {
    return { errors: { general: ["invalid_chapter"] } };
  }
  if (!Number.isFinite(verse) || verse < 1) {
    return { errors: { general: ["invalid_verse"] } };
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

  const setExists = await prisma.flashCardSet.findUnique({
    where: { id: flashCardSetId },
  });
  if (!setExists) {
    return { errors: { general: ["invalid_set"] } };
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

  try {
    await prisma.flashVerse.create({
      data: {
        flashCardSetId,
        collectionId,
        bookId: bibleBook.id,
        book: bibleBook.nameEn,
        chapter,
        verse,
        titleEn: `${bibleBook.nameEn} ${chapter}:${verse}`,
        titleVi: `${bibleBook.nameVi} ${chapter}:${verse}`,
        titleZh: bibleBook.nameZh ? `${bibleBook.nameZh} ${chapter}:${verse}` : null,
        contentVIE1923: trimVI || null,
        contentKJV: trimKJV || null,
        contentNIV: trimNIV || null,
        contentZH: trimZH || null,
        content: contentFallback,
      },
    });
    return { refresh: true, result: { added: true } };
  } catch (e) {
    console.error("addVerse action", e);
    return { errors: { general: ["save_failed"] } };
  }
}
