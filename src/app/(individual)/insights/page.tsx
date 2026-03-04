"use client";

import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calendar,
  Target,
  Flame,
  BarChart3,
  Brain,
  Heart,
  Zap,
  Award,
  Download,
} from "lucide-react";

export default function InsightsPage() {
  return (
    <IndividualContainer>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground mb-2 text-4xl font-bold">Your Insights</h1>
          <p className="text-muted-foreground text-lg">
            Discover patterns and track your personal growth journey
          </p>
        </div>
        <Button
          variant="outline"
          className="hover:bg-second/10 hover:border-second rounded-3xl bg-transparent"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
          <div className="text-foreground mb-1 text-3xl font-bold">3</div>
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
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <Badge className="rounded-2xl border-blue-500/30 bg-blue-500/20 text-blue-600">
              Total
            </Badge>
          </div>
          <div className="text-foreground mb-1 text-3xl font-bold">2</div>
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
              Best
            </Badge>
          </div>
          <div className="text-foreground mb-1 text-3xl font-bold">15</div>
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
          <div className="text-foreground mb-1 text-3xl font-bold">87%</div>
          <div className="text-muted-foreground text-sm">Success Rate</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-card/80 border-border/50 rounded-3xl p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-foreground mb-1 text-xl font-semibold">
                Check-in Streak
              </h3>
              <p className="text-muted-foreground text-sm">Your consistency over time</p>
            </div>
            <Calendar className="text-primary h-6 w-6" />
          </div>
          <div className="flex h-64 items-end justify-between gap-2">
            {[65, 80, 75, 90, 100, 85, 95, 88, 92, 78, 85, 90, 100, 95].map(
              (height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="from-primary to-second w-full rounded-t-lg bg-gradient-to-t
                      transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            )}
          </div>
          <div className="text-muted-foreground mt-4 flex justify-between text-xs">
            <span>Week 1</span>
            <span>Week 2</span>
          </div>
        </Card>

        <Card className="bg-card/80 border-border/50 rounded-3xl p-6 backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-foreground mb-1 text-xl font-semibold">
                Experiment Categories
              </h3>
              <p className="text-muted-foreground text-sm">Distribution by focus area</p>
            </div>
            <BarChart3 className="text-primary h-6 w-6" />
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Productivity",
                value: 40,
                color: "bg-blue-500",
                icon: <Zap className="h-4 w-4" />,
              },
              {
                label: "Wellness",
                value: 30,
                color: "bg-green-500",
                icon: <Heart className="h-4 w-4" />,
              },
              {
                label: "Learning",
                value: 20,
                color: "bg-purple-500",
                icon: <Brain className="h-4 w-4" />,
              },
              {
                label: "Social",
                value: 10,
                color: "bg-orange-500",
                icon: <Target className="h-4 w-4" />,
              },
            ].map((category) => (
              <div key={category.label}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-xl ${category.color}/20 flex
                      items-center justify-center`}
                    >
                      <div className="text-white">{category.icon}</div>
                    </div>
                    <span className="text-foreground text-sm font-medium">
                      {category.label}
                    </span>
                  </div>
                  <span className="text-foreground text-sm font-semibold">
                    {category.value}%
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className={`h-full ${category.color} transition-all`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Discoveries */}
      <Card className="bg-card/80 border-border/50 rounded-3xl p-6 backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <Award className="text-primary h-6 w-6" />
          <h3 className="text-foreground text-xl font-semibold">Recent Discoveries</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              experiment: "Morning Energy Patterns",
              insight:
                "Peak productivity occurs 1-2 hours after waking, declining after lunch",
              date: "2 days ago",
            },
            {
              experiment: "Social Confidence Check",
              insight:
                "Confidence increases significantly in smaller groups (2-3 people)",
              date: "5 days ago",
            },
            {
              experiment: "Decision Making Under Pressure",
              insight: "Better decisions when taking 5-minute pause before responding",
              date: "1 week ago",
            },
          ].map((discovery, i) => (
            <div
              key={i}
              className="from-primary/5 to-second/5 border-border/30 rounded-2xl border
                bg-gradient-to-r p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="text-foreground font-semibold">{discovery.experiment}</h4>
                <Badge variant="outline" className="rounded-2xl text-xs">
                  {discovery.date}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {discovery.insight}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </IndividualContainer>
  );
}
