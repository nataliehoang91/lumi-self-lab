import type { Metadata } from "next";
import { getBooks } from "@/app/actions/bible/read";
import { ReadPageShell } from "@/components/Bible/Read/ReadLayout/ReadPageShell";
import type { Language } from "@/components/Bible/BibleAppContext";

type SearchParams = Record<string, string | undefined>;

function routeLangToLanguage(lang: string): Language {
  if (lang === "vi") return "VI";
  if (lang === "zh") return "ZH";
  return "EN";
}

export const metadata: Metadata = {
  title: "Read",
  description:
    "Read Scripture with clarity. Side-by-side translations and a focused reading space.",
};

export default async function ReadPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const { lang } = await params;

  const booksPromise = getBooks();
  const newSearchParams = (await searchParams) ?? {};
  const initialLanguage = routeLangToLanguage(lang);

  // Force the client-side read shell to remount when coming from different
  // sources (e.g. flashcards) or when query params change, so it never reuses
  // stale state from a previous visit.
  const key = `${lang}:${new URLSearchParams(
    Object.entries(newSearchParams).filter(
      ([, value]) => typeof value === "string" && value !== undefined
    ) as [string, string][]
  ).toString()}`;

  return (
    <ReadPageShell
      key={key}
      booksPromise={booksPromise}
      searchParams={newSearchParams}
      initialLanguage={initialLanguage}
    />
  );
}
