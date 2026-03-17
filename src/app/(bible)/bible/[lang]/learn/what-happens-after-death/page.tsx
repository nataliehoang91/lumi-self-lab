import type { Metadata } from "next";
import type { BibleBook } from "@/components/Bible/Read/types";
import { EnWhatHappensAfterDeathPage } from "@/components/Bible/Learn/WhatHappensAfterDeath/en/what-happens-after-death";
import { VnWhatHappensAfterDeathPage } from "@/components/Bible/Learn/WhatHappensAfterDeath/vn/what-happens-after-death";
import { getBooks } from "@/app/actions/bible/read";

export const metadata: Metadata = {
  title: "What Happens After Death?",
  description:
    "What happens after death? Content coming soon.",
};

export default async function WhatHappensAfterDeathPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();
  const books: BibleBook[] = await getBooks();

  if (lang === "vi") {
    return <VnWhatHappensAfterDeathPage books={books} />;
  }
  return <EnWhatHappensAfterDeathPage books={books} />;
}
