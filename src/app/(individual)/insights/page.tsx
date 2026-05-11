import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Target,
  Flame,
  Award,
  Download,
} from "lucide-react";

async function getInsightsData(userId: string) {
  const [activeCount, completedCount, allCheckIns, activeExperiments, recentDiscoveries] =
    await Promise.all([
      prisma.experiment.count({ where: { clerkUserId: userId, status: "active" } }),
      prisma.experiment.count({ where: { clerkUserId: userId, status: "completed" } }),
      prisma.experimentCheckIn.findMany({
        where: { clerkUserId: userId },
        select: { checkInDate: true },
        orderBy: { checkInDate: "desc" },
      }),
      prisma.experiment.findMany({
        where: { clerkUserId: userId, status: "active" },
        select: { durationDays: true, _count: { select: { checkIns: true } } },
      }),
      prisma.experimentCheckIn.findMany({
        where: { clerkUserId: userId, aiSummary: { not: null } },
        select: {
          id: true,
          checkInDate: true,
          aiSummary: true,
          experiment: { select: { title: true } },
        },
        orderBy: { checkInDate: "desc" },
        take: 3,
      }),
    ]);

  // Compute current streak: consecutive days with at least one check-in ending today
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const uniqueDays = new Set(
    allCheckIns.map((c) => {
      const d = new Date(c.checkInDate);
      d.setUTCHours(0, 0, 0, 0);
      return d.getTime();
    })
  );

  let streak = 0;
  const cursor = new Date(today);
  while (uniqueDays.has(cursor.getTime())) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // Compute overall completion rate
  const totalExpected = activeExperiments.reduce((sum, e) => sum + e.durationDays, 0);
  const totalActual = activeExperiments.reduce((sum, e) => sum + e._count.checkIns, 0);
  const completionRate =
    totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

  return { activeCount, completedCount, streak, completionRate, recentDiscoveries };
}

export default async function InsightsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/waitlist");

  const { activeCount, completedCount, streak, completionRate, recentDiscoveries } =
    await getInsightsData(userId);

  return (
    <IndividualContainer>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-2xl font-bold sm:text-4xl">Your Insights</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Discover patterns and track your personal growth journey
          </p>
        </div>
        <Button
          variant="outline"
          disabled
          title="Coming soon"
          className="rounded-3xl bg-transparent opacity-50 cursor-not-allowed"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
          <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Soon</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card
          className="rounded-3xl border-green-500/20 bg-gradient-to-br from-green-400/10
            to-emerald-500/10 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl
                bg-green-500/20"
            >
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <Badge
              className="rounded-2xl border-green-500/30 bg-green-500/20 text-green-600"
            >
              Active
            </Badge>
          </div>
          <div className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">{activeCount}</div>
          <div className="text-muted-foreground text-sm">Active Experiments</div>
        </Card>

        <Card
          className="rounded-3xl border-blue-500/20 bg-gradient-to-br from-blue-400/10
            to-indigo-500/10 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl
                bg-blue-500/20"
            >
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <Badge className="rounded-2xl border-blue-500/30 bg-blue-500/20 text-blue-600">
              Total
            </Badge>
          </div>
          <div className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">{completedCount}</div>
          <div className="text-muted-foreground text-sm">Completed</div>
        </Card>

        <Card
          className="rounded-3xl border-orange-500/20 bg-gradient-to-br from-orange-400/10
            to-rose-500/10 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl
                bg-orange-500/20"
            >
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <Badge
              className="rounded-2xl border-orange-500/30 bg-orange-500/20
                text-orange-600"
            >
              Streak
            </Badge>
          </div>
          <div className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">{streak}</div>
          <div className="text-muted-foreground text-sm">Day Streak</div>
        </Card>

        <Card
          className="rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-400/10
            to-pink-500/10 p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl
                bg-purple-500/20"
            >
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <Badge
              className="rounded-2xl border-purple-500/30 bg-purple-500/20
                text-purple-600"
            >
              Rate
            </Badge>
          </div>
          <div className="text-foreground mb-1 text-2xl font-bold sm:text-3xl">{completionRate}%</div>
          <div className="text-muted-foreground text-sm">Completion Rate</div>
        </Card>
      </div>

      {/* Recent Discoveries */}
      <Card className="bg-card/80 border-border/50 rounded-3xl p-6 backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <Award className="text-primary h-6 w-6" />
          <h3 className="text-foreground text-xl font-semibold">Recent Discoveries</h3>
        </div>
        {recentDiscoveries.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No AI summaries yet. Complete some check-ins to see your discoveries here.
          </p>
        ) : (
          <div className="space-y-4">
            {recentDiscoveries.map((discovery) => {
              const date = new Date(discovery.checkInDate);
              const diffDays = Math.floor(
                (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
              );
              const dateLabel =
                diffDays === 0
                  ? "Today"
                  : diffDays === 1
                    ? "Yesterday"
                    : diffDays < 7
                      ? `${diffDays} days ago`
                      : `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;

              return (
                <div
                  key={discovery.id}
                  className="from-primary/5 to-second/5 border-border/30 rounded-2xl border
                    bg-gradient-to-r p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="text-foreground font-semibold">
                      {discovery.experiment.title}
                    </h4>
                    <Badge variant="outline" className="rounded-2xl text-xs">
                      {dateLabel}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {discovery.aiSummary}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </IndividualContainer>
  );
}
