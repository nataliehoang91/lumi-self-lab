import { getBooks } from "@/app/actions/bible/read";
import { ReadPageShell } from "./ReadPageShell";

type SearchParams = Record<string, string | undefined>;

export default async function ReadPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const params: SearchParams =
    searchParams && typeof (searchParams as Promise<SearchParams>).then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : ((searchParams as SearchParams) ?? {});

  const booksPromise = getBooks();

  return <ReadPageShell booksPromise={booksPromise} searchParams={params} />;
}
