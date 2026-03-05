import type { Metadata } from "next";
import { EnLearnPage } from "@/components/Bible/Learn/LearnPage/en/learn-page";
import { VnLearnPage } from "@/components/Bible/Learn/LearnPage/vn/learn-page";

export const metadata: Metadata = {
  title: "Understand",
  description:
    "Start with the foundations. What is the Bible? Bible origin, who is Jesus, and what is faith.",
};

export default async function LearnPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    return <VnLearnPage />;
  } else {
    return <EnLearnPage />;
  }
}
