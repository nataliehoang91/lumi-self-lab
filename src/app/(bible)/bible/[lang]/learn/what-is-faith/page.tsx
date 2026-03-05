import type { Metadata } from "next";
import { getBooks } from "@/app/actions/bible/read";
import { EnWhatIsFaithPage } from "@/components/Bible/Learn/WhatIsFaith/en/what-is-faith";
import { VnWhatIsFaithPage } from "@/components/Bible/Learn/WhatIsFaith/vn/what-is-faith";

export const metadata: Metadata = {
  title: "What Is Faith?",
  description:
    "What is faith? Grace, repentance, relationship with God, and how to respond.",
};

export default async function WhatIsFaithPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();
  const books = await getBooks();

  if (lang === "vi") {
    return <VnWhatIsFaithPage books={books} />;
  } else {
    return <EnWhatIsFaithPage books={books} />;
  }
}
