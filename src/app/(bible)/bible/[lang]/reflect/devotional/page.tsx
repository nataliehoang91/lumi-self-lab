import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Devotional",
  description: "Daily devotional. Coming soon.",
};

export default function DevotionalPage() {
  return <ComingSoonPage title="Devotional" />;
}
