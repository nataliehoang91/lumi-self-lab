"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

type ExperimentStatus = "all" | "active" | "draft" | "completed";

interface UIExperiment {
  id: string;
  title: string;
  status: string;
  duration: number;
  frequency: string;
  daysCompleted: number;
  startDate: string | null;
  hypothesis: string;
}

interface ExperimentsListProps {
  experiments: UIExperiment[];
}

export function ExperimentsList({ experiments }: ExperimentsListProps) {
  const [filter, setFilter] = useState<ExperimentStatus>("all");

  const filteredExperiments =
    filter === "all"
      ? experiments
      : experiments.filter((exp) => exp.status === filter);

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
    <>
      {/* Filters */}
      <div className="flex gap-2 mb-8">
        <Button
          variant={filter === "all" ? "secondary" : "outline"}
          onClick={() => setFilter("all")}
          className={`${
            filter !== "all" ? "bg-transparent" : ""
          } hover:border-secondary`}
        >
          All ({experiments.length})
        </Button>
        <Button
          variant={filter === "active" ? "secondary" : "outline"}
          onClick={() => setFilter("active")}
          className={`${
            filter !== "active" ? "bg-transparent" : ""
          } hover:border-secondary`}
        >
          Active ({experiments.filter((e) => e.status === "active").length})
        </Button>
        <Button
          variant={filter === "draft" ? "secondary" : "outline"}
          onClick={() => setFilter("draft")}
          className={`${
            filter !== "draft" ? "bg-transparent" : ""
          } hover:border-secondary`}
        >
          Drafts ({experiments.filter((e) => e.status === "draft").length})
        </Button>
        <Button
          variant={filter === "completed" ? "secondary" : "outline"}
          onClick={() => setFilter("completed")}
          className={`${
            filter !== "completed" ? "bg-transparent" : ""
          } hover:border-secondary`}
        >
          Completed (
          {experiments.filter((e) => e.status === "completed").length})
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
                <Badge className={`mb-3 ${getStatusColor(experiment.status)}`}>
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
                <span className="capitalize">{experiment.frequency} check-ins</span>
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
    </>
  );
}
