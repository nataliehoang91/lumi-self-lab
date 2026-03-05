import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Bible terms and definitions. More glossary features are coming soon.",
};

export default function GlossaryOtherPage() {
  return (
    <ComingSoonPage title="Other" description="More glossary features are coming soon." />
  );
}
