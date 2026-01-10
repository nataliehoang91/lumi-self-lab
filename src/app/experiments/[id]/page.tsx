"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FlaskConical,
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Book,
} from "lucide-react";
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

export default function ExperimentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [checkInNote, setCheckInNote] = useState("");

  const handleAddCheckIn = () => {
    console.log("Adding check-in:", checkInNote);
    setCheckInNote("");
    // TODO: Implement save check-in functionality
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/20";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-purple-50">
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
            <FlaskConical className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground">Self-Lab</span>
          </Link>
        </div>

        {/* Experiment Header */}
        <div className="mb-8">
          <Badge className={`mb-3 ${getStatusColor(MOCK_EXPERIMENT.status)}`}>
            {MOCK_EXPERIMENT.status.charAt(0).toUpperCase() +
              MOCK_EXPERIMENT.status.slice(1)}
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {MOCK_EXPERIMENT.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Started {MOCK_EXPERIMENT.startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{MOCK_EXPERIMENT.duration} days total</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="capitalize">
                {MOCK_EXPERIMENT.frequency} check-ins
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          {MOCK_EXPERIMENT.status === "active" && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {MOCK_EXPERIMENT.daysCompleted}/{MOCK_EXPERIMENT.duration}{" "}
                  days (
                  {getProgressPercentage(
                    MOCK_EXPERIMENT.daysCompleted,
                    MOCK_EXPERIMENT.duration
                  )}
                  %)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
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
        <div className="space-y-6 mb-8">
          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Why This Matters
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {MOCK_EXPERIMENT.whyMatters}
            </p>
          </Card>

          <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              My Hypothesis
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {MOCK_EXPERIMENT.hypothesis}
            </p>
          </Card>

          {MOCK_EXPERIMENT.faithLensEnabled && (
            <Card className="p-6 bg-card/80 backdrop-blur border-accent/20 border">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Book className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Faith Lens
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Related Scriptures
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    {MOCK_EXPERIMENT.scriptures}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Spiritual Reflection
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {MOCK_EXPERIMENT.spiritualReflection}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Add Check-in */}
        {MOCK_EXPERIMENT.status === "active" && (
          <Card className="p-6 bg-card/80 backdrop-blur border-border/50 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Add Today's Check-in
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
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Check-in History
          </h3>
          <div className="space-y-4">
            {MOCK_EXPERIMENT.checkIns.map((checkIn, index) => (
              <Card
                key={index}
                className="p-6 bg-card/80 backdrop-blur border-border/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      Day {checkIn.day}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {checkIn.date}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {checkIn.notes}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
