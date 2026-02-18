import Link from "next/link";
import { FlashCardGrid } from "./FlashCardGrid";

export default function FlashcardPage() {
  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-stone-800">
            Bible Flash Cards
          </h1>
          <Link
            href="/bible/admin"
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            Admin
          </Link>
        </div>
        <FlashCardGrid />
      </div>
    </div>
  );
}
