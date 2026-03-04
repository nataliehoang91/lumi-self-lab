import { EnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/en/who-is-jesus";
import { VnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/vn/who-is-jesus";

export default async function WhoIsJesusPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();

  if (lang === "vi") {
    return <VnWhoIsJesus />;
  } else {
    return <EnWhoIsJesus />;
  }
}
