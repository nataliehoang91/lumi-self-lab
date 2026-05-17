import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TopicsTimelineClient } from "@/components/Bible/Topics/TopicsTimelineClient";

export const metadata: Metadata = {
  title: "Bible Topics Timeline",
  description: "Explore how life's biggest themes appear and develop across the entire story of the Bible.",
};

export default async function TopicsTimelinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const segment = lang === "vi" ? "vi" : "en";

  return (
    <div className="bg-read min-h-screen dark:bg-[#050408]">
      <main>
        <Container maxWidth="5xl" className="px-4 py-16">
          <TopicsTimelineClient segment={segment} />
        </Container>
      </main>
    </div>
  );
}
