import { getStudyListsForCurrentUser } from "@/app/actions/bible/study";
import { NewStudyListPlaceholderCard } from "@/components/Bible/Study/NewStudyListPlaceholderCard";
import { StudyListCard } from "@/components/Bible/Study/StudyListCard";
import { BookCircleIcon } from "@/components/Bible/GeneralComponents/book-circle-icon";
import { Container } from "@/components/ui/container";
import type { BibleStudyList } from "@/types/bible-study";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function BibleStudyPage() {
  const lists = await getStudyListsForCurrentUser();
  return (
    <Container maxWidth="7xl" className="min-h-screen flex flex-col py-6  lg:px-0 px-4">
      {lists.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <BookCircleIcon size="lg" />
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">Start Your Study</h2>
            <p className="text-sm text-muted-foreground">
              Add passages to compare translations, study verses in depth, and build your perfect
              study session.
            </p>
          </div>
          <NewStudyListPlaceholderCard label="Create your first list" />
        </div>
      ) : (
        <>
          <div className="mt-4 mb-2 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">Your study lists</h2>
            <span className="text-xs text-muted-foreground">
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
