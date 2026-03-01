import { EnBibleOriginPage } from "@/components/Bible/Learn/BibleOrigin/en/bible-origin";
import { VnBibleOriginPage } from "@/components/Bible/Learn/BibleOrigin/vn/bible-origin";

export default async function BibleOriginPage({ params }: { params: { lang: string } }) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    return <VnBibleOriginPage />;
  } else {
    return <EnBibleOriginPage />;
  }
}
