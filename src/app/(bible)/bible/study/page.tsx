import Link from "next/link";

export default function BibleStudyPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-xl w-full rounded-2xl border border-border bg-card/80 shadow-sm p-6 sm:p-8 text-center space-y-4">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground">
          Study
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
          Bible study tools are coming soon
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          For now you can read and meditate on Scripture using the Bible reader and flashcards.
          Future updates will add guided studies, reading plans, and reflection prompts here.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/bible/read"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-light transition-colors"
          >
            Go to reader
          </Link>
          <Link
            href="/bible/flashcard"
            className="inline-flex items-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Open flashcards
          </Link>
        </div>
      </div>
    </div>
  );
}

