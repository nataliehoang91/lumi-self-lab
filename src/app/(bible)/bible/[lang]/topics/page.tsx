import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Topics Explorer",
  description: "Explore the Bible by topic. Coming soon.",
};

export default function TopicsExplorerPage() {
  return <ComingSoonPage title="Topics Explorer" />;
}
