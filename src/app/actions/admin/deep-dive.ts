"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type DeepDiveFormData = {
  slug: string;
  lang: string;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  reflection: string;
  application?: string;
  prayer?: string;
  isPublished: boolean;
  publishedAt?: string;
};

export async function listDeepDives() {
  return prisma.bibleDeepDive.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getDeepDive(id: string) {
  return prisma.bibleDeepDive.findUnique({ where: { id } });
}

export async function createDeepDive(data: DeepDiveFormData) {
  const entry = await prisma.bibleDeepDive.create({
    data: {
      slug: data.slug.trim().toLowerCase(),
      lang: data.lang,
      title: data.title.trim(),
      scriptureRef: data.scriptureRef.trim(),
      scriptureText: data.scriptureText.trim(),
      reflection: data.reflection.trim(),
      application: data.application?.trim() || null,
      prayer: data.prayer?.trim() || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
    },
  });
  revalidatePath("/admin/deep-dive");
  revalidatePath("/bible/en/learn/deep-dive");
  revalidatePath("/bible/vi/learn/deep-dive");
  return entry;
}

export async function updateDeepDive(id: string, data: DeepDiveFormData) {
  const entry = await prisma.bibleDeepDive.update({
    where: { id },
    data: {
      slug: data.slug.trim().toLowerCase(),
      lang: data.lang,
      title: data.title.trim(),
      scriptureRef: data.scriptureRef.trim(),
      scriptureText: data.scriptureText.trim(),
      reflection: data.reflection.trim(),
      application: data.application?.trim() || null,
      prayer: data.prayer?.trim() || null,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) : null,
    },
  });
  revalidatePath("/admin/deep-dive");
  revalidatePath("/bible/en/learn/deep-dive");
  revalidatePath("/bible/vi/learn/deep-dive");
  return entry;
}

export async function deleteDeepDive(id: string) {
  await prisma.bibleDeepDive.delete({ where: { id } });
  revalidatePath("/admin/deep-dive");
  revalidatePath("/bible/en/learn/deep-dive");
  revalidatePath("/bible/vi/learn/deep-dive");
}

export async function togglePublish(id: string, isPublished: boolean) {
  await prisma.bibleDeepDive.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });
  revalidatePath("/admin/deep-dive");
  revalidatePath("/bible/en/learn/deep-dive");
  revalidatePath("/bible/vi/learn/deep-dive");
}

export async function getLatestPublishedDeepDive(lang: string) {
  const now = new Date();
  return prisma.bibleDeepDive.findFirst({
    where: {
      lang,
      isPublished: true,
      publishedAt: { lte: now },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedDeepDiveArchive(lang: string, excludeId?: string) {
  const now = new Date();
  return prisma.bibleDeepDive.findMany({
    where: {
      lang,
      isPublished: true,
      publishedAt: { lte: now },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 12,
  });
}
