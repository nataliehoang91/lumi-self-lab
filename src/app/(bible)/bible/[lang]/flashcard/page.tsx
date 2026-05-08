import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getBooks } from "@/app/actions/bible/read";
import { getVersesByIds } from "@/app/actions/bible/getVerseById";
import { parseSearchParams } from "../../flashcard/params";
import { CardWithDataClient } from "@/components/Bible/FlashCard/CardWithDataClient";
import { FlashCardShell } from "@/components/Bible/FlashCard/FlashCardShell";
import { FlashcardBooksProvider } from "@/components/Bible/FlashCard/FlashcardBooksContext";
import type { Language } from "@/components/Bible/BibleAppContext";

const MAX_IDS = 500;

export const metadata: Metadata = {
  title: "Flashcards",
  description:
    "Memorise and review Bible verses. Use flashcards and the glossary to deepen your understanding.",
};

function routeLangToLanguage(lang: string): Language {
  if (lang === "vi") return "VI";
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
  const effectiveLang = routeLang;

  const [collections, books] = await Promise.all([getCollections(), getBooks()]);
  const effectiveCollection = parsed.collection?.trim() || collections[0]?.id;
  const ids = await getFlashcardIds(effectiveCollection || undefined);

  const isAll = parsed.layout === "all";
  const visibleCount = isAll ? Math.min(parsed.limit, ids.length) : 1;
  const slice = isAll
    ? ids.slice(0, visibleCount)
    : ids.slice(parsed.index, parsed.index + visibleCount);

  // Single batch query — replaces N individual getVerseById calls
  const verseMap = await getVersesByIds(slice);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex w-full flex-1 flex-col">
        <FlashcardBooksProvider books={books} lang={lang}>
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
                <CardWithDataClient
                  verseId={verseId}
                  initialVerse={verseMap.get(verseId) ?? null}
                  lang={effectiveLang}
                  horizontal={false}
                  flexible={isAll}
                />
              </div>
            ))}
          </FlashCardShell>
        </FlashcardBooksProvider>
      </div>
    </div>
  );
}
