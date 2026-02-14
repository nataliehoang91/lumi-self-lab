import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizableHandle } from "@/components/ui/resizable";
import { AiChatPanel } from "@/components/MainAIChat/AIChatPanel";
import { ExperimentFormPanel } from "@/components/MainExperimentCreation/ExperimentCreationDetails";

/**
 * Create Experiment Page - AI chat + experiment form (ResizablePanelGroup)
 * Route: /experiments/create
 */
export default function CreateExperimentPage() {
  return (
    <ResizablePanelGroup className="h-full w-full" direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
        <AiChatPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={70} minSize={50}>
        <ExperimentFormPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
