"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckInReminderBanner } from "@/components/Experiment/CheckInReminderBanner";
import { CheckInTimeline } from "@/components/Experiment/CheckInTimeline";
import { CheckInDatePicker } from "@/components/Experiment/CheckInDatePicker";
import { getTodayUTC } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FlaskConical,
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Book,
  Pencil,
  Plus,
  Eye,
  Sparkles,
  Loader2,
  BarChart2,
  StopCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckInForm } from "@/components/CheckInForm";
import type { UIExperimentDetail, CustomField, ExperimentStatus } from "@/types";

/**
 * Get emoji based on rank (1-based) and emoji count
 */
const getEmojiForRank = (rank: number, emojiCount: number): string => {
  if (emojiCount === 3) {
    const emojis = ["😔", "😐", "😊"];
    return emojis[rank - 1] || "😐";
  }
  if (emojiCount === 5) {
    const emojis = ["😔", "😕", "😐", "😊", "😄"];
    return emojis[rank - 1] || "😐";
  }
  if (emojiCount === 7) {
    const emojis = ["😫", "😔", "😕", "😐", "😊", "😄", "🤩"];
    return emojis[rank - 1] || "😐";
  }
  return "😐";
};

/**
 * Format field response for display
 */
const formatFieldResponse = (response: {
  field: { type: string; emojiCount?: number };
  responseText?: string;
  responseNumber?: number;
  responseBool?: boolean;
  selectedOption?: string;
}): string => {
  if (response.responseText) return response.responseText;
  if (response.selectedOption) return response.selectedOption;
  if (response.responseBool !== undefined) return response.responseBool ? "Yes" : "No";
  if (response.responseNumber !== undefined) {
    // Check if it's an emoji field
    if (response.field.type === "emoji" && response.field.emojiCount) {
      return getEmojiForRank(response.responseNumber, response.field.emojiCount);
    }
    // Otherwise it's a number
    return String(response.responseNumber);
  }
  return "—";
};

interface ExperimentDetailClientProps {
  experiment: UIExperimentDetail;
}

type ReminderState = {
  paused: boolean;
  pausedAt: string | null;
  snoozed?: boolean;
  snoozedUntil?: string | null;
};

