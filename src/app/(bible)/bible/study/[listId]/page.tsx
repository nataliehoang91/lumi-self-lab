import { notFound } from "next/navigation";
import { getBooks } from "@/app/actions/bible/read";
import { getStudyListById, getPassagesForStudyList } from "@/app/actions/bible/study";
import { StudyReaderShell } from "@/components/Bible/Study/StudyReaderShell";

interface StudyListPageProps {
  params: Promise<{ listId: string }>;
}

export default async function StudyListPage({ params }: StudyListPageProps) {
  const { listId } = await params;
  console.log("StudyListPage", listId);

  const [list, books, passages] = await Promise.all([
    getStudyListById(listId),
    getBooks(),
    getPassagesForStudyList(listId),
  ]);

  if (!list) {
    notFound();
  }

  return <StudyReaderShell list={list} books={books} initialPassages={passages} />;
}
