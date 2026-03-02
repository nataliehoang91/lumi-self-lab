import { isBibleLocale } from "./layout";
import { notFound } from "next/navigation";
import { EnBibleLangPage } from "@/components/Bible/LangPage/en/bible-lang-page";
import { VnBibleLangPage } from "@/components/Bible/LangPage/vn/bible-lang-page";
import { ZhBibleLangPage } from "@/components/Bible/LangPage/zh/bible-lang-page";

export default async function BibleLangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang?.toLowerCase();
  if (!locale || !isBibleLocale(locale)) notFound();

  if (locale === "vi") return <VnBibleLangPage lang={locale} />;
  if (locale === "zh") return <ZhBibleLangPage lang={locale} />;
  return <EnBibleLangPage lang={locale} />;
}
