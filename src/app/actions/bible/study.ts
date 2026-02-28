"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { InteractiveFormResult } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import type { StudyListFields } from "@/components/Bible/Study/constants";
import type { BibleStudyList, BibleStudyPassage } from "@/types/bible-study";

export async function getStudyListsForCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  return prisma.bibleStudyList.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStudyListById(listId: string | null | undefined): Promise<BibleStudyList | null> {
  if (!listId) return null;

  const list = await prisma.bibleStudyList.findUnique({
    where: { id: listId },
  });
  if (!list) return null;
  return {
    id: list.id,
    clerkUserId: list.clerkUserId,
    title: list.title,
    description: list.description,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}

export async function getPassagesForStudyList(
  listId: string | null | undefined
): Promise<BibleStudyPassage[]> {
  if (!listId) return [];

  try {
    const rows = await prisma.bibleStudyPassage.findMany({
      where: { listId },
      orderBy: [{ bookId: "asc" }, { chapter: "asc" }],
    });
    return rows.map((p) => ({
      id: p.id,
      listId: p.listId,
      bookId: p.bookId,
      chapter: p.chapter,
      verseStart: p.verseStart,
      verseEnd: p.verseEnd,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (err: any) {
    // If the new BibleStudyPassage table has not been migrated yet,
    // Prisma throws a "table does not exist" error (code P2021).
    // In that case we treat it as "no passages yet" so the UI can still render.
    if (err && typeof err === "object" && (err as any).code === "P2021") {
      console.warn(
        "BibleStudyPassage table not found in database; returning empty passages list."
      );
      return [];
    }
    throw err;
  }
}

export async function toggleStudyPassage(params: {
  listId: string;
  bookId: string;
  chapter: number;
}): Promise<{ added: boolean }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }

  try {
    // Ensure the list belongs to the current user
    const list = await prisma.bibleStudyList.findFirst({
      where: { id: params.listId, clerkUserId: userId },
    });
    if (!list) {
      throw new Error("not_found");
    }

    const existing = await prisma.bibleStudyPassage.findFirst({
      where: {
        listId: params.listId,
        bookId: params.bookId,
        chapter: params.chapter,
        verseStart: null,
        verseEnd: null,
      },
    });

    if (existing) {
      await prisma.bibleStudyPassage.delete({
        where: { id: existing.id },
      });
      return { added: false };
    }

    await prisma.bibleStudyPassage.create({
      data: {
        listId: params.listId,
        bookId: params.bookId,
        chapter: params.chapter,
      },
    });
    return { added: true };
  } catch (err: any) {
    // If the BibleStudyPassage table doesn't exist yet (P2021), or some other
    // schema issue occurs, swallow the error so the caller can fall back to
    // client-only toggling without breaking the page in dev.
    if (err && typeof err === "object" && (err as any).code === "P2021") {
      console.warn(
        "BibleStudyPassage table not found in database during toggleStudyPassage; skipping persistence."
      );
      return { added: true };
    }
    throw err;
  }
}

export async function saveStudyPassages(params: {
  listId: string;
  chapters: { bookId: string; chapter: number }[];
}): Promise<{ count: number }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("unauthorized");
  }

  const list = await prisma.bibleStudyList.findFirst({
    where: { id: params.listId, clerkUserId: userId },
  });
  if (!list) {
    throw new Error("not_found");
  }

  const unique = Array.from(
    new Map(
      params.chapters.map((c) => [`${c.bookId}:${c.chapter}`, c]),
    ).values(),
  );

  try {
    await prisma.bibleStudyPassage.deleteMany({
      where: { listId: params.listId },
    });

    if (unique.length === 0) {
      return { count: 0 };
    }

    const result = await prisma.bibleStudyPassage.createMany({
      data: unique.map((c) => ({
        listId: params.listId,
        bookId: c.bookId,
        chapter: c.chapter,
      })),
      skipDuplicates: true,
    });

    return { count: result.count };
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
    if (code === "P2021") {
      console.warn(
        "BibleStudyPassage table not found; run `npx prisma migrate dev` to persist study passages."
      );
      return { count: 0 };
    }
    throw err;
  }
}

export async function createStudyList(
  formData: FormData
): Promise<InteractiveFormResult<StudyListFields>> {
  const { userId } = await auth();

  if (!userId) {
    return { errors: { general: ["unauthorized"] } };
  }

  const title = (formData.get("title") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();

  if (!title) {
    return { errors: { title: ["required"] } };
  }

  try {
    await prisma.bibleStudyList.create({
      data: {
        clerkUserId: userId,
        title,
        description: description || null,
      },
    });

    return {
      refresh: true,
      result: { created: true },
    };
  } catch (e) {
    console.error("createStudyList action", e);
    return { errors: { general: ["save_failed"] } };
  }
}

export async function deleteStudyList(listId: string) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  await prisma.bibleStudyList.deleteMany({
    where: { id: listId, clerkUserId: userId },
  });
}
