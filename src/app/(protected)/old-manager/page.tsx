"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  EyeOff,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

// Mock aggregate data (no private text shown)
const aggregateData = {
  totalParticipants: 47,
  activeExperiments: 23,
  avgCompletionRate: 78,
  avgStreak: 5.2,
  topExperiments: [
    { name: "Focus & Productivity", participants: 18, avgCompletion: 82 },
    { name: "Energy Tracking", participants: 12, avgCompletion: 75 },
    { name: "Meeting Impact", participants: 9, avgCompletion: 71 },
    { name: "Work-Life Balance", participants: 8, avgCompletion: 84 },
  ],
  weeklyEngagement: [
    { day: "Mon", checkIns: 42 },
    { day: "Tue", checkIns: 45 },
    { day: "Wed", checkIns: 38 },
    { day: "Thu", checkIns: 41 },
    { day: "Fri", checkIns: 35 },
    { day: "Sat", checkIns: 12 },
    { day: "Sun", checkIns: 8 },
  ],
  moodTrends: {
    veryPositive: 23,
    positive: 34,
    neutral: 28,
    negative: 12,
    veryNegative: 3,
  },
  insights: [
    {
      type: "positive",
      text: "Team focus scores are 15% higher on days with fewer meetings",
    },
    {
      type: "insight",
      text: "Most check-ins happen between 9-10am, suggesting morning reflection works well",
    },
    {
      type: "action",
      text: "3 team members haven't checked in this week - consider a gentle reminder",
    },
  ],
};

export default function ManagerDashboardPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState<"insights" | "templates">(
    "insights"
  );
  const maxCheckIns = Math.max(
    ...aggregateData.weeklyEngagement.map((d) => d.checkIns)
  );
  const totalMood = Object.values(aggregateData.moodTrends).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">
              Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your organisation&apos;s self-experiments
            </p>
          </div>

          <Link href="/manager/templates/create">
            <Button className="rounded-2xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <FileText className="w-4 h-4" />
              Create Template
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1 bg-muted/50 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === "insights"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Team Insights
            </span>
          </button>
          <Link href="/manager/templates">
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Templates
              </span>
            </button>
          </Link>
        </div>

        {/* Privacy notice */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-violet/10 border border-violet/20 mb-8">
          <EyeOff className="w-5 h-5 text-violet shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Privacy protected:</span> You&apos;re
            viewing aggregate insights only. Individual responses and personal
            reflections are never shared.
          </p>
        </div>

        {/* Time range filter */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="rounded-xl gap-2 bg-transparent"
            >
              <Shield className="w-4 h-4" />
              Privacy Settings
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {aggregateData.totalParticipants}
            </p>
            <p className="text-sm text-muted-foreground">Active Participants</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {aggregateData.activeExperiments}
            </p>
            <p className="text-sm text-muted-foreground">Active Experiments</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {aggregateData.avgCompletionRate}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {aggregateData.avgStreak}
            </p>
            <p className="text-sm text-muted-foreground">Avg Streak (days)</p>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Weekly engagement chart */}
          <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground">
                Weekly Check-ins
              </h3>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {aggregateData.weeklyEngagement.map((day) => (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-linear-to-t from-primary to-violet rounded-t-lg transition-all duration-500"
                    style={{ height: `${(day.checkIns / maxCheckIns) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood distribution */}
          <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-foreground">
                Mood Distribution
              </h3>
              <PieChart className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Very Positive",
                  value: aggregateData.moodTrends.veryPositive,
                  emoji: "😄",
                  color: "bg-emerald-500",
                },
                {
                  label: "Positive",
                  value: aggregateData.moodTrends.positive,
                  emoji: "🙂",
                  color: "bg-green-400",
                },
                {
                  label: "Neutral",
                  value: aggregateData.moodTrends.neutral,
                  emoji: "😐",
                  color: "bg-gray-400",
                },
                {
                  label: "Negative",
                  value: aggregateData.moodTrends.negative,
                  emoji: "😕",
                  color: "bg-orange-400",
                },
                {
                  label: "Very Negative",
                  value: aggregateData.moodTrends.veryNegative,
                  emoji: "😔",
                  color: "bg-red-400",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="grow">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium">
                        {Math.round((item.value / totalMood) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${(item.value / totalMood) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights & Top experiments row */}
        {activeTab === "insights" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Insights */}
            <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">
                  AI Insights
                </h3>
              </div>
              <div className="space-y-4">
                {aggregateData.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      insight.type === "positive"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                        : insight.type === "action"
                        ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                        : "bg-violet/10 border border-violet/20"
                    }`}
                  >
                    <p className="text-sm text-foreground">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top experiments */}
            <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground">
                  Popular Experiments
                </h3>
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {aggregateData.topExperiments.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/20 to-violet/20 flex items-center justify-center text-lg font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="grow">
                      <p className="font-medium text-foreground">{exp.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exp.participants} participants
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {exp.avgCompletion}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        completion
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
