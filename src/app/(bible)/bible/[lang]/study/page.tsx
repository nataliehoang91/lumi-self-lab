import type { Metadata } from "next";
import { getStudyListsForCurrentUser } from "@/app/actions/bible/study";
import { NewStudyListPlaceholderCard } from "@/components/Bible/Study/NewStudyListPlaceholderCard";
import { StudyListCard } from "@/components/Bible/Study/StudyListCard";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import { Container } from "@/components/ui/container";
import type { BibleStudyListWithCount } from "@/types/bible-study";

export const metadata: Metadata = {
  title: "Study",
  description:
    "Create study lists, compare translations, and study Bible verses in depth.",
};

export default async function BibleStudyPage() {
  const lists = await getStudyListsForCurrentUser();
  return (
    <Container maxWidth="7xl" className="flex min-h-screen flex-col px-4 py-8 lg:px-0">
      {/* Page header */}
      <header className="mb-6">
        <p className="text-muted-foreground mb-1 text-xs tracking-[0.18em] uppercase">
          Personal
        </p>
        <h1 className="text-foreground text-2xl font-semibold">Study</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Build study lists, select chapters, and read Scripture in any translation.
        </p>
      </header>

      {lists.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-5 text-center">
          <div
            className="bg-primary/8 flex h-16 w-16 items-center justify-center rounded-2xl"
          >
            <BookCircleIcon size="lg" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-foreground text-lg font-semibold">
              Create your first study list
            </h2>
            <p className="text-muted-foreground max-w-sm text-sm">
              Select chapters from any book, switch translations, and read them all in
              one place.
            </p>
          </div>
          <NewStudyListPlaceholderCard label="New study list" />
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              {lists.length} {lists.length === 1 ? "list" : "lists"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list: BibleStudyListWithCount) => (
              <StudyListCard key={list.id} list={list} />
            ))}
            <NewStudyListPlaceholderCard />
          </div>
        </>
      )}
    </Container>
  );
}
