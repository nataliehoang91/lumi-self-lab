import type { Metadata } from "next";
import { getBooks } from "@/app/actions/bible/read";
import { EnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/en/what-is-bible";
import { VnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/vn/what-is-bible";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang.toLowerCase();

  if (locale === "vi") {
    return {
      title: "Kinh Thánh là gì?",
      description:
        "Kinh Thánh là một thư viện gồm 66 sách. Tìm hiểu cấu trúc, các thể loại và cách đọc Kinh Thánh cách rõ ràng.",
    };
  }

  return {
    title: "What Is the Bible?",
    description:
      "The Bible is a library of 66 books. Explore its structure, genres, and how to read it well.",
  };
}

export default async function BibleStructurePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();
  const books = await getBooks();

  if (lang === "vi") {
    return <VnWhatIsBiblePage books={books} />;
  } else {
    return <EnWhatIsBiblePage books={books} />;
  }
}
