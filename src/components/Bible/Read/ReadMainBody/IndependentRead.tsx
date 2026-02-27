"use client";

import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { LeftReadingPanel } from "./LeftReadingPanel";
import { RightReadingPanel } from "./RightReadingPanel";

export function IndependentRead() {
  return (
    <div className="w-full min-h-0 flex flex-col md:h-[calc(100vh-12rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn("flex-1 min-h-0 w-full overflow-hidden", "flex-col md:flex-row")}
      >
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="min-w-0 min-h-0 overflow-hidden"
        >
          <div className="h-full min-h-0 overflow-auto">
            <LeftReadingPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-primary data-resize-handle-active:bg-primary" />
        <ResizablePanel
          defaultSize={50}
          minSize={25}
          maxSize={75}
          className="min-w-0 min-h-0 overflow-hidden"
        >
          <div className="h-full min-h-0 overflow-auto">
            <RightReadingPanel />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
