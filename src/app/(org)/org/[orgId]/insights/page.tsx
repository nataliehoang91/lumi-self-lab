import { Card } from "@/components/ui/card";
import { BarChart3, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data - replace with real API call
function getOrgInsights(orgId: string) {
  return {
    totalParticipants: 24,
    activeExperiments: 12,
    avgCompletionRate: 78,
    topInsights: [
      "Team focus scores are 15% higher on days with fewer meetings",
      "Most check-ins happen between 9-10am",
      "Energy levels peak in the morning hours",
    ],
    weeklyEngagement: [
      { day: "Mon", checkIns: 42 },
      { day: "Tue", checkIns: 45 },
      { day: "Wed", checkIns: 38 },
      { day: "Thu", checkIns: 41 },
      { day: "Fri", checkIns: 35 },
    ],
  };
}

export default async function OrganisationInsightsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const insights = getOrgInsights(orgId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground mb-2 text-3xl font-semibold">Team Insights</h1>
            <p className="text-muted-foreground">
              Aggregate insights from organisation-linked experiments
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/org/${orgId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Privacy Notice */}
        <Card className="bg-violet/10 border-violet/20 mb-8 p-6">
          <div className="flex items-start gap-3">
            <Shield className="text-violet mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h3 className="text-foreground mb-2 font-semibold">Privacy Protected</h3>
              <p className="text-muted-foreground mb-2 text-sm">
                These insights are built from experiments linked to this organisation.
                They show patterns across the team, not individual journeys.
              </p>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p className="text-foreground font-medium">What you&apos;re seeing:</p>
                <ul className="ml-2 list-inside list-disc">
                  <li>Aggregate statistics (averages, trends, patterns)</li>
                  <li>Anonymized participation data</li>
                  <li>Collective insights and recommendations</li>
                </ul>
                <p className="text-foreground mt-3 font-medium">
                  What you&apos;re not seeing:
                </p>
                <ul className="ml-2 list-inside list-disc">
                  <li>Anyone&apos;s personal reflections</li>
                  <li>Individual check-in data</li>
                  <li>Names or identifying information</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="text-muted-foreground mb-1 text-sm">Total Participants</div>
            <div className="text-foreground text-3xl font-semibold">
              {insights.totalParticipants}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-muted-foreground mb-1 text-sm">Active Experiments</div>
            <div className="text-foreground text-3xl font-semibold">
              {insights.activeExperiments}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-muted-foreground mb-1 text-sm">Avg Completion Rate</div>
            <div className="text-foreground text-3xl font-semibold">
              {insights.avgCompletionRate}%
            </div>
          </Card>
        </div>

        {/* Top Insights */}
        <Card className="mb-8 p-6">
          <h2
            className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold"
          >
            <BarChart3 className="h-5 w-5" />
            Key Insights
          </h2>
          <div className="space-y-3">
            {insights.topInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-muted/50 border-border rounded-xl border p-4"
              >
                <p className="text-foreground text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Engagement */}
        <Card className="p-6">
          <h2 className="text-foreground mb-4 text-xl font-semibold">Weekly Check-ins</h2>
          <div className="flex h-40 items-end justify-between gap-2">
            {insights.weeklyEngagement.map((day) => {
              const maxCheckIns = Math.max(
                ...insights.weeklyEngagement.map((d) => d.checkIns)
              );
              return (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="from-primary to-violet w-full rounded-t-lg bg-linear-to-t
                      transition-all"
                    style={{
                      height: `${(day.checkIns / maxCheckIns) * 100}%`,
                    }}
                  />
                  <span className="text-muted-foreground text-xs">{day.day}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
