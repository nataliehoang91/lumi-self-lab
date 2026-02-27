import type { Metadata } from "next";
import { BibleRedirect } from "@/components/Bible/BibleRedirect";

export const metadata: Metadata = {
  title: "Scripture Memory - Bible Flashcards",
  description: "A beautiful scripture memory app for church communities",
};

export default function BiblePage() {
  // Server component: can export metadata and render a small client redirect.
  return <BibleRedirect />;
}
