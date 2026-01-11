import { ResizablePanelGroup } from "@/components/ui/resizable";
import { ResizablePanel } from "@/components/ui/resizable";
import { ResizableHandle } from "@/components/ui/resizable";
import { AiChatPanel } from "@/components/MainAIChat/AIChatPanel";
import { ExperimentFormPanel } from "@/components/MainExperimentCreation/ExperimentCreationDetails";
/**
 * Dashboard Page - Protected route accessible only to authenticated users
 *
 * This page is protected by:
 * 1. clerkMiddleware in proxy.ts - redirects unauthenticated users
 * 2. ProtectedLayout - double-checks authentication and provides Navbar
 *
 * After successful sign-in/sign-up, users are redirected here automatically.
 * User information is displayed in the Navbar component (UserButton).
 */
export default function DashboardPage() {
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
