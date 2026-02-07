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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Team Insights
            </h1>
            <p className="text-muted-foreground">
              Aggregate insights from organisation-linked experiments
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/org/${orgId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        {/* Privacy Notice */}
        <Card className="p-6 bg-violet/10 border-violet/20 mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-violet shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Privacy Protected
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                These insights are built from experiments linked to this organisation. They show patterns across the team, not individual journeys.
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">What you&apos;re seeing:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Aggregate statistics (averages, trends, patterns)</li>
                  <li>Anonymized participation data</li>
                  <li>Collective insights and recommendations</li>
                </ul>
                <p className="font-medium text-foreground mt-3">What you&apos;re not seeing:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>Anyone&apos;s personal reflections</li>
                  <li>Individual check-in data</li>
                  <li>Names or identifying information</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Participants</div>
            <div className="text-3xl font-semibold text-foreground">
              {insights.totalParticipants}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Active Experiments</div>
            <div className="text-3xl font-semibold text-foreground">
              {insights.activeExperiments}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Avg Completion Rate</div>
            <div className="text-3xl font-semibold text-foreground">
              {insights.avgCompletionRate}%
            </div>
          </Card>
        </div>

        {/* Top Insights */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Key Insights
          </h2>
          <div className="space-y-3">
            {insights.topInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-muted/50 border border-border"
              >
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Engagement */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Weekly Check-ins
          </h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {insights.weeklyEngagement.map((day) => {
              const maxCheckIns = Math.max(
                ...insights.weeklyEngagement.map((d) => d.checkIns)
              );
              return (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-linear-to-t from-primary to-violet rounded-t-lg transition-all"
                    style={{
                      height: `${(day.checkIns / maxCheckIns) * 100}%`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
