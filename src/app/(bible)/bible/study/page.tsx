import { getStudyListsForCurrentUser } from "@/app/actions/bible/study";
import { CreateStudyListForm } from "@/components/Bible/Study/CreateStudyListForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default async function BibleStudyPage() {
  const lists = await getStudyListsForCurrentUser();

  console.log("lists", lists);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-4 sm:px-6 py-10">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground">
            Study
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Start Your Study</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create study lists to collect passages and build your perfect study sessions.
          </p>
        </div>

        {lists.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <span className="text-2xl">📖</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">No study lists yet</h2>
              <p className="text-sm text-muted-foreground">
                Create a named list, then add any passages — books, chapters, or specific verses —
                to study side by side.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-5">
                  <span className="mr-2 text-lg leading-none">+</span>
                  Create your first list
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new study list</DialogTitle>
                </DialogHeader>
                <CreateStudyListForm />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Your study lists</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <span className="text-lg leading-none">+</span>
                    New list
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new study list</DialogTitle>
                  </DialogHeader>
                  <CreateStudyListForm />
                </DialogContent>
              </Dialog>
            </div>
            <ul className="space-y-2">
              {lists.map((list) => (
                <li
                  key={list.id}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm"
                >
                  <div className="font-medium">{list.title}</div>
                  {list.description && (
                    <div className="text-xs text-muted-foreground mt-1">{list.description}</div>
                  )}
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>0 passages</span>
                    <span>{list.createdAt.toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
