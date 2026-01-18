"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  FlaskConical,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";

interface Experiment {
  id: string;
  title: string;
  status: string;
  durationDays: number;
  frequency: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  _count: {
    checkIns: number;
    fields: number;
  };
}

interface Stats {
  total: number;
  active: number;
  draft: number;
  completed: number;
  totalCheckIns: number;
  totalFields: number;
}

interface ManagerClientProps {
  experiments: Experiment[];
  stats: Stats;
}

export function ManagerClient({ experiments, stats }: ManagerClientProps) {
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-violet-700 dark:text-violet-300" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Manager Dashboard
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Overview and management of your experiments
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Experiments
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active</p>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Total Check-ins
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.totalCheckIns}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Status Breakdown */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Active Experiments
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stats.active} running
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {stats.active}
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Draft Experiments
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stats.draft} not started
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stats.draft}
            </div>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Completed</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.completed} finished
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-2xl">
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />
                New Experiment
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-2xl">
              <Link href="/experiments">
                View All Experiments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="rounded-2xl">
              <Link href="/templates">
                Browse Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Experiments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Experiments
            </h2>
            <Button variant="ghost" asChild className="rounded-2xl">
              <Link href="/experiments">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {experiments.slice(0, 6).map((experiment) => (
              <Card
                key={experiment.id}
                className="p-5 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Badge
                      className={`mb-2 ${getStatusColor(experiment.status)}`}
                    >
                      {experiment.status.charAt(0).toUpperCase() +
                        experiment.status.slice(1)}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                      {experiment.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{experiment.durationDays} days</span>
                    <span>•</span>
                    <span className="capitalize">{experiment.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{experiment._count.checkIns} check-ins</span>
                    <span>•</span>
                    <span>{experiment._count.fields} fields</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-2xl"
                  asChild
                >
                  <Link href={`/experiments/${experiment.id}`}>
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>

          {experiments.length === 0 && (
            <Card className="p-12 text-center bg-card/80 backdrop-blur border-border/50">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No experiments yet</p>
              <Button asChild className="rounded-2xl">
                <Link href="/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Experiment
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
