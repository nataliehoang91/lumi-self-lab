import Link from "next/link";
import { FlashVerseList } from "./FlashVerseList";

export default function AdminFlashcardListPage() {
  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-semibold text-stone-800">Flash verses</h1>
          <div className="flex gap-2">
            <Link
              href="/bible/admin/add"
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              Add verse
            </Link>
            <Link
              href="/bible/flashcard"
              className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              Flash cards
            </Link>
            <form action="/api/bible/admin/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg bg-stone-200 px-3 py-2 text-sm text-stone-700 hover:bg-stone-300"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-md overflow-hidden">
          <FlashVerseList />
        </div>
      </div>
    </div>
  );
}
