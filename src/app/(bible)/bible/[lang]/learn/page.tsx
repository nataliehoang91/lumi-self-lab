import { EnLearnPage } from "@/components/Bible/Learn/LearnPage/en/learn-page";
import { VnLearnPage } from "@/components/Bible/Learn/LearnPage/vn/learn-page";

function getLangFromPath(pathname: string | null): "en" | "vi" | null {
  const m = pathname?.match(/^\/bible\/(en|vi)(\/|$)/);
  return (m?.[1] as "en" | "vi") ?? null;
}

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
