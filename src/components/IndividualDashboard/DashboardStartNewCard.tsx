import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DashboardStartNewCard() {
  return (
    <Card className="bg-card/80 border-border/50 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-foreground mb-1 text-lg font-semibold">
            Start Something New
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Design a custom experiment or use a template
          </p>
        </div>
        <Button variant="secondaryLight" asChild>
          <Link href="/experiments/create">
            <Plus className="h-5 w-5" />
            Create
          </Link>
        </Button>
      </div>
    </Card>
  );
}
