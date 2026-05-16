"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import type { InteractiveFormResult } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import type { StudyListFields } from "@/components/Bible/Study/constants";
import type {
  BibleStudyList,
  BibleStudyListWithCount,
  BibleStudyNote,
  BibleStudyHighlight,
  BibleStudyPassage,
} from "@/types/bible-study";

// ─── helpers ────────────────────────────────────────────────────────────────

async function requireOwner(listId: string, userId: string) {
  const list = await prisma.bibleStudyList.findFirst({
    where: { id: listId, clerkUserId: userId },
  });
  if (!list) throw new Error("not_found");
  return list;
}

// ─── LIST: read ──────────────────────────────────────────────────────────────

export async function getStudyListsForCurrentUser(): Promise<BibleStudyListWithCount[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const lists = await prisma.bibleStudyList.findMany({
    where: { clerkUserId: userId, isArchived: false },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { passages: true } } },
  });

  const listIds = lists.map((l) => l.id);
  const studiedGroups = listIds.length
    ? await prisma.bibleStudyPassage.groupBy({
        by: ["listId"],
        where: { listId: { in: listIds }, isStudied: true },
        _count: { id: true },
      })
    : [];
  const studiedMap = Object.fromEntries(studiedGroups.map((g) => [g.listId, g._count.id]));

  return lists.map((l) => ({
    id: l.id,
    clerkUserId: l.clerkUserId,
    title: l.title,
    description: l.description,
    tags: l.tags,
    isFavorite: l.isFavorite,
    isArchived: l.isArchived,
    isPublic: l.isPublic,
    publicSlug: l.publicSlug,
    sortOrder: l.sortOrder,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
    passageCount: l._count.passages,
    studiedCount: studiedMap[l.id] ?? 0,
  }));
}

export async function getArchivedStudyLists(): Promise<BibleStudyListWithCount[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const lists = await prisma.bibleStudyList.findMany({
    where: { clerkUserId: userId, isArchived: true },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { passages: true } } },
  });

  const listIds = lists.map((l) => l.id);
  const studiedGroups = listIds.length
    ? await prisma.bibleStudyPassage.groupBy({
        by: ["listId"],
        where: { listId: { in: listIds }, isStudied: true },
        _count: { id: true },
      })
    : [];
  const studiedMap = Object.fromEntries(studiedGroups.map((g) => [g.listId, g._count.id]));

  return lists.map((l) => ({
    id: l.id,
    clerkUserId: l.clerkUserId,
    title: l.title,
    description: l.description,
    tags: l.tags,
    isFavorite: l.isFavorite,
    isArchived: l.isArchived,
    isPublic: l.isPublic,
    publicSlug: l.publicSlug,
    sortOrder: l.sortOrder,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
    passageCount: l._count.passages,
    studiedCount: studiedMap[l.id] ?? 0,
  }));
}

export async function getStudyListById(
  listId: string | null | undefined
): Promise<BibleStudyList | null> {
  if (!listId) return null;
  const list = await prisma.bibleStudyList.findUnique({ where: { id: listId } });
  if (!list) return null;
  return {
    id: list.id,
    clerkUserId: list.clerkUserId,
    title: list.title,
    description: list.description,
    tags: list.tags,
    isFavorite: list.isFavorite,
    isArchived: list.isArchived,
    isPublic: list.isPublic,
    publicSlug: list.publicSlug,
    sortOrder: list.sortOrder,
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
  };
}

export async function getPublicStudyList(slug: string): Promise<{
  list: BibleStudyList;
  passages: BibleStudyPassage[];
} | null> {
  const list = await prisma.bibleStudyList.findUnique({
    where: { publicSlug: slug },
    include: { passages: { orderBy: [{ bookId: "asc" }, { chapter: "asc" }] } },
  });
  if (!list || !list.isPublic) return null;
  return {
    list: {
      id: list.id,
      clerkUserId: list.clerkUserId,
      title: list.title,
      description: list.description,
      tags: list.tags,
      isFavorite: list.isFavorite,
      isArchived: list.isArchived,
      isPublic: list.isPublic,
      publicSlug: list.publicSlug,
      sortOrder: list.sortOrder,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    },
    passages: list.passages.map((p) => ({
      id: p.id,
      listId: p.listId,
      bookId: p.bookId,
      chapter: p.chapter,
      verseStart: p.verseStart,
      verseEnd: p.verseEnd,
      isStudied: p.isStudied,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })),
  };
}

