import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { TopicDetailClient } from "@/components/Bible/Topics/TopicDetailClient";
import { BIBLE_TOPICS, getTopicBySlug, getTopicsByCategory } from "@/lib/bible-topics-data";
import { getTopicVerseTexts } from "@/app/actions/bible/topic-verses";

export async function generateStaticParams() {
  return BIBLE_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  const isVi = lang === "vi";
  return {
    title: isVi ? `${topic.nameVi} — Chủ đề Kinh Thánh` : `${topic.nameEn} — Bible Topics`,
    description: isVi ? topic.introVi : topic.introEn,
  };
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const segment = lang === "vi" ? "vi" : "en";
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const related = getTopicsByCategory(topic.category)
    .filter((t) => t.slug !== topic.slug)
    .slice(0, 6);

  // Fetch real verse texts from DB (VIE1923 + NIV)
  const verseTextMap = await getTopicVerseTexts(
    topic.verses.map((v) => ({ bookSlug: v.bookSlug, chapter: v.chapter, verse: v.verse }))
  );

  return (
    <div className="bg-read min-h-screen dark:bg-[#050408]">
      <main>
        <Container maxWidth="5xl" className="px-4 py-16">
          <TopicDetailClient
            topic={topic}
            segment={segment}
            relatedTopics={related}
            verseTextMap={verseTextMap}
          />
        </Container>
      </main>
    </div>
  );
}
