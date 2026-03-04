import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function DashboardTipCard() {
  return (
    <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
      <div className="flex items-start gap-4">
        <div
          className="bg-second/10 flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl"
        >
          <Brain className="text-second h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-foreground mb-2 text-lg font-semibold">Keep Going</h3>
          <p className="text-muted-foreground mb-1 leading-relaxed">
            Consistency builds insight. Check in on your experiments to track your
            progress.
          </p>
          <p className="text-muted-foreground text-xs">Based on your experiments</p>
        </div>
      </div>
    </Card>
  );
}
