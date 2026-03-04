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
  Building2,
  Home,
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
      <div className="container mx-auto max-w-4xl px-4 py-8">
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
            <span className="text-foreground font-bold">Self-Lab</span>
          </Link>
        </div>

        {/* Experiment Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <Badge className={getStatusColor(experiment.status)}>
              {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
            </Badge>
            {/* Org Badge - Mock: replace with real data */}
            {false && ( // TODO: Replace with experiment.orgId check
              <Badge className="bg-violet/10 text-violet border-violet/20">
                <Building2 className="mr-1 h-3 w-3" />
                Linked to Organisation
              </Badge>
            )}
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

        {/* In-app check-in reminder (Phase R.2) */}
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

        {/* Experiment Details */}
        <div className="mb-8 space-y-6">
          {experiment.whyMatters && (
            <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Why This Matters
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {experiment.whyMatters}
              </p>
            </Card>
          )}

          {experiment.hypothesis && (
            <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                My Hypothesis
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {experiment.hypothesis}
              </p>
            </Card>
          )}

          {experiment.faithEnabled && experiment.scriptureNotes && (
            <Card className="bg-card/80 border-accent/20 border p-6 backdrop-blur">
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="bg-accent/10 flex h-8 w-8 items-center justify-center
                    rounded-lg"
                >
                  <Book className="text-accent h-4 w-4" />
                </div>
                <h3 className="text-foreground text-lg font-semibold">Faith Lens</h3>
              </div>
              <div>
                <p className="text-foreground mb-1 text-sm font-medium">
                  Related Scriptures
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  {experiment.scriptureNotes}
                </p>
              </div>
            </Card>
          )}

          {/* Preview Experiment Template Button */}
          {experiment.fields.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setIsPreviewDialogOpen(true)}
              className="border-primary/30 hover:border-primary hover:bg-primary/5 w-full
                rounded-2xl border-2 border-dashed bg-transparent py-6 transition-all
                hover:scale-[1.02]"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Experiment Template
            </Button>
          )}

          {/* Org Linking Section */}
          <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-foreground font-semibold">Organisation</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/experiments/${experiment.id}/org-linking`}>Manage</Link>
              </Button>
            </div>
            <div className="text-muted-foreground text-sm">
              {false ? ( // TODO: Replace with experiment.orgId check
                <div className="flex items-center gap-2">
                  <Building2 className="text-violet h-4 w-4" />
                  <span>Linked to organisation</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Personal experiment</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Status Action Buttons */}
        <div className="mb-8 space-y-3">
          {/* Draft: Show Publish and Start buttons */}
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

          {/* Active but not started: Show Start button */}
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

          {/* Active and started: Show Check-in button */}
          {experiment.status === "active" &&
            experiment.startDate &&
            experiment.fields.length > 0 && (
              <>
                <Button
                  onClick={() => {
                    setSelectedDate(getTodayUTC());
                    setIsCheckInDialogOpen(true);
                  }}
                  className="from-primary to-primary hover:from-primary/90
                    hover:to-primary/90 text-primary-foreground w-full rounded-3xl
                    bg-linear-to-r py-6 text-base font-semibold shadow-lg transition-all
                    hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Check-in
                </Button>

                {/* Phase C.2: Check-in by date */}
                <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
                  <h3 className="text-foreground mb-3 font-semibold">Check-in by date</h3>
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="min-w-0 flex-1">
                      <CheckInDatePicker
                        selectedDate={selectedDate}
                        onChange={(date) => {
                          setSelectedDate(date);
                          setIsCheckInDialogOpen(true);
                        }}
                      />
                      <p className="text-muted-foreground mt-2 text-xs">
                        Pick any date to add or edit. Click a date below to view or edit a
                        past check-in.
                      </p>
                    </div>
                    {experiment.checkIns.length > 0 && (
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground mb-2 text-sm font-medium">
                          Past check-ins (click to edit)
                        </p>
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
              </>
            )}

          {/* Completed: Show Results button */}
          {experiment.status === "completed" && (
            <Button
              variant="outline"
              className="w-full rounded-2xl py-6"
              onClick={() => {
                // TODO: Navigate to results page or show results in dialog
                console.log("Show results");
              }}
            >
              View Results
            </Button>
          )}
        </div>

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

        {/* Check-in History */}
        {experiment.checkIns.length > 0 && (
          <div>
            <h3 className="text-foreground mb-4 text-2xl font-bold">Check-in History</h3>
            <div className="space-y-4">
              {experiment.checkIns.map((checkIn) => {
                const dayNumber = getDayNumber(checkIn.checkInDate);

                return (
                  <Card
                    key={checkIn.id}
                    className="bg-card/80 border-border/50 p-6 backdrop-blur"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-semibold">Day {dayNumber}</p>
                        <p className="text-muted-foreground text-sm">
                          {new Date(checkIn.checkInDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Field Responses */}
                    {checkIn.responses.length > 0 && (
                      <div className="mb-4 space-y-3">
                        {checkIn.responses.map((response) => (
                          <div
                            key={response.id}
                            className="bg-muted/30 flex items-start gap-3 rounded-xl p-3"
                          >
                            <div className="flex-1">
                              <p className="text-foreground mb-1 text-sm font-medium">
                                {response.field.label}
                              </p>
                              <p className="text-muted-foreground text-base">
                                {formatFieldResponse(response)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {checkIn.notes && (
                      <div className="border-border/50 border-t pt-3">
                        <p className="text-foreground mb-1 text-sm font-medium">Notes</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {checkIn.notes}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {experiment.checkIns.length === 0 && experiment.status === "active" && (
          <Card className="bg-card/80 border-border/50 p-12 text-center backdrop-blur">
            <p className="text-muted-foreground">
              No check-ins yet. Add your first check-in above!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
