"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { InteractiveFormResult } from "@/components/CoreAdvancedComponent/behaviors/interactive-form";
import type { StudyListFields } from "@/components/Bible/Study/constants";

export async function getStudyListsForCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  return prisma.bibleStudyList.findMany({
    where: { clerkUserId: userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createStudyList(
  formData: FormData
): Promise<InteractiveFormResult<StudyListFields>> {
  const { userId } = await auth();

  if (!userId) {
    return { errors: { general: ["unauthorized"] } };
  }

  const title = (formData.get("title") || "").toString().trim();
  const description = (formData.get("description") || "").toString().trim();

  if (!title) {
    return { errors: { title: ["required"] } };
  }

  try {
    await prisma.bibleStudyList.create({
      data: {
        clerkUserId: userId,
        title,
        description: description || null,
      },
    });

    return {
      refresh: true,
      result: { created: true },
    };
  } catch (e) {
    console.error("createStudyList action", e);
    return { errors: { general: ["save_failed"] } };
  }
}
