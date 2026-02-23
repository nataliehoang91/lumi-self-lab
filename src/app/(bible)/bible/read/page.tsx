import { getBooks } from "@/app/actions/bible/read";
import { ReadPageContent } from "./ReadPageContent";

type SearchParams = Record<string, string | undefined>;

export default async function ReadPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const initialBooks = await getBooks();
  const params: SearchParams =
    searchParams && typeof (searchParams as Promise<SearchParams>).then === "function"
      ? await (searchParams as Promise<SearchParams>)
      : ((searchParams as SearchParams) ?? {});
  return <ReadPageContent initialBooks={initialBooks} searchParams={params} />;
}
