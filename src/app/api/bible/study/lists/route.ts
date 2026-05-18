import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const lists = await prisma.bibleStudyList.findMany({
    where: { clerkUserId: userId, isArchived: false },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { passages: true } },
      passages: { select: { isStudied: true } },
    },
  });

  return NextResponse.json(
    lists.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      tags: l.tags,
      isFavorite: l.isFavorite,
      isArchived: l.isArchived,
      passageCount: l._count.passages,
      studiedCount: l.passages.filter((p) => p.isStudied).length,
      createdAt: l.createdAt,
    }))
  );
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description } = body as { title: string; description?: string };
  if (!title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

  const list = await prisma.bibleStudyList.create({
    data: {
      id: nanoid(),
      clerkUserId: userId,
      title: title.trim(),
      description: description?.trim() || null,
    },
  });

  return NextResponse.json({ id: list.id, title: list.title, description: list.description, tags: list.tags, isFavorite: list.isFavorite, passageCount: 0, studiedCount: 0, createdAt: list.createdAt }, { status: 201 });
}
