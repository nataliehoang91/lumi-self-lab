import { notFound } from "next/navigation";
import { getPublicStudyList } from "@/app/actions/bible/study";
import { getBooks } from "@/app/actions/bible/read";
import { SharedStudyView } from "@/components/Bible/Study/SharedStudyView";

interface SharedStudyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SharedStudyPage({ params }: SharedStudyPageProps) {
  const { slug } = await params;

  const [result, books] = await Promise.all([
    getPublicStudyList(slug),
    getBooks(),
  ]);

  if (!result) notFound();

  return <SharedStudyView list={result.list} passages={result.passages} books={books} />;
}
