import { getBooks } from "@/app/actions/bible/read";
import { ReadPageShell } from "@/components/Bible/Read/ReadLayout/ReadPageShell";
import type { Language } from "@/components/Bible/BibleAppContext";
import { notFound } from "next/navigation";

type SearchParams = Record<string, string | undefined>;

function routeLangToLanguage(lang: string): Language {
  if (lang === "vi") return "VI";
  if (lang === "zh") return "ZH";
  return "EN";
}

export default async function ReadPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "vi" && lang !== "zh") notFound();

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
