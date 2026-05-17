import type { Metadata } from "next";
import {
  getStudyListsForCurrentUser,
  getArchivedStudyLists,
  getStudyStreak,
  getContinueTodayPassage,
} from "@/app/actions/bible/study";
import { StudyHubClient } from "@/components/Bible/Study/StudyHubClient";

export const metadata: Metadata = {
  title: "Study",
  description: "Create study lists, compare translations, and study Bible verses in depth.",
};

export default async function BibleStudyPage() {
  const [lists, archived, streak, continueToday] = await Promise.all([
    getStudyListsForCurrentUser(),
    getArchivedStudyLists(),
    getStudyStreak(),
    getContinueTodayPassage(),
  ]);

  return (
    <StudyHubClient
      lists={lists}
      archived={archived}
      streak={streak}
      continueToday={continueToday}
    />
  );
}
