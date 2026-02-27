import { getBooks } from "@/app/actions/bible/read";
import { ReadPageShell } from "@/components/Bible/Read/ReadLayout/ReadPageShell";

type SearchParams = Record<string, string | undefined>;

export default async function ReadPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const booksPromise = getBooks();
  const params = (await searchParams) ?? {};

  return <ReadPageShell booksPromise={booksPromise} searchParams={params} />;
}