// ─── LIST: write ─────────────────────────────────────────────────────────────

export async function createStudyList(
  formData: FormData
): Promise<InteractiveFormResult<StudyListFields>> {
  const { userId } = await auth();
  if (!userId) return { errors: { general: ["unauthorized"] } };

  const title = (formData.get("title") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();
  if (!title) return { errors: { title: ["required"] } };

  try {
    await prisma.bibleStudyList.create({
      data: { clerkUserId: userId, title, description: description || null },
    });
    return { refresh: true, result: { created: true } };
  } catch (e) {
    console.error("createStudyList action", e);
    return { errors: { general: ["save_failed"] } };
  }
}

export async function updateStudyList(params: {
  listId: string;
  title?: string;
  description?: string;
  tags?: string[];
}): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(params.listId, userId);
  await prisma.bibleStudyList.update({
    where: { id: params.listId },
    data: {
      ...(params.title !== undefined && { title: params.title }),
      ...(params.description !== undefined && { description: params.description || null }),
      ...(params.tags !== undefined && { tags: params.tags }),
    },
  });
}

export async function toggleFavorite(listId: string): Promise<{ isFavorite: boolean }> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  const list = await requireOwner(listId, userId);
  const updated = await prisma.bibleStudyList.update({
    where: { id: listId },
    data: { isFavorite: !list.isFavorite },
  });
  return { isFavorite: updated.isFavorite };
}

export async function archiveStudyList(listId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(listId, userId);
  await prisma.bibleStudyList.update({
    where: { id: listId },
    data: { isArchived: true, isFavorite: false },
  });
}

export async function unarchiveStudyList(listId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(listId, userId);
  await prisma.bibleStudyList.update({
    where: { id: listId },
    data: { isArchived: false },
  });
}

export async function deleteStudyList(listId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) return;
  await prisma.bibleStudyList.deleteMany({ where: { id: listId, clerkUserId: userId } });
}

export async function togglePublicShare(listId: string): Promise<{ isPublic: boolean; publicSlug: string | null }> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  const list = await requireOwner(listId, userId);
  if (list.isPublic) {
    const updated = await prisma.bibleStudyList.update({
      where: { id: listId },
      data: { isPublic: false },
    });
    return { isPublic: false, publicSlug: updated.publicSlug };
  }
  const slug = list.publicSlug ?? nanoid(10);
  const updated = await prisma.bibleStudyList.update({
    where: { id: listId },
    data: { isPublic: true, publicSlug: slug },
  });
  return { isPublic: true, publicSlug: updated.publicSlug };
}

export async function reorderStudyLists(orderedIds: string[]): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await Promise.all(
    orderedIds.map((id, idx) =>
      prisma.bibleStudyList.updateMany({
        where: { id, clerkUserId: userId },
        data: { sortOrder: idx },
      })
    )
  );
}

// ─── PASSAGES ────────────────────────────────────────────────────────────────

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
      isStudied: p.isStudied,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  } catch (err: unknown) {
    if (err && typeof err === "object" && (err as { code?: string }).code === "P2021") return [];
    throw err;
  }
}

export async function toggleStudyPassage(params: {
  listId: string;
  bookId: string;
  chapter: number;
  verseStart?: number | null;
  verseEnd?: number | null;
}): Promise<{ added: boolean }> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");

  const { listId, bookId, chapter, verseStart = null, verseEnd = null } = params;

  try {
    await requireOwner(listId, userId);
    const existing = await prisma.bibleStudyPassage.findFirst({
      where: { listId, bookId, chapter, verseStart, verseEnd },
    });
    if (existing) {
      await prisma.bibleStudyPassage.delete({ where: { id: existing.id } });
      return { added: false };
    }
    await prisma.bibleStudyPassage.create({
      data: { listId, bookId, chapter, verseStart, verseEnd },
    });
    return { added: true };
  } catch (err: unknown) {
    if (err && typeof err === "object" && (err as { code?: string }).code === "P2021") return { added: true };
    throw err;
  }
}

export async function markChapterStudied(params: {
  listId: string;
  bookId: string;
  chapter: number;
  studied: boolean;
}): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(params.listId, userId);
  await prisma.bibleStudyPassage.updateMany({
    where: { listId: params.listId, bookId: params.bookId, chapter: params.chapter },
    data: { isStudied: params.studied },
  });
}

