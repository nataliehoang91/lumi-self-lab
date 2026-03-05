"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, ArrowLeft, Calendar, Clock, Target, Book } from "lucide-react";
import { useState } from "react";

// Mock data - in a real app, this would come from a database
const MOCK_EXPERIMENT = {
  id: "1",
  title: "My Morning Energy Patterns",
  status: "active",
  duration: 14,
  frequency: "daily",
  daysCompleted: 7,
  startDate: "2026-01-03",
  hypothesis: "I'm most productive in the first 2 hours after waking up",
  whyMatters:
    "I've noticed inconsistency in my morning productivity and want to understand what truly affects my energy levels. This matters because mornings set the tone for my entire day.",
  faithLensEnabled: true,
  scriptures:
    "Proverbs 16:3 - Commit to the Lord whatever you do, and he will establish your plans",
  spiritualReflection:
    "I want to see how dedicating my mornings to purposeful work aligns with trusting God with my day. Can I find peace in productivity?",
  checkIns: [
    {
      date: "2026-01-10",
      day: 7,
      notes:
        "Woke up at 6:30am. Felt energized after coffee. Completed 3 deep work tasks before 9am. Energy dipped around 10am.",
    },
    {
      date: "2026-01-09",
      day: 6,
      notes:
        "Rough morning. Woke at 7am. Only managed 1 focused task. Distracted by emails early on.",
    },
    {
      date: "2026-01-08",
      day: 5,
      notes:
        "Best morning yet! Woke at 6am, meditated for 10min, then dove into work. Peak productivity until 10:30am.",
    },
  ],
};

export function ExperimentDetail() {
  const [checkInNote, setCheckInNote] = useState("");

  const handleAddCheckIn = () => {
    console.log("Adding check-in:", checkInNote);
    setCheckInNote("");
    // TODO: Implement save check-in functionality
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-second/10 text-second border-second/20";
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
            <span className="text-foreground font-bold">SelfWithin</span>
          </Link>
        </div>

        {/* Experiment Header */}
        <div className="mb-8">
          <Badge className={`mb-3 ${getStatusColor(MOCK_EXPERIMENT.status)}`}>
            {MOCK_EXPERIMENT.status.charAt(0).toUpperCase() +
              MOCK_EXPERIMENT.status.slice(1)}
          </Badge>
          <h1 className="text-foreground mb-4 text-4xl font-bold">
            {MOCK_EXPERIMENT.title}
          </h1>

          <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Started {MOCK_EXPERIMENT.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{MOCK_EXPERIMENT.duration} days total</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="capitalize">{MOCK_EXPERIMENT.frequency} check-ins</span>
            </div>
          </div>

          {/* Progress Bar */}
          {MOCK_EXPERIMENT.status === "active" && (
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {MOCK_EXPERIMENT.daysCompleted}/{MOCK_EXPERIMENT.duration} days (
                  {getProgressPercentage(
                    MOCK_EXPERIMENT.daysCompleted,
                    MOCK_EXPERIMENT.duration
                  )}
                  %)
                </span>
              </div>
              <div className="bg-muted h-3 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: `${getProgressPercentage(
                      MOCK_EXPERIMENT.daysCompleted,
                      MOCK_EXPERIMENT.duration
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Experiment Details */}
        <div className="mb-8 space-y-6">
          <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
            <h3 className="text-foreground mb-2 text-lg font-semibold">
              Why This Matters
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {MOCK_EXPERIMENT.whyMatters}
            </p>
          </Card>

          <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
            <h3 className="text-foreground mb-2 text-lg font-semibold">My Hypothesis</h3>
            <p className="text-muted-foreground leading-relaxed">
              {MOCK_EXPERIMENT.hypothesis}
            </p>
          </Card>

          {MOCK_EXPERIMENT.faithLensEnabled && (
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
              <div className="space-y-3">
                <div>
                  <p className="text-foreground mb-1 text-sm font-medium">
                    Related Scriptures
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    {MOCK_EXPERIMENT.scriptures}
                  </p>
                </div>
                <div>
                  <p className="text-foreground mb-1 text-sm font-medium">
                    Spiritual Reflection
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {MOCK_EXPERIMENT.spiritualReflection}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Add Check-in */}
        {MOCK_EXPERIMENT.status === "active" && (
          <Card className="bg-card/80 border-border/50 mb-8 p-6 backdrop-blur">
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Add Today&apos;s Check-in
            </h3>
            <Textarea
              value={checkInNote}
              onChange={(e) => setCheckInNote(e.target.value)}
              placeholder="How did today go? What did you notice about yourself?"
              className="mb-4 min-h-32 resize-none"
            />
            <Button onClick={handleAddCheckIn} disabled={!checkInNote.trim()}>
              Save Check-in
            </Button>
          </Card>
        )}

        {/* Check-in History */}
        <div>
          <h3 className="text-foreground mb-4 text-2xl font-bold">Check-in History</h3>
          <div className="space-y-4">
            {MOCK_EXPERIMENT.checkIns.map((checkIn, index) => (
              <Card key={index} className="bg-card/80 border-border/50 p-6 backdrop-blur">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-foreground font-semibold">Day {checkIn.day}</p>
                    <p className="text-muted-foreground text-sm">{checkIn.date}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{checkIn.notes}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
