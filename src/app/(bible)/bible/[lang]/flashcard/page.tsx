import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { parseSearchParams } from "../../flashcard/params";
import { CardSkeleton } from "@/components/Bible/FlashCard/CardSkeleton";
import { CardWithData } from "@/components/Bible/FlashCard/CardWithData";
import { FlashCardShell } from "@/components/Bible/FlashCard/FlashCardShell";
import type { Language } from "@/components/Bible/BibleAppContext";

const MAX_IDS = 500;

export const metadata: Metadata = {
  title: "Flashcards",
  description:
    "Memorise and review Bible verses. Use flashcards and the glossary to deepen your understanding.",
};

function routeLangToLanguage(lang: string): Language {
  if (lang === "vi") return "VI";
  if (lang === "zh") return "ZH";
  return "EN";
}

async function getFlashcardIds(collectionId?: string) {
  const rows = await prisma.flashVerse.findMany({
    where: collectionId ? { collectionId } : undefined,
    orderBy: { createdAt: "desc" },
    take: MAX_IDS,
    select: { id: true },
  });
  return rows.map((r: { id: string }) => r.id);
}

async function getCollections() {
  return prisma.flashCardCollection.findMany({
    orderBy: { sortOrder: "desc" },
    select: { id: true, name: true },
  });
}

export default async function FlashcardPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { lang } = await params;

  const routeLang = routeLangToLanguage(lang);
  const paramsFromUrl = await searchParams;
  const parsed = parseSearchParams(paramsFromUrl);
  const langFromRoute = routeLang;
  const effectiveLang = langFromRoute;

  const collections = await getCollections();
  const effectiveCollection = parsed.collection?.trim() || collections[0]?.id;
  const ids = await getFlashcardIds(effectiveCollection || undefined);

  const isAll = parsed.layout === "all";
  const visibleCount = isAll ? Math.min(parsed.limit, ids.length) : 1;
  const slice = isAll
    ? ids.slice(0, visibleCount)
    : ids.slice(parsed.index, parsed.index + visibleCount);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex w-full flex-1 flex-col">
        <FlashCardShell
          ids={ids}
          index={parsed.index}
          layout={parsed.layout}
          lang={effectiveLang}
          collections={collections}
          collectionId={effectiveCollection || undefined}
          displayCount={isAll ? visibleCount : undefined}
        >
          {slice.map((verseId: string) => (
            <div key={verseId} className={isAll ? "min-w-0" : undefined}>
              <Suspense fallback={<CardSkeleton horizontal={false} />}>
                <CardWithData
                  verseId={verseId}
                  lang={effectiveLang}
                  horizontal={false}
                  flexible={isAll}
                />
              </Suspense>
            </div>
          ))}
        </FlashCardShell>
      </div>
    </div>
  );
}
