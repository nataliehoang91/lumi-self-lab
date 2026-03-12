import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBookOverviewBySlug,
  type BookOverviewLang,
} from "@/app/actions/bible/book-overview";
import { isBibleLocale } from "@/app/(bible)/bible/[lang]/layout";
import { BookOverviewPageClient } from "./BookOverviewPageClient";

type Params = Promise<{ lang: string; bookName: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang, bookName } = await params;
  const overviewLang: BookOverviewLang = lang === "vi" ? "vi" : "en";
  const data = await getBookOverviewBySlug(bookName, overviewLang);
  if (!data) {
    return { title: "Book Overview" };
  }
  const name = overviewLang === "vi" ? data.nameVi : data.nameEn;
  return {
    title: `${name} – Book Overview`,
    description: `Overview of ${name}: themes, outline, key verses, and Christ connection.`,
  };
}

export default async function BookOverviewPage({ params }: { params: Params }) {
  const { lang, bookName } = await params;
  const normalizedLang = lang?.toLowerCase();
  if (!normalizedLang || !isBibleLocale(normalizedLang)) {
    notFound();
  }
  const overviewLang: BookOverviewLang = normalizedLang === "vi" ? "vi" : "en";
  const data = await getBookOverviewBySlug(bookName, overviewLang);
  if (!data) notFound();

  const displayName = overviewLang === "vi" ? data.nameVi : data.nameEn;
  const testament: "ot" | "nt" = data.order <= 39 ? "ot" : "nt";
  const langSegment: "en" | "vi" = normalizedLang === "vi" ? "vi" : "en";
  const defaultVersion: "vi" | "niv" | undefined = langSegment === "vi" ? "vi" : "niv";
  const hasOverviewContent =
    (data.outline?.length ?? 0) > 0 ||
    (data.keyVerses?.length ?? 0) > 0 ||
    !!data.christConnection;
  return (
    <BookOverviewPageClient
      langSegment={langSegment}
      normalizedLang={normalizedLang}
      bookSlugEn={bookName}
      data={data}
      displayName={displayName}
      testament={testament}
      defaultVersion={defaultVersion}
      hasOverviewContent={hasOverviewContent}
    />
  );
}