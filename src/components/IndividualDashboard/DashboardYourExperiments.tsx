import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { ActiveExperimentItem } from "@/lib/dashboard-data";

type Props = {
  experiments: ActiveExperimentItem[];
};

export function DashboardYourExperiments({ experiments }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">Your Experiments</h2>
        <Link href="/experiments">
          <Button variant="secondary" size="sm" className="bg-second/5">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {experiments.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4">
            No active experiments yet. Start one from Create.
          </p>
        ) : (
          experiments.map((exp) => {
            const pct =
              exp.durationDays > 0 ? Math.round((exp.daysActive / exp.durationDays) * 100) : 0;
            return (
              <Card key={exp.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/experiments/${exp.id}`}>
                      <h3 className="font-semibold text-foreground hover:underline mb-3">
                        {exp.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-second shrink-0" />
                        Day {exp.daysActive} of {exp.durationDays}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-coral shrink-0" />
                        {exp.lastCheckIn}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {exp.daysActive}/{exp.durationDays} days ({pct}%)
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-dark transition-all min-w-[4px]"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="primaryLight" asChild>
                    <Link href={`/experiments/${exp.id}`}>Check In</Link>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
