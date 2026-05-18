import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TopicsIndexClient } from "@/components/Bible/Topics/TopicsIndexClient";
import { BIBLE_TOPICS } from "@/lib/bible-topics-data";

export const metadata: Metadata = {
  title: "Bible Topics Explorer",
  description: "Explore what the Bible says about faith, emotions, relationships, guidance, and more.",
};

export default async function TopicsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const segment = lang === "vi" ? "vi" : "en";

  return (
    <div className="bg-read min-h-screen dark:bg-[#050408]">
      <main>
        <Container maxWidth="7xl" className="px-4 sm:px-6 py-16">
          <TopicsIndexClient topics={BIBLE_TOPICS} segment={segment} />
        </Container>
      </main>
    </div>
  );
}
