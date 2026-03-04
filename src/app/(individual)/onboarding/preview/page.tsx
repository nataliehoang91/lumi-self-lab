"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
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
    <IndividualContainer>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div
            className="from-primary/20 to-violet/20 flex h-12 w-12 items-center
              justify-center rounded-2xl bg-gradient-to-br"
          >
            <Sparkles className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">AI Generated</p>
            <h1 className="text-foreground text-2xl font-semibold">
              Your Experiment Preview
            </h1>
          </div>
        </div>

        {/* Main experiment card */}
        <div
          className="bg-card border-border/50 mb-6 rounded-3xl border p-8 shadow-xl
            shadow-black/5"
        >
          {/* Title */}
          <div className="mb-6">
            <label className="text-muted-foreground mb-2 block text-sm">
              Experiment Title
            </label>
            {isEditing === "title" ? (
              <div className="flex gap-2">
                <Input
                  value={experiment.title}
                  onChange={(e) =>
                    setExperiment({ ...experiment, title: e.target.value })
                  }
                  className="rounded-xl text-2xl font-semibold"
                />
                <Button
                  size="icon"
                  onClick={() => setIsEditing(null)}
                  className="bg-primary rounded-xl"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="group flex items-center gap-2">
                <h2 className="text-foreground text-2xl font-semibold">
                  {experiment.title}
                </h2>
                <button
                  onClick={() => setIsEditing("title")}
                  className="hover:bg-muted rounded-lg p-1 opacity-0 transition-all
                    group-hover:opacity-100"
                >
                  <Edit2 className="text-muted-foreground h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Why it matters */}
          <div className="bg-violet/5 border-violet/20 mb-6 rounded-2xl border p-4">
            <label className="text-violet mb-2 block text-sm font-medium">
              Why This Matters
            </label>
            <p className="text-foreground">{experiment.whyItMatters}</p>
          </div>

          {/* Hypothesis */}
          <div className="bg-primary/5 border-primary/20 mb-6 rounded-2xl border p-4">
            <label className="text-primary mb-2 block text-sm font-medium">
              Your Hypothesis
            </label>
            <p className="text-foreground">{experiment.hypothesis}</p>
          </div>

          {/* Duration & Frequency */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="bg-muted/50 flex items-center gap-3 rounded-2xl p-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl
                  bg-sky-100 dark:bg-sky-900/30"
              >
                <Calendar className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Duration</p>
                <p className="font-medium">{experiment.duration} days</p>
              </div>
            </div>
            <div className="bg-muted/50 flex items-center gap-3 rounded-2xl p-4">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl
                  bg-emerald-100 dark:bg-emerald-900/30"
              >
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Check-in</p>
                <p className="font-medium">{experiment.frequency}</p>
              </div>
            </div>
          </div>

          {/* Tracking fields */}
          <div>
            <h3 className="text-foreground mb-4 text-lg font-medium">
              What You&apos;ll Track
            </h3>
            <div className="space-y-3">
              {experiment.fields.map((field, index) => {
                const Icon = fieldTypeIcons[field.type] || Target;
                return (
                  <div
                    key={field.id}
                    className="bg-muted/30 border-border/50 flex items-center gap-4
                      rounded-2xl border p-4"
                  >
                    <div
                      className="from-primary/20 to-violet/20 flex h-10 w-10 items-center
                        justify-center rounded-xl bg-gradient-to-br"
                    >
                      <Icon className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-foreground font-medium">{field.label}</p>
                      <p className="text-muted-foreground text-sm">
                        {fieldTypeLabels[field.type]}
                      </p>
                    </div>
                    <span
                      className="text-muted-foreground bg-muted rounded-lg px-2 py-1
                        text-xs"
                    >
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
            className="bg-primary hover:bg-violet text-primary-foreground gap-2
              rounded-2xl px-8 py-6 text-lg"
          >
            <Play className="h-5 w-5" />
            Start Experiment
          </Button>
        </div>
      </div>
    </IndividualContainer>
  );
}
