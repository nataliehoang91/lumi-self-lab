import { getBooks } from "./actions";
import { BibleReadPage } from "@/components/Bible/Read/BibleReadPage";

export default async function ReadPage() {
  const initialBooks = await getBooks();
  return <BibleReadPage initialBooks={initialBooks} />;
}
