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
} from "lucide-react";
import { CheckInForm } from "@/components/CheckInForm";
import type { UIExperimentDetail, UICheckIn, CustomField } from "@/types";

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
          <Badge className={`mb-3 ${getStatusColor(experiment.status)}`}>
            {experiment.status.charAt(0).toUpperCase() +
              experiment.status.slice(1)}
          </Badge>
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

          {/* Progress Bar */}
          {experiment.status === "active" && (
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

          {/* Experiment Design Preview */}
          {experiment.fields.length > 0 && (
            <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Pencil className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Experiment Design
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This is what your daily check-in will look like:
              </p>
              <div className="space-y-4">
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
            </Card>
          )}
        </div>

        {/* Check-In Button */}
        {experiment.status === "active" && experiment.fields.length > 0 && (
          <div className="mb-8">
            <Button
              onClick={() => setIsCheckInDialogOpen(true)}
              className="w-full py-6 rounded-3xl bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Check-in
            </Button>
          </div>
        )}

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
