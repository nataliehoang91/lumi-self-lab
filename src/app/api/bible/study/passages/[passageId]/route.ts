import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function requirePassageOwner(passageId: string, userId: string) {
  const passage = await prisma.bibleStudyPassage.findFirst({
    where: { id: passageId },
    include: { list: { select: { clerkUserId: true } } },
  });
  if (!passage || passage.list.clerkUserId !== userId) return null;
  return passage;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ passageId: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { passageId } = await params;
  const passage = await requirePassageOwner(passageId, userId);
  if (!passage) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.bibleStudyPassage.update({
    where: { id: passageId },
    data: { ...(body.isStudied !== undefined && { isStudied: body.isStudied }) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ passageId: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { passageId } = await params;
  const passage = await requirePassageOwner(passageId, userId);
  if (!passage) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.bibleStudyPassage.delete({ where: { id: passageId } });
  return NextResponse.json({ ok: true });
}
