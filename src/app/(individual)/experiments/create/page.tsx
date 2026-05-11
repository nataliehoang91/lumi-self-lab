"use client";

import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SuggestionChatPanel } from "@/components/MainAIChat/SuggestionChatPanel";
import { ExperimentFormPanel } from "@/components/MainExperimentCreation/ExperimentCreationDetails";

export type DraftField = {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "emoji" | "yesno";
  required: boolean;
  emojiCount?: number;
  minValue?: number;
  maxValue?: number;
  textType?: "short" | "long";
  options?: string[];
};

export type ExperimentDraft = {
  title: string;
  whyMatters: string;
  hypothesis: string;
  duration: string;
  frequency: string;
  fields?: DraftField[];
};

export default function CreateExperimentPage() {
  const [draft, setDraft] = useState<ExperimentDraft | null>(null);
  const [pushKey, setPushKey] = useState(0);

  const handleSelectSuggestion = (d: ExperimentDraft) => {
    setDraft(d);
    setPushKey((k) => k + 1); // trigger highlight animation on right panel
  };

  return (
    <ResizablePanelGroup className="h-full w-full" direction="horizontal">
      <ResizablePanel defaultSize={32} minSize={24} maxSize={48}>
        <SuggestionChatPanel onSelectSuggestion={handleSelectSuggestion} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={68} minSize={52}>
        <ExperimentFormPanel draft={draft} pushKey={pushKey} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
