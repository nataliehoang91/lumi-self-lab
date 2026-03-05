import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Deep Dive",
  description:
    "Deeper explorations and extended content for Bible learn modules. Coming soon.",
};

export default function DeepDivePage() {
  return (
    <ComingSoonPage
      title="Deep dive"
      description="Deeper explorations and extended content are coming soon."
    />
  );
}
