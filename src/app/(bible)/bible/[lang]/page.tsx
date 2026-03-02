import { isBibleLocale } from "./layout";
import { redirect } from "next/navigation";
import { BibleLangPageWithLoader } from "@/components/Bible/LangPage/BibleLangPageWithLoader";

export default async function BibleLangRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang?.toLowerCase();
  if (!locale || !isBibleLocale(locale)) redirect("/bible/en");

  return <BibleLangPageWithLoader locale={locale} />;
}