export function ExperimentDetailClient({ experiment }: ExperimentDetailClientProps) {
  const router = useRouter();
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reminder, setReminder] = useState<ReminderState | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => getTodayUTC());
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/experiments/${experiment.id}/reminder`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.paused === "boolean")
          setReminder({
            paused: data.paused,
            pausedAt: data.pausedAt ?? null,
            snoozed: data.snoozed === true,
            snoozedUntil: data.snoozedUntil ?? null,
          });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [experiment.id]);

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

  // Calculate day number from start date and check-in date
  const getDayNumber = (checkInDate: string): number => {
    if (!experiment.startDate) return 0;
    const start = new Date(experiment.startDate);
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Day 1 is the start date
  };

  const handleCheckInSuccess = () => {
    setIsCheckInDialogOpen(false); // Close dialog
    router.refresh(); // Refresh to get updated check-ins
  };

  /**
   * Update experiment status
   */
  const updateExperimentStatus = async (
    status: string,
    startedAt?: string | null,
    completedAt?: string | null
  ) => {
    setIsUpdating(true);
    try {
      const updateData: {
        status: string;
        startedAt?: string | null;
        completedAt?: string | null;
      } = { status };
      if (startedAt !== undefined) updateData.startedAt = startedAt;
      if (completedAt !== undefined) updateData.completedAt = completedAt;

      const response = await fetch(`/api/experiments/${experiment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update experiment status");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating experiment status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Start experiment (sets status to active and startedAt to today)
   */
  const handleStart = () => {
    updateExperimentStatus("active", new Date().toISOString(), null);
  };

  /**
   * Publish draft (sets status to active but doesn't set startedAt)
   */
  const handlePublish = () => {
    updateExperimentStatus("active", null, null);
  };

  /**
   * Check if experiment is active but not started yet
   */
  const isActiveNotStarted = () => {
    return experiment.status === "active" && !experiment.startDate;
  };

  /**
   * Handle status change from dropdown
   */
  const handleStatusChange = (newStatus: ExperimentStatus) => {
    // If changing to active and not started, set startedAt
    if (newStatus === "active" && !experiment.startDate) {
      updateExperimentStatus(newStatus, new Date().toISOString(), null);
    }
    // If changing to completed, set completedAt
    else if (newStatus === "completed") {
      updateExperimentStatus(newStatus, null, new Date().toISOString());
    }
    // Otherwise just update status
    else {
      updateExperimentStatus(newStatus, null, null);
    }
  };

  const handleGenerateReflection = async () => {
    setIsGeneratingReflection(true);
    try {
      const res = await fetch(`/api/experiments/${experiment.id}/insights/reflection`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json() as { reflection: string };
        setAiReflection(data.reflection);
      }
    } catch {}
    setIsGeneratingReflection(false);
  };

  const handleStopAndAnalyse = async () => {
    setIsStopping(true);
    try {
      const response = await fetch(`/api/experiments/${experiment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed", completedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error("Failed to stop experiment");
      router.push(`/experiments/${experiment.id}/analyse`);
    } catch (error) {
      console.error("Error stopping experiment:", error);
      setIsStopping(false);
      setIsStopDialogOpen(false);
    }
  };

  /**
   * Render field preview based on field type
   */
  const renderFieldPreview = (field: CustomField) => {
    switch (field.type) {
      case "text":
        return field.textType === "long" ? (
          <textarea
            placeholder="Type your response..."
            className="border-border/50 bg-background min-h-20 w-full rounded-lg border p-2 text-sm"
            disabled
          />
        ) : (
          <input
            type="text"
            placeholder="Type your response..."
            className="border-border/50 bg-background w-full rounded-lg border p-2 text-sm"
            disabled
          />
        );
      case "number":
        return (
          <div className="space-y-2">
            <input
              type="number"
              placeholder={`${field.minValue || 0} - ${field.maxValue || 10}`}
              className="border-border/50 bg-background w-full rounded-lg border p-2 text-sm"
              disabled
            />
            <div className="text-muted-foreground flex justify-between px-1 text-xs">
              <span>{field.minValue || 0}</span>
              <span>{field.maxValue || 10}</span>
            </div>
          </div>
        );
      case "emoji":
        const emojiArray =
          field.emojiCount === 3
            ? ["😔", "😐", "😊"]
            : field.emojiCount === 5
              ? ["😔", "😕", "😐", "😊", "😄"]
              : ["😫", "😔", "😕", "😐", "😊", "😄", "🤩"];
        return (
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {emojiArray.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="bg-muted/30 border-border/50 flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-xl border text-xl"
                  disabled
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-muted-foreground flex justify-between px-1 text-xs">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        );
      case "select":
        return (
          <select
            className="border-border/50 bg-background w-full rounded-lg border p-2 text-sm"
            disabled
          >
            <option>Select an option...</option>
          </select>
        );
      case "yesno":
        return (
          <div className="flex gap-2">
            <button
              type="button"
              className="border-border/50 bg-background flex-1 cursor-not-allowed rounded-lg border p-2 text-sm"
              disabled
            >
              Yes
            </button>
            <button
              type="button"
              className="border-border/50 bg-background flex-1 cursor-not-allowed rounded-lg border p-2 text-sm"
              disabled
            >
              No
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/experiments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experiments
            </Link>
          </Button>
          <Link href="/" className="inline-flex items-center gap-2">
            <FlaskConical className="text-second h-6 w-6" />
            <span className="text-foreground font-bold">SelfWithin</span>
          </Link>
        </div>

        {/* Experiment Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <Badge className={getStatusColor(experiment.status)}>
              {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
            </Badge>
            {/* Status Selector */}
            <Select
              value={experiment.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="border-border/50 h-7 w-[140px] rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">{experiment.title}</h1>

          <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
            {experiment.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Started {experiment.startDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{experiment.duration} days total</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="capitalize">{experiment.frequency} check-ins</span>
            </div>
          </div>

          {/* Progress Bar - Only show for active experiments that have started */}
          {experiment.status === "active" && experiment.startDate && (
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {experiment.daysCompleted}/{experiment.duration} days (
                  {getProgressPercentage(experiment.daysCompleted, experiment.duration)}
                  %)
                </span>
              </div>
              <div className="bg-muted h-3 overflow-hidden rounded-full">
                <div
                  className="from-primary/80 to-primary/60 h-full bg-linear-to-r
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
        </div>

        {/* Reminder banner */}
        {reminder !== null && (
          <div className="mb-6">
            <CheckInReminderBanner
              experiment={{
                id: experiment.id,
                status: experiment.status,
                startDate: experiment.startDate,
                checkIns: experiment.checkIns,
              }}
              reminder={reminder}
            >
              {experiment.status === "active" &&
                experiment.startDate &&
                experiment.fields.length > 0 && (
                  <Button
                    onClick={() => {
                      setSelectedDate(getTodayUTC());
                      setIsCheckInDialogOpen(true);
                    }}
                    size="sm"
                    className="bg-amber-600 text-white hover:bg-amber-700"
                  >
                    Check in now
                  </Button>
                )}
            </CheckInReminderBanner>
          </div>
        )}

        {/* Action buttons — full width, prominent */}
        <div className="mb-8 space-y-3">
          {experiment.status === "draft" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePublish}
                disabled={isUpdating}
                className="flex-1 rounded-2xl py-6"
              >
                Publish
              </Button>
              <Button
                onClick={handleStart}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90 flex-1 rounded-2xl py-6"
              >
                {isUpdating ? "Starting..." : "Start"}
              </Button>
            </div>
          )}

          {isActiveNotStarted() && (
            <Button
              onClick={handleStart}
              disabled={isUpdating}
              className="from-primary to-primary hover:from-primary/90 hover:to-primary/90
                text-primary-foreground w-full rounded-3xl bg-linear-to-r py-6 text-base
                font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl
                active:scale-[0.98]"
            >
              {isUpdating ? "Starting..." : "Start Experiment"}
            </Button>
          )}

          {experiment.status === "active" &&
            experiment.startDate &&
            experiment.fields.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => {
                    setSelectedDate(getTodayUTC());
                    setIsCheckInDialogOpen(true);
                  }}
                  className="from-primary to-primary hover:from-primary/90
                    hover:to-primary/90 text-primary-foreground flex-1 rounded-3xl
                    bg-linear-to-r py-6 text-base font-semibold shadow-lg transition-all
                    hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Check-in Today
                </Button>
                {experiment.checkIns.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl py-6"
                      onClick={() => router.push(`/experiments/${experiment.id}/analyse`)}
                    >
                      <BarChart2 className="mr-2 h-4 w-4" />
                      Analyse Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl border-destructive/40 py-6 text-destructive hover:border-destructive hover:bg-destructive/5"
                      onClick={() => setIsStopDialogOpen(true)}
                    >
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            )}

          {experiment.status === "completed" && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="from-primary to-primary hover:from-primary/90 hover:to-primary/90
                  text-primary-foreground flex-1 rounded-3xl bg-linear-to-r py-6 text-base
                  font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl
                  active:scale-[0.98]"
                onClick={() => router.push(`/experiments/${experiment.id}/analyse`)}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                View AI Analysis
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-2xl py-6"
                onClick={() => router.push(`/experiments/${experiment.id}/review`)}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                View Raw Stats
              </Button>
            </div>
          )}
        </div>

        {/* Experiment details — 2-column grid on desktop */}
        {(experiment.whyMatters || experiment.hypothesis || experiment.faithEnabled) && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {experiment.whyMatters && (
              <Card className="bg-card/80 border-border/50 p-5 backdrop-blur">
                <h3 className="text-foreground mb-2 font-semibold">Why This Matters</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {experiment.whyMatters}
                </p>
              </Card>
            )}
            {experiment.hypothesis && (
              <Card className="bg-card/80 border-border/50 p-5 backdrop-blur">
                <h3 className="text-foreground mb-2 font-semibold">My Hypothesis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {experiment.hypothesis}
                </p>
              </Card>
            )}
            {experiment.faithEnabled && experiment.scriptureNotes && (
              <Card className="bg-card/80 border-accent/20 border p-5 backdrop-blur md:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <div className="bg-accent/10 flex h-7 w-7 items-center justify-center rounded-lg">
                    <Book className="text-accent h-4 w-4" />
                  </div>
                  <h3 className="text-foreground font-semibold">Faith Lens</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  {experiment.scriptureNotes}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Preview template + AI insights */}
        {experiment.fields.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(true)}
              className="border-border/60 rounded-2xl"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Check-in Template
            </Button>
            {experiment.checkIns.length >= 7 && (
              <Button
                onClick={handleGenerateReflection}
                disabled={isGeneratingReflection}
                variant="outline"
                className="rounded-2xl"
              >
                {isGeneratingReflection ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {aiReflection ? "Regenerate AI Insights" : "Generate AI Insights"}
              </Button>
            )}
          </div>
        )}

        {aiReflection && (
          <Card className="bg-card/80 border-border/50 mb-8 p-5 backdrop-blur">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              <h3 className="text-foreground font-semibold">AI Insights</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{aiReflection}</p>
          </Card>
        )}

        {/* Check-in by date (active + started) */}
        {experiment.status === "active" &&
          experiment.startDate &&
          experiment.fields.length > 0 && (
            <Card className="bg-card/80 border-border/50 mb-8 p-5 backdrop-blur">
              <h3 className="text-foreground mb-3 font-semibold">Check-in by date</h3>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <CheckInDatePicker
                    selectedDate={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setIsCheckInDialogOpen(true);
                    }}
                  />
                  <p className="text-muted-foreground mt-2 text-xs">
                    Pick any date to add or edit a past check-in.
                  </p>
                </div>
                {experiment.checkIns.length > 0 && (
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground mb-2 text-sm font-medium">Past check-ins (click to edit)</p>
                    <CheckInTimeline
                      checkIns={experiment.checkIns}
                      onSelectDate={(date) => {
                        setSelectedDate(date);
                        setIsCheckInDialogOpen(true);
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

        {/* Check-in History — compact cards */}
        {experiment.checkIns.length > 0 && (
          <div>
            <h3 className="text-foreground mb-4 text-xl font-bold">Check-in History</h3>
            <div className="space-y-3">
              {experiment.checkIns.map((checkIn) => {
                const dayNumber = getDayNumber(checkIn.checkInDate);
                return (
                  <Card
                    key={checkIn.id}
                    className="bg-card/80 border-border/50 px-5 py-4 backdrop-blur"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-foreground text-sm font-semibold">Day {dayNumber}</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(checkIn.checkInDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {checkIn.responses.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {checkIn.responses.map((response) => (
                          <div
                            key={response.id}
                            className="bg-muted/40 border-border/40 rounded-xl border px-3 py-1.5 text-xs"
                          >
                            <span className="text-muted-foreground">{response.field.label}: </span>
                            <span className="text-foreground font-medium">{formatFieldResponse(response)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {checkIn.notes && (
                      <p className="text-muted-foreground mt-2 text-xs italic">{checkIn.notes}</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {experiment.checkIns.length === 0 && experiment.status === "active" && (
          <Card className="bg-card/80 border-border/50 p-12 text-center backdrop-blur">
            <p className="text-muted-foreground">No check-ins yet. Add your first check-in above!</p>
          </Card>
        )}

        {/* Check-In Dialog (Phase C.2: any date, create or edit) */}
        <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle>
                {experiment.checkIns.some((c) => c.checkInDate === selectedDate)
                  ? "Edit check-in"
                  : "Add check-in"}
              </DialogTitle>
              <DialogDescription>Fill in your responses for this date</DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <CheckInDatePicker
                selectedDate={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
            {/* Phase C.3: Already checked in today warning (soft) */}
            {getTodayUTC() === selectedDate &&
              experiment.checkIns.some((c) => c.checkInDate === selectedDate) && (
                <div
                  className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10
                    px-4 py-3 text-sm text-amber-800 dark:text-amber-200"
                >
                  You&apos;ve already checked in today. Updating will overwrite
                  today&apos;s entry.
                </div>
              )}
            <CheckInForm
              experimentId={experiment.id}
              fields={experiment.fields}
              onSuccess={handleCheckInSuccess}
              hideCard={true}
              hideTitle={true}
              selectedDate={selectedDate}
              initialCheckIn={
                experiment.checkIns.find((c) => c.checkInDate === selectedDate) ?? null
              }
              hideDateInput={true}
            />
          </DialogContent>
        </Dialog>

        {/* Stop Experiment Confirmation Dialog */}
        <Dialog open={isStopDialogOpen} onOpenChange={setIsStopDialogOpen}>
          <DialogContent className="max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <StopCircle className="text-destructive h-5 w-5" />
                Stop this experiment?
              </DialogTitle>
              <DialogDescription>
                The experiment will be marked as completed early. You&apos;ll get a full
                analysis based on your {experiment.checkIns.length} check-in
                {experiment.checkIns.length !== 1 ? "s" : ""} so far.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              You&apos;ve completed {experiment.daysCompleted} of {experiment.duration} days ({Math.round((experiment.daysCompleted / experiment.duration) * 100)}%). The analysis will reflect what you&apos;ve tracked so far.
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl"
                onClick={() => setIsStopDialogOpen(false)}
                disabled={isStopping}
              >
                Keep going
              </Button>
              <Button
                className="flex-1 rounded-2xl bg-destructive text-white hover:bg-destructive/90"
                onClick={handleStopAndAnalyse}
                disabled={isStopping}
              >
                {isStopping ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BarChart2 className="mr-2 h-4 w-4" />
                )}
                {isStopping ? "Stopping..." : "Stop & Analyse"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Experiment Template Dialog */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="text-primary h-5 w-5" />
                Experiment Design
              </DialogTitle>
              <DialogDescription>
                This is what your daily check-in will look like:
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {experiment.fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-muted/30 border-border/30 rounded-xl border p-4"
                >
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    {field.label}
                    {field.required && <span className="text-primary ml-1">*</span>}
                  </label>
                  {renderFieldPreview(field)}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
