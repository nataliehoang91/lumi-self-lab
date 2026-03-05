import type { Metadata } from "next";
import { EnBibleOriginPage } from "@/components/Bible/Learn/BibleOrigin/en/bible-origin";
import { VnBibleOriginPage } from "@/components/Bible/Learn/BibleOrigin/vn/bible-origin";

export const metadata: Metadata = {
  title: "Bible Origin & Canon",
  description:
    "How the Bible came to be: its languages, formation of the canon, and why it matters.",
};

export default async function BibleOriginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    return <VnBibleOriginPage />;
  } else {
    return <EnBibleOriginPage />;
  }
}
