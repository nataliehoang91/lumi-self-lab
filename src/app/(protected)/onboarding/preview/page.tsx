"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calendar,
  Clock,
  Target,
  Edit2,
  Check,
  Smile,
  Hash,
  Type,
  CheckSquare,
  List,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// AI-generated experiment based on user answers
const generatedExperiment = {
  title: "Understanding My Focus Patterns",
  hypothesis:
    "I believe my focus is highest in the morning and declines after lunch. By tracking this, I can schedule deep work more effectively.",
  whyItMatters:
    "Understanding when I'm most focused will help me optimize my workday and feel less frustrated when concentration drops.",
  duration: 14,
  frequency: "Daily",
  fields: [
    {
      id: "1",
      type: "emoji",
      label: "How focused do you feel right now?",
      config: { levels: 5 },
    },
    {
      id: "2",
      type: "number",
      label: "Rate your concentration (1-10)",
      config: { min: 1, max: 10 },
    },
    {
      id: "3",
      type: "select",
      label: "What time of day is it?",
      config: { options: ["Morning", "Midday", "Afternoon", "Evening"] },
    },
    {
      id: "4",
      type: "yesno",
      label: "Did you have caffeine in the last 2 hours?",
    },
    {
      id: "5",
      type: "text",
      label: "Any notes about what helped or hindered focus?",
      config: { multiline: true },
    },
  ],
};

const fieldTypeIcons: Record<string, any> = {
  emoji: Smile,
  number: Hash,
  text: Type,
  yesno: CheckSquare,
  select: List,
};

const fieldTypeLabels: Record<string, string> = {
  emoji: "Emoji Scale",
  number: "Number Scale",
  text: "Text",
  yesno: "Yes/No",
  select: "Multiple Choice",
};

export default function ExperimentPreviewPage() {
  const router = useRouter();
  const [experiment, setExperiment] = useState(generatedExperiment);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleStartExperiment = () => {
    router.push("/experiments/exp-new");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-violet/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">AI Generated</p>
            <h1 className="text-2xl font-semibold text-foreground">
              Your Experiment Preview
            </h1>
          </div>
        </div>

        {/* Main experiment card */}
        <div className="bg-card rounded-3xl p-8 shadow-xl shadow-black/5 border border-border/50 mb-6">
          {/* Title */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">
              Experiment Title
            </label>
            {isEditing === "title" ? (
              <div className="flex gap-2">
                <Input
                  value={experiment.title}
                  onChange={(e) =>
                    setExperiment({ ...experiment, title: e.target.value })
                  }
                  className="text-2xl font-semibold rounded-xl"
                />
                <Button
                  size="icon"
                  onClick={() => setIsEditing(null)}
                  className="rounded-xl bg-primary"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-2xl font-semibold text-foreground">
                  {experiment.title}
                </h2>
                <button
                  onClick={() => setIsEditing("title")}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </div>

          {/* Why it matters */}
          <div className="mb-6 p-4 rounded-2xl bg-violet/5 border border-violet/20">
            <label className="text-sm font-medium text-violet mb-2 block">
              Why This Matters
            </label>
            <p className="text-foreground">{experiment.whyItMatters}</p>
          </div>

          {/* Hypothesis */}
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/20">
            <label className="text-sm font-medium text-primary mb-2 block">
              Your Hypothesis
            </label>
            <p className="text-foreground">{experiment.hypothesis}</p>
          </div>

          {/* Duration & Frequency */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{experiment.duration} days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-medium">{experiment.frequency}</p>
              </div>
            </div>
          </div>

          {/* Tracking fields */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              What You'll Track
            </h3>
            <div className="space-y-3">
              {experiment.fields.map((field, index) => {
                const Icon = fieldTypeIcons[field.type] || Target;
                return (
                  <div
                    key={field.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-violet/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-foreground">
                        {field.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fieldTypeLabels[field.type]}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                      #{index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="rounded-2xl bg-transparent"
            onClick={() => router.back()}
          >
            Customize More
          </Button>
          <Button
            onClick={handleStartExperiment}
            className="gap-2 rounded-2xl bg-primary hover:bg-violet text-primary-foreground px-8 py-6 text-lg"
          >
            <Play className="w-5 h-5" />
            Start Experiment
          </Button>
        </div>
      </div>
    </div>
  );
}
