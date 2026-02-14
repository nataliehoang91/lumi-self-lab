import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";

export function DashboardTipCard() {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-second/10 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-second" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">Keep Going</h3>
          <p className="text-muted-foreground leading-relaxed mb-1">
            Consistency builds insight. Check in on your experiments to track your progress.
          </p>
          <p className="text-xs text-muted-foreground">Based on your experiments</p>
        </div>
      </div>
    </Card>
  );
}
