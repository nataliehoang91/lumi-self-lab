import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/Bible/ComingSoonPage";

export const metadata: Metadata = {
  title: "Book Overviews",
  description: "Overview of each book of the Bible. Coming soon.",
};

export default function BookOverviewsPage() {
  return <ComingSoonPage title="Book Overviews" />;
}