export async function saveStudyPassages(params: {
  listId: string;
  chapters: { bookId: string; chapter: number }[];
}): Promise<{ count: number }> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(params.listId, userId);

  const unique = Array.from(
    new Map(params.chapters.map((c) => [`${c.bookId}:${c.chapter}`, c])).values()
  );

  try {
    await prisma.bibleStudyPassage.deleteMany({ where: { listId: params.listId } });
    if (unique.length === 0) return { count: 0 };
    const result = await prisma.bibleStudyPassage.createMany({
      data: unique.map((c) => ({ listId: params.listId, bookId: c.bookId, chapter: c.chapter })),
      skipDuplicates: true,
    });
    return { count: result.count };
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : null;
    if (code === "P2021") return { count: 0 };
    throw err;
  }
}

// ─── NOTES ───────────────────────────────────────────────────────────────────

export async function getNotesForList(listId: string): Promise<BibleStudyNote[]> {
  const { userId } = await auth();
  if (!userId) return [];
  await requireOwner(listId, userId);
  const rows = await prisma.bibleStudyNote.findMany({
    where: { listId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map((n) => ({
    id: n.id,
    listId: n.listId,
    bookId: n.bookId,
    chapter: n.chapter,
    verseNumber: n.verseNumber,
    content: n.content,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  }));
}

export async function saveNote(params: {
  listId: string;
  bookId: string;
  chapter: number;
  verseNumber?: number | null;
  content: string;
  noteId?: string;
}): Promise<BibleStudyNote> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(params.listId, userId);

  const data = {
    listId: params.listId,
    bookId: params.bookId,
    chapter: params.chapter,
    verseNumber: params.verseNumber ?? null,
    content: params.content.trim(),
  };

  let row;
  if (params.noteId) {
    row = await prisma.bibleStudyNote.update({ where: { id: params.noteId }, data });
  } else {
    row = await prisma.bibleStudyNote.create({ data });
  }
  return {
    id: row.id,
    listId: row.listId,
    bookId: row.bookId,
    chapter: row.chapter,
    verseNumber: row.verseNumber,
    content: row.content,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function deleteNote(noteId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  const note = await prisma.bibleStudyNote.findUnique({ where: { id: noteId } });
  if (!note) return;
  await requireOwner(note.listId, userId);
  await prisma.bibleStudyNote.delete({ where: { id: noteId } });
}

// ─── HIGHLIGHTS ──────────────────────────────────────────────────────────────

export async function getHighlightsForList(listId: string): Promise<BibleStudyHighlight[]> {
  const { userId } = await auth();
  if (!userId) return [];
  await requireOwner(listId, userId);
  const rows = await prisma.bibleStudyHighlight.findMany({ where: { listId } });
  return rows.map((h) => ({
    id: h.id,
    listId: h.listId,
    bookId: h.bookId,
    chapter: h.chapter,
    verseNumber: h.verseNumber,
    color: h.color as BibleStudyHighlight["color"],
    createdAt: h.createdAt,
  }));
}

export async function toggleHighlight(params: {
  listId: string;
  bookId: string;
  chapter: number;
  verseNumber: number;
  color: string;
}): Promise<{ added: boolean }> {
  const { userId } = await auth();
  if (!userId) throw new Error("unauthorized");
  await requireOwner(params.listId, userId);

  const existing = await prisma.bibleStudyHighlight.findUnique({
    where: {
      listId_bookId_chapter_verseNumber: {
        listId: params.listId,
        bookId: params.bookId,
        chapter: params.chapter,
        verseNumber: params.verseNumber,
      },
    },
  });

  if (existing) {
    if (existing.color === params.color) {
      await prisma.bibleStudyHighlight.delete({ where: { id: existing.id } });
      return { added: false };
    }
    await prisma.bibleStudyHighlight.update({
      where: { id: existing.id },
      data: { color: params.color },
    });
    return { added: true };
  }

  await prisma.bibleStudyHighlight.create({
    data: {
      listId: params.listId,
      bookId: params.bookId,
      chapter: params.chapter,
      verseNumber: params.verseNumber,
      color: params.color,
    },
  });
  return { added: true };
}
