import type { Metadata } from "next";
import { getBooks } from "@/app/actions/bible/read";
import { isBibleLocale } from "./layout";
import { redirect } from "next/navigation";
import { BibleLangPageWithLoader } from "@/components/Bible/LangPage/BibleLangPageWithLoader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang?.toLowerCase();
  if (!locale || !isBibleLocale(locale)) return { title: "Scripture·Space" };
  return {
    title: "Scripture·Space",
    description:
      "A quiet place to know God. Learn the Bible, read Scripture, and explore faith at your own pace.",
  };
}

export default async function BibleLangRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang?.toLowerCase();
  if (!locale || !isBibleLocale(locale)) redirect("/bible/en");

  const books = await getBooks();
  return <BibleLangPageWithLoader locale={locale} books={books} />;
}
