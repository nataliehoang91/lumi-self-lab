import type { Metadata } from "next";
import { getStudyListsForCurrentUser } from "@/app/actions/bible/study";
import { NewStudyListPlaceholderCard } from "@/components/Bible/Study/NewStudyListPlaceholderCard";
import { StudyListCard } from "@/components/Bible/Study/StudyListCard";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import { Container } from "@/components/ui/container";
import type { BibleStudyList } from "@/types/bible-study";

export const metadata: Metadata = {
  title: "Study",
  description:
    "Create study lists, compare translations, and study Bible verses in depth.",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function BibleStudyPage() {
  const lists = await getStudyListsForCurrentUser();
  return (
    <Container maxWidth="7xl" className="flex min-h-screen flex-col px-4 py-6 lg:px-0">
      {lists.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <BookCircleIcon size="lg" />
          <div className="space-y-1">
            <h2 className="text-foreground text-xl font-semibold">Start Your Study</h2>
            <p className="text-muted-foreground text-sm">
              Add passages to compare translations, study verses in depth, and build your
              perfect study session.
            </p>
          </div>
          <NewStudyListPlaceholderCard label="Create your first list" />
        </div>
      ) : (
        <>
          <div className="mt-4 mb-2 flex items-baseline justify-between">
            <h2 className="text-foreground text-sm font-semibold">Your study lists</h2>
            <span className="text-muted-foreground text-xs">
              {lists.length} {lists.length === 1 ? "list" : "lists"}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((list: BibleStudyList) => (
              <StudyListCard key={list.id} list={list} />
            ))}
            <NewStudyListPlaceholderCard />
          </div>
        </>
      )}
    </Container>
  );
}
