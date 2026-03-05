import type { Metadata } from "next";
import { EnLearnPage } from "@/components/Bible/Learn/LearnPage/en/learn-page";
import { VnLearnPage } from "@/components/Bible/Learn/LearnPage/vn/learn-page";
import { getBooks } from "@/app/actions/bible/read";
import type { BibleBook } from "@/components/Bible/Read/types";

export const metadata: Metadata = {
  title: "Understand",
  description:
    "Start with the foundations. What is the Bible? Bible origin, who is Jesus, and what is faith.",
};

function findBookId(
  books: BibleBook[],
  nameVi: string,
  nameEn: string
): string | null {
  const v = nameVi.trim().toLowerCase();
  const byVi = books.find((b) => b.nameVi.trim().toLowerCase() === v);
  if (byVi) return byVi.id;
  const byEn = books.find((b) => b.nameEn === nameEn);
  return byEn ? byEn.id : null;
}

function buildViReadHref(bookId: string | null, chapter: number, verse: number): string {
  if (!bookId) return "/bible/vi/read";
  const sp = new URLSearchParams();
  sp.set("version1", "vi");
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", "ot");
  sp.set("verse1", String(verse));
  sp.set("verses", String(verse));
  return `/bible/vi/read?${sp.toString()}`;
}

function buildEnReadHref(bookId: string | null, chapter: number, verse: number): string {
  if (!bookId) return "/bible/en/read";
  const sp = new URLSearchParams();
  sp.set("version1", "niv");
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", "ot");
  sp.set("verse1", String(verse));
  sp.set("verses", String(verse));
  return `/bible/en/read?${sp.toString()}`;
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    const books = await getBooks();
    const psalmId = findBookId(books, "Thi thiên", "Psalms");
    const verseHref = buildViReadHref(psalmId, 119, 105);
    return <VnLearnPage verseHref={verseHref} />;
  }

  const books = await getBooks();
  const psalmId = findBookId(books, "Thi thiên", "Psalms");
  const verseHref = buildEnReadHref(psalmId, 119, 105);
  return <EnLearnPage verseHref={verseHref} />;
}
