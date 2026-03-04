import { EnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/en/what-is-bible";
import { VnWhatIsBiblePage } from "@/components/Bible/Learn/WhatIsBible/vn/what-is-bible";

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
