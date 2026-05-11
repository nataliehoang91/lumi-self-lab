import { prisma } from "@/lib/prisma";

export const FREE_ACTIVE_EXPERIMENT_LIMIT = 5;

export async function getActiveExperimentCount(userId: string): Promise<number> {
  return prisma.experiment.count({
    where: { clerkUserId: userId, status: "active" },
  });
}

export async function isAtActiveLimit(userId: string): Promise<boolean> {
  const count = await getActiveExperimentCount(userId);
  return count >= FREE_ACTIVE_EXPERIMENT_LIMIT;
}
