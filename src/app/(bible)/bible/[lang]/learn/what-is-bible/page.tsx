import type { Metadata } from "next";
import { getBooks } from "@/app/actions/bible/read";
import { EnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/en/what-is-bible";
import { VnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/vn/what-is-bible";

export const metadata: Metadata = {
  title: "What Is the Bible?",
  description:
    "Discover what the Bible is — 66 books, two testaments, 40 authors across 1,500 years — and why it still matters today.",
};

export default async function WhatIsBiblePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const books = await getBooks();

  if (lang.toLowerCase() === "vi") {
    return <VnWhatIsBiblePage books={books} />;
  }

  return <EnWhatIsBiblePage books={books} />;
}
