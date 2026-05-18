"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type LangContent = {
  title: string;
  scriptureText: string;
  reflection: string;
  application?: string;
  prayer?: string;
  isPublished: boolean;
  publishedAt?: string;
};

export type DeepDivePairData = {
  slug: string;
  scriptureRef: string;
  coverImage?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  en: LangContent;
  vi: LangContent;
};

function buildRecord(slug: string, scriptureRef: string, coverImage: string | undefined, sourceUrl: string | undefined, sourceLabel: string | undefined, lang: string, c: LangContent) {
  return {
    slug: slug.trim().toLowerCase(),
    lang,
    title: c.title.trim(),
    scriptureRef: scriptureRef.trim(),
    scriptureText: c.scriptureText.trim(),
    coverImage: coverImage?.trim() || null,
    sourceUrl: sourceUrl?.trim() || null,
    sourceLabel: sourceLabel?.trim() || null,
    reflection: c.reflection.trim(),
    application: c.application?.trim() || null,
    prayer: c.prayer?.trim() || null,
    isPublished: c.isPublished,
    publishedAt: c.isPublished ? (c.publishedAt ? new Date(c.publishedAt) : new Date()) : null,
  };
}

function revalidateAll() {
  revalidatePath("/admin/deep-dive");
  revalidatePath("/bible/en/learn/deep-dive");
  revalidatePath("/bible/vi/learn/deep-dive");
}

export async function listDeepDives() {
  // Return unique slugs with both language versions grouped
  const all = await prisma.bibleDeepDive.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  // Deduplicate by slug — keep latest of each slug
  const seen = new Set<string>();
  return all.filter((e) => {
    if (seen.has(e.slug)) return false;
    seen.add(e.slug);
    return true;
  });
}

export async function getDeepDivePair(slug: string) {
  const [en, vi] = await Promise.all([
    prisma.bibleDeepDive.findUnique({ where: { slug_lang: { slug, lang: "en" } } }),
    prisma.bibleDeepDive.findUnique({ where: { slug_lang: { slug, lang: "vi" } } }),
  ]);
  return { en, vi };
}

export async function upsertDeepDivePair(data: DeepDivePairData) {
  const slug = data.slug.trim().toLowerCase();

  await Promise.all([
    prisma.bibleDeepDive.upsert({
      where: { slug_lang: { slug, lang: "en" } },
      create: buildRecord(slug, data.scriptureRef, data.coverImage, data.sourceUrl, data.sourceLabel, "en", data.en),
      update: buildRecord(slug, data.scriptureRef, data.coverImage, data.sourceUrl, data.sourceLabel, "en", data.en),
    }),
    prisma.bibleDeepDive.upsert({
      where: { slug_lang: { slug, lang: "vi" } },
      create: buildRecord(slug, data.scriptureRef, data.coverImage, data.sourceUrl, data.sourceLabel, "vi", data.vi),
      update: buildRecord(slug, data.scriptureRef, data.coverImage, data.sourceUrl, data.sourceLabel, "vi", data.vi),
    }),
  ]);

  revalidateAll();
}

export async function deleteDeepDive(slug: string) {
  await prisma.bibleDeepDive.deleteMany({ where: { slug } });
  revalidateAll();
}

export async function getDeepDiveTranslation(slug: string, lang: string) {
  return prisma.bibleDeepDive.findUnique({
    where: { slug_lang: { slug, lang } },
    select: { id: true, slug: true, lang: true, isPublished: true },
  });
}

export async function getLatestPublishedDeepDive(lang: string) {
  const now = new Date();
  return prisma.bibleDeepDive.findFirst({
    where: { lang, isPublished: true, publishedAt: { lte: now } },
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
    take: 20,
  });
}
