"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { UIExperiment } from "@/lib/experiments-data";

type ExperimentStatus = "all" | "active" | "draft" | "completed";

interface ExperimentsListProps {
  experiments: UIExperiment[];
}

export function ExperimentsList({ experiments }: ExperimentsListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<ExperimentStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredExperiments =
    filter === "all" ? experiments : experiments.filter((exp) => exp.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900";
      case "draft":
        return "bg-muted text-muted-foreground border-border";
      case "completed":
        return "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  /**
   * Start an experiment (sets status to active and startedAt to today)
   */
  const handleStart = async (experimentId: string) => {
    setUpdatingId(experimentId);
    try {
      const response = await fetch(`/api/experiments/${experimentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "active",
          startedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start experiment");
      }

      router.refresh();
    } catch (error) {
      console.error("Error starting experiment:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  /**
   * Check if experiment is active but not started yet
   */
  const isActiveNotStarted = (experiment: UIExperiment) => {
    return experiment.status === "active" && !experiment.startDate;
  };

  /**
   * Check if experiment should show Start button
   */
  const shouldShowStart = (experiment: UIExperiment) => {
    return experiment.status === "draft" || isActiveNotStarted(experiment);
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-8 flex gap-2">
        <Button
          variant={filter === "all" ? "secondary" : "outline"}
          onClick={() => setFilter("all")}
          className={`${filter !== "all" ? "bg-transparent" : ""} hover:border-second`}
        >
          All ({experiments.length})
        </Button>
        <Button
          variant={filter === "active" ? "secondary" : "outline"}
          onClick={() => setFilter("active")}
          className={`${filter !== "active" ? "bg-transparent" : ""} hover:border-second`}
        >
          Active ({experiments.filter((e) => e.status === "active").length})
        </Button>
        <Button
          variant={filter === "draft" ? "secondary" : "outline"}
          onClick={() => setFilter("draft")}
          className={`${filter !== "draft" ? "bg-transparent" : ""} hover:border-second`}
        >
          Drafts ({experiments.filter((e) => e.status === "draft").length})
        </Button>
        <Button
          variant={filter === "completed" ? "secondary" : "outline"}
          onClick={() => setFilter("completed")}
          className={`${filter !== "completed" ? "bg-transparent" : ""}
            hover:border-second`}
        >
          Completed ({experiments.filter((e) => e.status === "completed").length})
        </Button>
      </div>

      {/* Experiments Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredExperiments.map((experiment) => (
          <Card
            key={experiment.id}
            className="bg-card/80 border-border/50 hover:border-primary/30 p-6
              backdrop-blur transition-all hover:shadow-lg"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <Badge className={`mb-3 ${getStatusColor(experiment.status)}`}>
                  {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                </Badge>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  {experiment.title}
                </h3>
              </div>
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
              {experiment.hypothesis}
            </p>

            <div className="mb-4 space-y-3">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{experiment.duration} days</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{experiment.frequency} check-ins</span>
              </div>
            </div>

            {/* Progress Bar - Only show for active experiments that have started */}
            {experiment.status === "active" && experiment.startDate && (
              <div className="mb-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">
                    {experiment.daysCompleted}/{experiment.duration} days
                  </span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="from-primary/80 to-primary/60 h-full bg-gradient-to-r
                      transition-all"
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

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="hover:border-second flex-1 bg-transparent"
                asChild
              >
                <Link href={`/experiments/${experiment.id}`}>
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {shouldShowStart(experiment) && (
                <Button
                  className="bg-primary hover:bg-primary/90 flex-1"
                  onClick={() => handleStart(experiment.id)}
                  disabled={updatingId === experiment.id}
                >
                  {updatingId === experiment.id ? "Starting..." : "Start"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredExperiments.length === 0 && (
        <Card className="bg-card/80 border-border/50 p-12 text-center backdrop-blur">
          <p className="text-muted-foreground mb-4">
            No experiments found in this category
          </p>
          <Button asChild>
            <Link href="/experiments/create">Create Your First Experiment</Link>
          </Button>
        </Card>
      )}
    </>
  );
}
