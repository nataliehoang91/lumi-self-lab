import type { Metadata } from "next";
import { getBooks } from "@/app/actions/bible/read";
import { EnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/en/who-is-jesus";
import { VnWhoIsJesus } from "@/components/Bible/Learn/WhoIsJesus/vn/who-is-jesus";

export const metadata: Metadata = {
  title: "Who Is Jesus?",
  description:
    "Explore who Jesus is: fully God, fully human, the cross and resurrection, and why He matters today.",
};

export default async function WhoIsJesusPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const finalParams = await params;
  const lang = finalParams.lang.toLowerCase();
  const books = await getBooks();

  if (lang === "vi") {
    return <VnWhoIsJesus books={books} />;
  } else {
    return <EnWhoIsJesus books={books} />;
  }
}
