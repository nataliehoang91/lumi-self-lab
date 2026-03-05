import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Journal",
  description: "Bible journaling. Coming soon.",
};

export default function JournalPage() {
  return <ComingSoonPage title="Journal" />;
}
