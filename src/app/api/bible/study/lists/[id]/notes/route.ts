import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const list = await prisma.bibleStudyList.findFirst({ where: { id, clerkUserId: userId } });
  if (!list) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const notes = await prisma.bibleStudyNote.findMany({ where: { listId: id }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(notes);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const list = await prisma.bibleStudyList.findFirst({ where: { id, clerkUserId: userId } });
  if (!list) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json();
  const { bookId, chapter, verseNumber, content } = body as { bookId: string; chapter: number; verseNumber?: number; content: string };
  if (!bookId || !chapter || !content) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  const existing = await prisma.bibleStudyNote.findFirst({ where: { listId: id, bookId, chapter, verseNumber: verseNumber ?? null } });
  if (existing) {
    const updated = await prisma.bibleStudyNote.update({ where: { id: existing.id }, data: { content } });
    return NextResponse.json(updated);
  }
  const note = await prisma.bibleStudyNote.create({
    data: { id: nanoid(), listId: id, bookId, chapter, verseNumber: verseNumber ?? null, content },
  });
  return NextResponse.json(note, { status: 201 });
}
