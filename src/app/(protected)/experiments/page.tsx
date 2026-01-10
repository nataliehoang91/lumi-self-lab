"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Plus, Calendar, Clock, ArrowRight } from "lucide-react";

// Mock data - in a real app, this would come from a database
const MOCK_EXPERIMENTS = [
  {
    id: "1",
    title: "My Morning Energy Patterns",
    status: "active",
    duration: 14,
    frequency: "daily",
    daysCompleted: 7,
    startDate: "2026-01-03",
    hypothesis: "I'm most productive in the first 2 hours after waking up",
  },
  {
    id: "2",
    title: "Understanding My Social Confidence",
    status: "active",
    duration: 21,
    frequency: "daily",
    daysCompleted: 3,
    startDate: "2026-01-08",
    hypothesis:
      "I feel more confident in one-on-one conversations than group settings",
  },
  {
    id: "3",
    title: "Am I Trustworthy?",
    status: "draft",
    duration: 7,
    frequency: "daily",
    daysCompleted: 0,
    startDate: null,
    hypothesis:
      "I keep my commitments most of the time, but struggle with spontaneous promises",
  },
  {
    id: "4",
    title: "My Decision-Making Under Pressure",
    status: "completed",
    duration: 10,
    frequency: "daily",
    daysCompleted: 10,
    startDate: "2025-12-20",
    hypothesis:
      "I make better decisions when I take time to reflect rather than rushing",
  },
];

type ExperimentStatus = "all" | "active" | "draft" | "completed";

export default function ExperimentsPage() {
  const [filter, setFilter] = useState<ExperimentStatus>("all");

  const filteredExperiments =
    filter === "all"
      ? MOCK_EXPERIMENTS
      : MOCK_EXPERIMENTS.filter((exp) => exp.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "draft":
        return "bg-muted text-muted-foreground border-border";
      case "completed":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <FlaskConical className="w-8 h-8 text-secondary" />
              <h1 className="text-3xl font-bold text-foreground">Self-Lab</h1>
            </Link>
          </div>
          <Button asChild>
            <Link href="/dashboard">
              <Plus className="w-4 h-4 mr-2" />
              New Experiment
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Your Experiments
          </h2>
          <p className="text-muted-foreground text-lg">
            Track your journey of self-discovery and personal insights
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={filter === "all" ? "secondary" : "outline"}
            onClick={() => setFilter("all")}
            className={`${
              filter !== "all" ? "bg-transparent" : ""
            } hover:border-secondary`}
          >
            All ({MOCK_EXPERIMENTS.length})
          </Button>
          <Button
            variant={filter === "active" ? "secondary" : "outline"}
            onClick={() => setFilter("active")}
            className={`${
              filter !== "active" ? "bg-transparent" : ""
            } hover:border-secondary`}
          >
            Active (
            {MOCK_EXPERIMENTS.filter((e) => e.status === "active").length})
          </Button>
          <Button
            variant={filter === "draft" ? "secondary" : "outline"}
            onClick={() => setFilter("draft")}
            className={`${
              filter !== "draft" ? "bg-transparent" : ""
            } hover:border-secondary`}
          >
            Drafts (
            {MOCK_EXPERIMENTS.filter((e) => e.status === "draft").length})
          </Button>
          <Button
            variant={filter === "completed" ? "secondary" : "outline"}
            onClick={() => setFilter("completed")}
            className={`${
              filter !== "completed" ? "bg-transparent" : ""
            } hover:border-secondary`}
          >
            Completed (
            {MOCK_EXPERIMENTS.filter((e) => e.status === "completed").length})
          </Button>
        </div>

        {/* Experiments Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredExperiments.map((experiment) => (
            <Card
              key={experiment.id}
              className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge
                    className={`mb-3 ${getStatusColor(experiment.status)}`}
                  >
                    {experiment.status.charAt(0).toUpperCase() +
                      experiment.status.slice(1)}
                  </Badge>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {experiment.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                {experiment.hypothesis}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{experiment.duration} days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="capitalize">
                    {experiment.frequency} check-ins
                  </span>
                </div>
              </div>

              {experiment.status === "active" && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">
                      {experiment.daysCompleted}/{experiment.duration} days
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all"
                      style={{
                        width: `${getProgressPercentage(
                          experiment.daysCompleted,
                          experiment.duration
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent hover:border-secondary"
                  asChild
                >
                  <Link href={`/experiments/${experiment.id}`}>
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                {experiment.status === "draft" && (
                  <Button className="flex-1" asChild>
                    <Link href="/dashboard">Start</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredExperiments.length === 0 && (
          <Card className="p-12 text-center bg-card/80 backdrop-blur border-border/50">
            <p className="text-muted-foreground mb-4">
              No experiments found in this category
            </p>
            <Button asChild>
              <Link href="/dashboard">Create Your First Experiment</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
