import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function requireOwner(listId: string, userId: string) {
  const list = await prisma.bibleStudyList.findFirst({ where: { id: listId, clerkUserId: userId } });
  if (!list) return null;
  return list;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;

  const list = await prisma.bibleStudyList.findFirst({
    where: { id, clerkUserId: userId },
    include: {
      passages: { orderBy: { createdAt: "asc" } },
      _count: { select: { passages: true } },
    },
  });
  if (!list) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({
    id: list.id,
    title: list.title,
    description: list.description,
    tags: list.tags,
    isFavorite: list.isFavorite,
    passageCount: list._count.passages,
    studiedCount: list.passages.filter((p) => p.isStudied).length,
    passages: list.passages,
    createdAt: list.createdAt,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const list = await requireOwner(id, userId);
  if (!list) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.bibleStudyList.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.tags !== undefined && { tags: body.tags }),
      ...(body.isFavorite !== undefined && { isFavorite: body.isFavorite }),
      ...(body.isArchived !== undefined && { isArchived: body.isArchived }),
    },
  });
  return NextResponse.json({ id: updated.id, title: updated.title });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const list = await requireOwner(id, userId);
  if (!list) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.bibleStudyList.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
