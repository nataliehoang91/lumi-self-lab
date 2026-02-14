import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type UIExperiment = {
  id: string;
  title: string;
  status: string;
  duration: number;
  frequency: string;
  daysCompleted: number;
  startDate: string | null;
  hypothesis: string;
};

/**
 * Server-side fetch for experiments list. Uses Clerk auth; redirects to waitlist if unauthenticated.
 */
export async function getExperimentsData(): Promise<UIExperiment[]> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/waitlist");
  }

  const experiments = await prisma.experiment.findMany({
    where: { clerkUserId: userId },
    include: {
      _count: {
        select: { checkIns: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const sorted = [...experiments].sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    return 0;
  });

  return sorted.map((exp) => ({
    id: exp.id,
    title: exp.title,
    status: exp.status,
    duration: exp.durationDays,
    frequency: exp.frequency,
    daysCompleted: exp._count.checkIns,
    startDate: exp.startedAt ? new Date(exp.startedAt).toISOString().split("T")[0] : null,
    hypothesis: exp.hypothesis || "",
  }));
}
