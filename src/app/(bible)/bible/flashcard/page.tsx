import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { parseSearchParams } from "./params";
import { CardSkeleton } from "@/components/Bible/FlashCard/CardSkeleton";
import { CardWithData } from "@/components/Bible/FlashCard/CardWithData";
import { FlashCardShell } from "@/components/Bible/FlashCard/FlashCardShell";

const MAX_IDS = 500;

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
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { index, layout, font, lang, limit, collection } = parseSearchParams(params);
  const [ids, collections] = await Promise.all([
    getFlashcardIds(collection || undefined),
    getCollections(),
  ]);

  const isAll = layout === "all";
  const visibleCount = isAll ? Math.min(limit, ids.length) : 1;
  const slice = isAll ? ids.slice(0, visibleCount) : ids.slice(index, index + visibleCount);
  const horizontal = layout === "horizontal";

  return (
    <div className="min-h-screen pt-14 flex flex-col w-full">
      <div className="w-full flex flex-col flex-1">
        <FlashCardShell
          ids={ids}
          index={index}
          layout={layout}
          fontSize={font}
          lang={lang}
          collections={collections}
          collectionId={collection || undefined}
          displayCount={isAll ? visibleCount : undefined}
        >
          {slice.map((verseId: string) => (
            <div key={verseId} className={isAll ? "min-w-0" : undefined}>
              <Suspense fallback={<CardSkeleton horizontal={horizontal && !isAll} />}>
                <CardWithData
                  verseId={verseId}
                  lang={lang}
                  horizontal={horizontal && !isAll}
                  fontSize={font}
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
