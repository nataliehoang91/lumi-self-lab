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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            How do you want to create it?
          </h1>
          <p className="text-muted-foreground">
            Choose a method that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* AI-Guided */}
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-all"
            onClick={() => onSelect("ai-guided")}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI-Guided</h3>
            <p className="text-sm text-muted-foreground">
              Answer a few questions and we&apos;ll help you design the perfect experiment
            </p>
            <Button className="w-full mt-4" variant="outline">
              Get Started
            </Button>
          </Card>

          {/* Template */}
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-all"
            onClick={() => onSelect("template")}
          >
            <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-violet" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">From Template</h3>
            <p className="text-sm text-muted-foreground">
              Start from a pre-designed template and customize it to your needs
            </p>
            <Button className="w-full mt-4" variant="outline">
              Browse Templates
            </Button>
          </Card>

          {/* Manual */}
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-all"
            onClick={() => onSelect("manual")}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Manual</h3>
            <p className="text-sm text-muted-foreground">
              Build your experiment from scratch with full control
            </p>
            <Button className="w-full mt-4" variant="outline">
              Start Building
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
