import type { Metadata } from "next";
import { EnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/en/what-is-bible";
import { VnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/vn/what-is-bible";

export const metadata: Metadata = {
  title: "What Is the Bible?",
  description:
    "The Bible is a library of 66 books. Explore its structure, genres, and how to read it well.",
};

export default async function BibleStructurePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    return <VnWhatIsBiblePage />;
  } else {
    return <EnWhatIsBiblePage />;
  }
}
