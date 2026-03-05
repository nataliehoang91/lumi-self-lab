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

  return (
    <ReadPageShell
      booksPromise={booksPromise}
      searchParams={newSearchParams}
      initialLanguage={initialLanguage}
    />
  );
}
