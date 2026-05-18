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

  const passages = await prisma.bibleStudyPassage.findMany({
    where: { listId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(passages);
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;

  const list = await prisma.bibleStudyList.findFirst({ where: { id, clerkUserId: userId } });
  if (!list) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json();
  const { bookId, chapter } = body as { bookId: string; chapter: number };
  if (!bookId || !chapter) return NextResponse.json({ error: "bookId and chapter required" }, { status: 400 });

  const existing = await prisma.bibleStudyPassage.findFirst({ where: { listId: id, bookId, chapter, verseStart: null } });
  if (existing) return NextResponse.json(existing);

  const passage = await prisma.bibleStudyPassage.create({
    data: { id: nanoid(), listId: id, bookId, chapter },
  });
  return NextResponse.json(passage, { status: 201 });
}
