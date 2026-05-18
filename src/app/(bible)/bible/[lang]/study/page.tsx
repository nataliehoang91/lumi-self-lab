import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import {
  getStudyListsForCurrentUser,
  getArchivedStudyLists,
  getStudyStreak,
  getContinueTodayPassage,
} from "@/app/actions/bible/study";
import { getUserFeatureAccess } from "@/lib/feature-access";
import { StudyHubClient } from "@/components/Bible/Study/StudyHubClient";

export const metadata: Metadata = {
  title: "Study",
  description: "Create study lists, compare translations, and study Bible verses in depth.",
};

export default async function BibleStudyPage() {
  const { userId } = await auth();
  const [lists, archived, streak, continueToday, features] = await Promise.all([
    getStudyListsForCurrentUser(),
    getArchivedStudyLists(),
    getStudyStreak(),
    getContinueTodayPassage(),
    userId ? getUserFeatureAccess(userId) : Promise.resolve({} as Record<string, boolean>),
  ]);

  return (
    <StudyHubClient
      lists={lists}
      archived={archived}
      streak={streak}
      continueToday={continueToday}
      isUnlimited={features.bible_study_unlimited === true}
    />
  );
}
