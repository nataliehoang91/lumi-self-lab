"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  CustomFieldBuilder,
  type CustomField,
} from "@/components/MainExperimentCreation/FormBuilder/custom-field-builder";
import {
  Eye,
  Save,
  Play,
  Lightbulb,
  Target,
  Clock,
  BookOpen,
  ChevronLeft,
  Pencil,
  X,
} from "lucide-react";
import Link from "next/link";

export function ExperimentFormPanel() {
  const router = useRouter();
  const [experimentTitle, setExperimentTitle] = useState("");
  const [whyMatters, setWhyMatters] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [faithLensEnabled, setFaithLensEnabled] = useState(false);
  const [scriptures, setScriptures] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartExperiment = async () => {
    // Validation
    if (!experimentTitle.trim()) {
      alert("Please enter an experiment title");
      return;
    }

    if (!duration || isNaN(Number(duration)) || Number(duration) < 1) {
      alert("Please enter a valid duration (at least 1 day)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map customFields to API format
      const fields = customFields.map((field, index) => ({
        label: field.label,
        type: field.type,
        required: field.required,
        order: index,
        textType: field.textType || null,
        minValue: field.minValue || null,
        maxValue: field.maxValue || null,
        emojiCount: field.emojiCount || null,
        selectOptions: field.options || [],
      }));

      // Call API to create experiment
      const response = await fetch("/api/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: experimentTitle,
          whyMatters: whyMatters || null,
          hypothesis: hypothesis || null,
          durationDays: Number(duration),
          frequency,
          faithEnabled: faithLensEnabled,
          scriptureNotes: scriptures || null,
          status: "active", // Start experiment as active
          fields,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create experiment");
      }

      const experiment = await response.json();

      // Redirect to experiment detail page
      router.push(`/experiments/${experiment.id}`);
    } catch (error) {
      console.error("Error creating experiment:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create experiment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 dark:from-background dark:to-background">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-2xl pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                New Experiment
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Design your reflection
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="hidden md:flex items-center gap-2 rounded-2xl hover:bg-accent/50 transition-all hover:scale-105 bg-transparent"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 rounded-2xl hover:bg-accent/50 transition-all hover:scale-105 bg-transparent"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Browse Templates Card */}
          <Link href="/templates">
            <Card className="p-4 mb-5 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200 dark:border-violet-800 rounded-3xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-violet-200 dark:bg-violet-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-5 h-5 text-violet-700 dark:text-violet-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                    Browse Templates
                  </h3>
                  <p className="text-xs text-violet-700 dark:text-violet-300">
                    Start with proven experiment templates
                  </p>
                </div>
                <ChevronLeft className="w-5 h-5 text-violet-700 dark:text-violet-300 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Experiment Basics Card */}
          <div className="space-y-5">
            <Card className="p-5 md:p-6 bg-card/95 backdrop-blur-sm border-border/50 rounded-3xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Experiment Basics</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium mb-2 block"
                  >
                    Experiment Title
                  </Label>
                  <Input
                    id="title"
                    value={experimentTitle}
                    onChange={(e) => setExperimentTitle(e.target.value)}
                    placeholder="e.g., My Morning Energy Patterns"
                    className="rounded-2xl border-border/50"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="why"
                    className="text-sm font-medium mb-2 block"
                  >
                    Why This Matters (Context)
                  </Label>
                  <Textarea
                    id="why"
                    value={whyMatters}
                    onChange={(e) => setWhyMatters(e.target.value)}
                    placeholder="What made you curious about this? What do you hope to learn or change?"
                    className="rounded-2xl min-h-24 resize-none border-border/50"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="hypothesis"
                    className="text-sm font-medium mb-2 block"
                  >
                    Your Hypothesis
                  </Label>
                  <Textarea
                    id="hypothesis"
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="What do you think you'll discover? e.g., 'I believe I'm more trustworthy in professional settings than personal ones because...'"
                    className="rounded-2xl min-h-24 resize-none border-border/50"
                  />
                </div>
              </div>
            </Card>

            {/* Experiment Design Card */}
            <div className="space-y-5">
              <Card className="p-5 md:p-6 bg-card/95 backdrop-blur-sm border-border/50 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <h3 className="text-base font-semibold">Experiment Design</h3>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="duration"
                        className="text-sm font-medium mb-2 block"
                      >
                        Duration (days)
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="7"
                        className="rounded-2xl border-border/50"
                        min="1"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="frequency"
                        className="text-sm font-medium mb-2 block"
                      >
                        Check-in Frequency
                      </Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger
                          id="frequency"
                          className="rounded-2xl border-border/50"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="every-2-days">
                            Every 2 Days
                          </SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* What Will You Track Card */}
              <Card className="p-5 md:p-6 bg-card/95 backdrop-blur-sm border-border/50 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Pencil className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold">
                      What Will You Track?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Add multiple fields to record different observations each
                      day
                    </p>
                  </div>
                </div>

                <CustomFieldBuilder
                  fields={customFields}
                  onChange={setCustomFields}
                />
              </Card>
            </div>

            {/* Faith Lens Card */}
            <Card className="p-5 md:p-6 bg-gradient-to-br from-secondary/10 to-accent/10 backdrop-blur-sm border-secondary/20 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Faith Lens
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Optional spiritual reflection
                    </p>
                  </div>
                </div>
                <Switch
                  checked={faithLensEnabled}
                  onCheckedChange={setFaithLensEnabled}
                />
              </div>

              {faithLensEnabled && (
                <div className="space-y-4 pt-3 border-t border-border/20">
                  <div>
                    <Label
                      htmlFor="scriptures"
                      className="text-sm font-medium mb-2 block"
                    >
                      Relevant Scriptures or Spiritual Reflections
                    </Label>
                    <Textarea
                      id="scriptures"
                      value={scriptures}
                      onChange={(e) => setScriptures(e.target.value)}
                      placeholder="Add verses, quotes, or spiritual insights that relate to this experiment..."
                      className="rounded-2xl min-h-20 resize-none border-border/50"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Dialog - rendered outside overflow container using portal */}
      {showPreview &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-lg w-full max-h-[80vh] overflow-auto p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Check-In Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                  className="h-8 w-8 p-0 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This is what your daily check-in will look like:
              </p>
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div key={field.id} className="p-3 rounded-xl bg-muted/50">
                    <Label className="text-xs mb-2 block">
                      {field.label}
                      {field.required && (
                        <span className="text-primary ml-1">*</span>
                      )}
                    </Label>
                    {field.type === "text" &&
                      (field.textType === "long" ? (
                        <textarea
                          placeholder="Type your response..."
                          className="w-full min-h-[80px] p-2 rounded-lg border border-border/50 bg-background"
                          disabled
                        />
                      ) : (
                        <Input
                          placeholder="Type your response..."
                          className="rounded-lg"
                          disabled
                        />
                      ))}
                    {field.type === "number" && (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          placeholder={`${field.minValue || 0} - ${
                            field.maxValue || 10
                          }`}
                          className="rounded-lg"
                          disabled
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{field.minValue || 0}</span>
                          <span>{field.maxValue || 10}</span>
                        </div>
                      </div>
                    )}
                    {field.type === "select" && (
                      <Select disabled>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select an option..." />
                        </SelectTrigger>
                      </Select>
                    )}
                    {field.type === "emoji" && (
                      <div className="flex gap-2 justify-center">
                        {field.emojiCount === 3 &&
                          ["😔", "😐", "😊"].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className="w-10 h-10 rounded-xl hover:bg-primary/10 transition-colors"
                              disabled
                            >
                              {emoji}
                            </button>
                          ))}
                        {field.emojiCount === 5 &&
                          ["😔", "😕", "😐", "😊", "😄"].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className="w-10 h-10 rounded-xl hover:bg-primary/10 transition-colors"
                              disabled
                            >
                              {emoji}
                            </button>
                          ))}
                        {field.emojiCount === 7 &&
                          ["😫", "😔", "😕", "😐", "😊", "😄", "🤩"].map(
                            (emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                className="w-10 h-10 rounded-xl hover:bg-primary/10 transition-colors"
                                disabled
                              >
                                {emoji}
                              </button>
                            )
                          )}
                      </div>
                    )}
                    {field.type === "yesno" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled
                          className="flex-1 rounded-xl bg-transparent"
                        >
                          Yes
                        </Button>
                        <Button
                          variant="outline"
                          disabled
                          className="flex-1 rounded-xl bg-transparent"
                        >
                          No
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>,
          document.body
        )}

      {/* Start Experiment Button */}
      <div className="sticky bottom-0 bg-gradient-to-t from-orange-100 via-pink-50 to-transparent dark:from-background dark:to-transparent backdrop-blur-xl border-t border-border/20 p-4">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <Button
            onClick={handleStartExperiment}
            disabled={isSubmitting}
            className="w-full py-6 rounded-3xl bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Experiment
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
