import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Topics Timeline",
  description: "Explore Bible topics on a timeline. Coming soon.",
};

export default function TopicsTimelinePage() {
  return <ComingSoonPage title="Topics Timeline" />;
}
