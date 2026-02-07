"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import type {
  UIExperimentDetail,
  CustomField,
  ExperimentStatus,
} from "@/types";

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
  if (response.responseBool !== undefined)
    return response.responseBool ? "Yes" : "No";
  if (response.responseNumber !== undefined) {
    // Check if it's an emoji field
    if (response.field.type === "emoji" && response.field.emojiCount) {
      return getEmojiForRank(
        response.responseNumber,
        response.field.emojiCount
      );
    }
    // Otherwise it's a number
    return String(response.responseNumber);
  }
  return "—";
};

interface ExperimentDetailClientProps {
  experiment: UIExperimentDetail;
}

export function ExperimentDetailClient({
  experiment,
}: ExperimentDetailClientProps) {
  const router = useRouter();
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
            className="w-full min-h-20 p-2 rounded-lg border border-border/50 bg-background text-sm"
            disabled
          />
        ) : (
          <input
            type="text"
            placeholder="Type your response..."
            className="w-full p-2 rounded-lg border border-border/50 bg-background text-sm"
            disabled
          />
        );
      case "number":
        return (
          <div className="space-y-2">
            <input
              type="number"
              placeholder={`${field.minValue || 0} - ${field.maxValue || 10}`}
              className="w-full p-2 rounded-lg border border-border/50 bg-background text-sm"
              disabled
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
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
            <div className="flex gap-2 justify-center">
              {emojiArray.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-10 h-10 rounded-xl bg-muted/30 border border-border/50 text-xl flex items-center justify-center cursor-not-allowed"
                  disabled
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        );
      case "select":
        return (
          <select
            className="w-full p-2 rounded-lg border border-border/50 bg-background text-sm"
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
              className="flex-1 p-2 rounded-lg border border-border/50 bg-background text-sm cursor-not-allowed"
              disabled
            >
              Yes
            </button>
            <button
              type="button"
              className="flex-1 p-2 rounded-lg border border-border/50 bg-background text-sm cursor-not-allowed"
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild>
            <Link href="/experiments">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Experiments
            </Link>
          </Button>
          <Link href="/" className="inline-flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-secondary" />
            <span className="font-bold text-foreground">Self-Lab</span>
          </Link>
        </div>

        {/* Experiment Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge className={getStatusColor(experiment.status)}>
              {experiment.status.charAt(0).toUpperCase() +
                experiment.status.slice(1)}
            </Badge>
            {/* Org Badge - Mock: replace with real data */}
            {false && ( // TODO: Replace with experiment.orgId check
              <Badge className="bg-violet/10 text-violet border-violet/20">
                <Building2 className="w-3 h-3 mr-1" />
                Linked to Organisation
              </Badge>
            )}
            {/* Status Selector */}
            <Select
              value={experiment.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[140px] h-7 text-xs rounded-xl border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {experiment.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            {experiment.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Started {experiment.startDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{experiment.duration} days total</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="capitalize">
                {experiment.frequency} check-ins
              </span>
            </div>
          </div>

          {/* Progress Bar - Only show for active experiments that have started */}
          {experiment.status === "active" && experiment.startDate && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {experiment.daysCompleted}/{experiment.duration} days (
                  {getProgressPercentage(
                    experiment.daysCompleted,
                    experiment.duration
                  )}
                  %)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary/80 to-primary/60 transition-all"
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

        {/* Experiment Details */}
        <div className="space-y-6 mb-8">
          {experiment.whyMatters && (
            <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Why This Matters
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {experiment.whyMatters}
              </p>
            </Card>
          )}

          {experiment.hypothesis && (
            <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                My Hypothesis
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {experiment.hypothesis}
              </p>
            </Card>
          )}

          {experiment.faithEnabled && experiment.scriptureNotes && (
            <Card className="p-6 bg-card/80 backdrop-blur border-accent/20 border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Book className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Faith Lens
                </h3>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Related Scriptures
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
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
              className="w-full py-6 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-[1.02] bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Experiment Template
            </Button>
          )}

          {/* Org Linking Section */}
          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Organisation</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/experiments/${experiment.id}/org-linking`}>
                  Manage
                </Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {false ? ( // TODO: Replace with experiment.orgId check
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-violet" />
                  <span>Linked to organisation</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
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
                className="flex-1 py-6 rounded-2xl"
              >
                Publish
              </Button>
              <Button
                onClick={handleStart}
                disabled={isUpdating}
                className="flex-1 py-6 rounded-2xl bg-primary hover:bg-primary/90"
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
              className="w-full py-6 rounded-3xl bg-linear-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isUpdating ? "Starting..." : "Start Experiment"}
            </Button>
          )}

          {/* Active and started: Show Check-in button */}
          {experiment.status === "active" &&
            experiment.startDate &&
            experiment.fields.length > 0 && (
              <Button
                onClick={() => setIsCheckInDialogOpen(true)}
                className="w-full py-6 rounded-3xl bg-linear-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Check-in
              </Button>
            )}

          {/* Completed: Show Results button */}
          {experiment.status === "completed" && (
            <Button
              variant="outline"
              className="w-full py-6 rounded-2xl"
              onClick={() => {
                // TODO: Navigate to results page or show results in dialog
                console.log("Show results");
              }}
            >
              View Results
            </Button>
          )}
        </div>

        {/* Check-In Dialog */}
        <Dialog
          open={isCheckInDialogOpen}
          onOpenChange={setIsCheckInDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add Check-in</DialogTitle>
              <DialogDescription>
                Fill in your responses for today&apos;s check-in
              </DialogDescription>
            </DialogHeader>
            <CheckInForm
              experimentId={experiment.id}
              fields={experiment.fields}
              onSuccess={handleCheckInSuccess}
              hideCard={true}
              hideTitle={true}
            />
          </DialogContent>
        </Dialog>

        {/* Preview Experiment Template Dialog */}
        <Dialog
          open={isPreviewDialogOpen}
          onOpenChange={setIsPreviewDialogOpen}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                Experiment Design
              </DialogTitle>
              <DialogDescription>
                This is what your daily check-in will look like:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {experiment.fields.map((field) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl bg-muted/30 border border-border/30"
                >
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {field.label}
                    {field.required && (
                      <span className="text-primary ml-1">*</span>
                    )}
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
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Check-in History
            </h3>
            <div className="space-y-4">
              {experiment.checkIns.map((checkIn) => {
                const dayNumber = getDayNumber(checkIn.checkInDate);

                return (
                  <Card
                    key={checkIn.id}
                    className="p-6 bg-card/80 backdrop-blur border-border/50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-foreground">
                          Day {dayNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(checkIn.checkInDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Field Responses */}
                    {checkIn.responses.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {checkIn.responses.map((response) => (
                          <div
                            key={response.id}
                            className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground mb-1">
                                {response.field.label}
                              </p>
                              <p className="text-base text-muted-foreground">
                                {formatFieldResponse(response)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Notes */}
                    {checkIn.notes && (
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-sm font-medium text-foreground mb-1">
                          Notes
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
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
          <Card className="p-12 text-center bg-card/80 backdrop-blur border-border/50">
            <p className="text-muted-foreground">
              No check-ins yet. Add your first check-in above!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
