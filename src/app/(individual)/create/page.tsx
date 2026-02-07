import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizableHandle } from "@/components/ui/resizable";
import { AiChatPanel } from "@/components/MainAIChat/AIChatPanel";
import { ExperimentFormPanel } from "@/components/MainExperimentCreation/ExperimentCreationDetails";
/**
 * Create Experiment Page - Main page for creating new experiments
 *
 * This page is protected by:
 * 1. clerkMiddleware in proxy.ts - redirects unauthenticated users
 * 2. ProtectedLayout - double-checks authentication and provides Navbar
 *
 * After successful sign-in/sign-up, users are redirected here automatically.
 * This page provides AI chat assistance and experiment creation form.
 */
export default function CreatePage() {
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
