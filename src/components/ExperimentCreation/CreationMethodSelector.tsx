"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, FileText, PenTool } from "lucide-react";

interface CreationMethodSelectorProps {
  onSelect: (method: "ai-guided" | "template" | "manual") => void;
  onBack: () => void;
  orgId?: string | null;
  templateId?: string | null;
  assignedInviteId?: string | null;
}

export function CreationMethodSelector({
  onSelect,
  onBack,
  orgId,
  templateId,
  assignedInviteId,
}: CreationMethodSelectorProps) {
  // If coming from template, skip method selection
  if (templateId) {
    return null; // Will be handled by parent
  }

  // If coming from assignment, skip method selection
  if (assignedInviteId) {
    return null; // Will be handled by parent
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-semibold">
            How do you want to create it?
          </h1>
          <p className="text-muted-foreground">Choose a method that works best for you</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* AI-Guided */}
          <Card
            className="hover:border-primary cursor-pointer p-6 transition-all"
            onClick={() => onSelect("ai-guided")}
          >
            <div
              className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center
                rounded-xl"
            >
              <Sparkles className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-foreground mb-2 font-semibold">AI-Guided</h3>
            <p className="text-muted-foreground text-sm">
              Answer a few questions and we&apos;ll help you design the perfect experiment
            </p>
            <Button className="mt-4 w-full" variant="outline">
              Get Started
            </Button>
          </Card>

          {/* Template */}
          <Card
            className="hover:border-primary cursor-pointer p-6 transition-all"
            onClick={() => onSelect("template")}
          >
            <div
              className="bg-violet/10 mb-4 flex h-12 w-12 items-center justify-center
                rounded-xl"
            >
              <FileText className="text-violet h-6 w-6" />
            </div>
            <h3 className="text-foreground mb-2 font-semibold">From Template</h3>
            <p className="text-muted-foreground text-sm">
              Start from a pre-designed template and customize it to your needs
            </p>
            <Button className="mt-4 w-full" variant="outline">
              Browse Templates
            </Button>
          </Card>

          {/* Manual */}
          <Card
            className="hover:border-primary cursor-pointer p-6 transition-all"
            onClick={() => onSelect("manual")}
          >
            <div
              className="bg-second/10 mb-4 flex h-12 w-12 items-center justify-center
                rounded-xl"
            >
              <PenTool className="text-second h-6 w-6" />
            </div>
            <h3 className="text-foreground mb-2 font-semibold">Manual</h3>
            <p className="text-muted-foreground text-sm">
              Build your experiment from scratch with full control
            </p>
            <Button className="mt-4 w-full" variant="outline">
              Start Building
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
