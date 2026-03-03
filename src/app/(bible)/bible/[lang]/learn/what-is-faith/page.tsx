import { EnWhatIsFaithPage } from "@/components/Bible/Learn/WhatIsFaith/en/what-is-faith";
import { VnWhatIsFaithPage } from "@/components/Bible/Learn/WhatIsFaith/vn/what-is-faith";

export default async function WhatIsFaithPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    return <VnWhatIsFaithPage />;
  } else {
    return <EnWhatIsFaithPage />;
  }
}
