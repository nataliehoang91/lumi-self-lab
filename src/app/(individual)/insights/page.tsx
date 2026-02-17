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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Insights</h1>
          <p className="text-muted-foreground text-lg">
            Discover patterns and track your personal growth journey
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-3xl bg-transparent hover:bg-second/10 hover:border-second"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-400/10 to-emerald-500/10 border-green-500/20 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30 rounded-2xl">
              Active
            </Badge>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">3</div>
          <div className="text-sm text-muted-foreground">Active Experiments</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 border-blue-500/20 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 rounded-2xl">
              Total
            </Badge>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">2</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-400/10 to-rose-500/10 border-orange-500/20 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30 rounded-2xl">
              Best
            </Badge>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">15</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-400/10 to-pink-500/10 border-purple-500/20 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 rounded-2xl">
              Rate
            </Badge>
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">87%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="p-6 bg-card/80 backdrop-blur border-border/50 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Check-in Streak</h3>
              <p className="text-sm text-muted-foreground">Your consistency over time</p>
            </div>
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 80, 75, 90, 100, 85, 95, 88, 92, 78, 85, 90, 100, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-primary to-second rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Week 1</span>
            <span>Week 2</span>
          </div>
        </Card>

        <Card className="p-6 bg-card/80 backdrop-blur border-border/50 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">Experiment Categories</h3>
              <p className="text-sm text-muted-foreground">Distribution by focus area</p>
            </div>
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Productivity",
                value: 40,
                color: "bg-blue-500",
                icon: <Zap className="w-4 h-4" />,
              },
              {
                label: "Wellness",
                value: 30,
                color: "bg-green-500",
                icon: <Heart className="w-4 h-4" />,
              },
              {
                label: "Learning",
                value: 20,
                color: "bg-purple-500",
                icon: <Brain className="w-4 h-4" />,
              },
              {
                label: "Social",
                value: 10,
                color: "bg-orange-500",
                icon: <Target className="w-4 h-4" />,
              },
            ].map((category) => (
              <div key={category.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl ${category.color}/20 flex items-center justify-center`}
                    >
                      <div className="text-white">{category.icon}</div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{category.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{category.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
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
      <Card className="p-6 bg-card/80 backdrop-blur border-border/50 rounded-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Recent Discoveries</h3>
        </div>
        <div className="space-y-4">
          {[
            {
              experiment: "Morning Energy Patterns",
              insight: "Peak productivity occurs 1-2 hours after waking, declining after lunch",
              date: "2 days ago",
            },
            {
              experiment: "Social Confidence Check",
              insight: "Confidence increases significantly in smaller groups (2-3 people)",
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
              className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-second/5 border border-border/30"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground">{discovery.experiment}</h4>
                <Badge variant="outline" className="rounded-2xl text-xs">
                  {discovery.date}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{discovery.insight}</p>
            </div>
          ))}
        </div>
      </Card>
    </IndividualContainer>
  );
}
