"use client";

import { useState, useEffect } from "react";
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
import {
  CustomFieldBuilder,
  type CustomField,
} from "@/components/MainExperimentCreation/FormBuilder/custom-field-builder";
import {
  Eye,
  Play,
  Lightbulb,
  Target,
  Clock,
  ChevronLeft,
  Pencil,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ExperimentDraft } from "@/app/(individual)/experiments/create/page";

interface ExperimentFormPanelProps {
  draft?: ExperimentDraft | null;
  pushKey?: number;
}

export function ExperimentFormPanel({ draft, pushKey }: ExperimentFormPanelProps) {
  const router = useRouter();
  const [experimentTitle, setExperimentTitle] = useState("");
  const [whyMatters, setWhyMatters] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPushed, setIsPushed] = useState(false);

  // When a suggestion is selected on the left, populate the form + flash animation
  useEffect(() => {
    if (!draft || pushKey === 0) return;
    setExperimentTitle(draft.title);
    setWhyMatters(draft.whyMatters);
    setHypothesis(draft.hypothesis);
    setDuration(draft.duration);
    setFrequency(draft.frequency);
    if (draft.fields) {
      setCustomFields(draft.fields as CustomField[]);
    }
    setIsPushed(true);
    const t = setTimeout(() => setIsPushed(false), 700);
    return () => clearTimeout(t);
  }, [pushKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartExperiment = async () => {
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
      const fields = customFields.map((field, index) => ({
        label: field.label,
        type: field.type,
        required: field.required,
        order: index,
        textType: field.textType ?? null,
        minValue: field.minValue ?? null,
        maxValue: field.maxValue ?? null,
        emojiCount: field.emojiCount ?? null,
        selectOptions: field.options ?? [],
      }));

      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: experimentTitle,
          whyMatters: whyMatters || null,
          hypothesis: hypothesis || null,
          durationDays: Number(duration),
          frequency,
          faithEnabled: false,
          scriptureNotes: null,
          status: "active",
          fields,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create experiment");
      }

      const experiment = await res.json();
      router.push(`/experiments/${experiment.id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create experiment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "dark:from-background dark:to-background flex h-full flex-col bg-gradient-to-br from-orange-50 via-pink-50/50 to-purple-50 transition-all duration-300",
        isPushed && "ring-primary/40 ring-4 ring-inset"
      )}
    >
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 pb-4 md:px-8 md:py-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-foreground text-2xl font-bold md:text-3xl">New Experiment</h2>
              <p className="text-muted-foreground mt-1 text-sm">Design your reflection</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="hidden items-center gap-2 rounded-2xl md:flex"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </div>

          {/* Browse Templates */}
          <Link href="/templates">
            <Card className="group mb-5 cursor-pointer rounded-3xl border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-violet-800 dark:from-violet-950/30 dark:to-purple-950/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-200 transition-transform group-hover:scale-110 dark:bg-violet-800/50">
                  <Lightbulb className="h-5 w-5 text-violet-700 dark:text-violet-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-violet-900 dark:text-violet-100">Browse Templates</h3>
                  <p className="text-xs text-violet-700 dark:text-violet-300">Start with proven experiment templates</p>
                </div>
                <ChevronLeft className="h-5 w-5 rotate-180 text-violet-700 transition-transform group-hover:translate-x-1 dark:text-violet-300" />
              </div>
            </Card>
          </Link>

          <div className="space-y-5">
            {/* Experiment Basics */}
            <Card
              className={cn(
                "bg-card/95 border-border/50 rounded-3xl p-5 shadow-sm backdrop-blur-sm md:p-6 transition-all duration-300",
                isPushed && "border-primary/30 shadow-primary/10 shadow-md"
              )}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
                  <Target className="text-primary h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold">Experiment Basics</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2 block text-sm font-medium">Experiment Title</Label>
                  <Input
                    id="title"
                    value={experimentTitle}
                    onChange={(e) => setExperimentTitle(e.target.value)}
                    placeholder="e.g., My Morning Energy Patterns"
                    className="border-border/50 rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="why" className="mb-2 block text-sm font-medium">Why This Matters (Context)</Label>
                  <Textarea
                    id="why"
                    value={whyMatters}
                    onChange={(e) => setWhyMatters(e.target.value)}
                    placeholder="What made you curious about this? What do you hope to learn or change?"
                    className="border-border/50 min-h-24 resize-none rounded-2xl"
                  />
                </div>
                <div>
                  <Label htmlFor="hypothesis" className="mb-2 block text-sm font-medium">Your Hypothesis</Label>
                  <Textarea
                    id="hypothesis"
                    value={hypothesis}
                    onChange={(e) => setHypothesis(e.target.value)}
                    placeholder="What do you think you'll discover?"
                    className="border-border/50 min-h-24 resize-none rounded-2xl"
                  />
                </div>
              </div>
            </Card>

            {/* Experiment Design */}
            <Card className="bg-card/95 border-border/50 rounded-3xl p-5 shadow-sm backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-accent/20 flex h-8 w-8 items-center justify-center rounded-xl">
                  <Clock className="text-accent-foreground h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold">Experiment Design</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration" className="mb-2 block text-sm font-medium">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="7"
                    className="border-border/50 rounded-2xl"
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency" className="mb-2 block text-sm font-medium">Check-in Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger id="frequency" className="border-border/50 rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="every-2-days">Every 2 Days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* What Will You Track */}
            <Card className="bg-card/95 border-border/50 rounded-3xl p-5 shadow-sm backdrop-blur-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
                  <Pencil className="text-primary h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold">What Will You Track?</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">Add fields to record observations each day</p>
                </div>
              </div>
              <CustomFieldBuilder fields={customFields} onChange={setCustomFields} />
            </Card>

          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      {showPreview &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Check-In Preview</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)} className="h-8 w-8 rounded-xl p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">This is what your daily check-in will look like:</p>
              <div className="space-y-3">
                {customFields.length === 0 ? (
                  <p className="text-muted-foreground text-center text-sm">No tracking fields added yet.</p>
                ) : (
                  customFields.map((field) => (
                    <div key={field.id} className="bg-muted/50 rounded-xl p-3">
                      <Label className="mb-2 block text-xs">
                        {field.label}
                        {field.required && <span className="text-primary ml-1">*</span>}
                      </Label>
                      {field.type === "text" &&
                        (field.textType === "long" ? (
                          <textarea placeholder="Type your response..." className="border-border/50 bg-background min-h-[80px] w-full rounded-lg border p-2" disabled />
                        ) : (
                          <Input placeholder="Type your response..." className="rounded-lg" disabled />
                        ))}
                      {field.type === "number" && (
                        <div className="space-y-2">
                          <Input type="number" placeholder={`${field.minValue ?? 0} - ${field.maxValue ?? 10}`} className="rounded-lg" disabled />
                          <div className="text-muted-foreground flex justify-between text-xs">
                            <span>{field.minValue ?? 0}</span>
                            <span>{field.maxValue ?? 10}</span>
                          </div>
                        </div>
                      )}
                      {field.type === "emoji" && (
                        <div className="flex justify-center gap-2">
                          {(field.emojiCount === 3
                            ? ["😔", "😐", "😊"]
                            : field.emojiCount === 5
                              ? ["😔", "😕", "😐", "😊", "😄"]
                              : ["😫", "😔", "😕", "😐", "😊", "😄", "🤩"]
                          ).map((emoji) => (
                            <button key={emoji} type="button" className="hover:bg-primary/10 h-10 w-10 rounded-xl" disabled>{emoji}</button>
                          ))}
                        </div>
                      )}
                      {field.type === "yesno" && (
                        <div className="flex gap-2">
                          <Button variant="outline" disabled className="flex-1 rounded-xl bg-transparent">Yes</Button>
                          <Button variant="outline" disabled className="flex-1 rounded-xl bg-transparent">No</Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>,
          document.body
        )}

      {/* Sticky Start Experiment bar */}
      <div className="dark:from-background border-border/20 sticky bottom-0 border-t bg-gradient-to-t from-orange-50 via-pink-50/50 to-transparent p-4 backdrop-blur-xl dark:to-transparent">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          <Button
            onClick={handleStartExperiment}
            disabled={isSubmitting}
            className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground w-full rounded-3xl bg-gradient-to-r py-6 text-base font-semibold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating...</>
            ) : (
              <><Play className="mr-2 h-5 w-5" />Start Experiment</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
