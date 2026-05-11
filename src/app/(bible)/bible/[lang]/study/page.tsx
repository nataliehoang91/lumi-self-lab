import type { Metadata } from "next";
import { getStudyListsForCurrentUser, getArchivedStudyLists } from "@/app/actions/bible/study";
import { StudyHubClient } from "@/components/Bible/Study/StudyHubClient";

export const metadata: Metadata = {
  title: "Study",
  description:
    "Create study lists, compare translations, and study Bible verses in depth.",
};

export default async function BibleStudyPage() {
  const [lists, archived] = await Promise.all([
    getStudyListsForCurrentUser(),
    getArchivedStudyLists(),
  ]);
  return <StudyHubClient lists={lists} archived={archived} />;
}
