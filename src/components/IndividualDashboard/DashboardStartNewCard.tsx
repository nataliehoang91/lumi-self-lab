import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DashboardStartNewCard() {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Start Something New</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Design a custom experiment or use a template
          </p>
        </div>
        <Button variant="secondaryLight" asChild>
          <Link href="/experiments/create">
            <Plus className="w-5 h-5" />
            Create
          </Link>
        </Button>
      </div>
    </Card>
  );
}
