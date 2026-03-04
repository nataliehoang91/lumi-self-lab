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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-2xl font-bold">Your Experiments</h2>
        <Link href="/experiments">
          <Button variant="secondary" size="sm" className="bg-second/5">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {experiments.length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm">
            No active experiments yet. Start one from Create.
          </p>
        ) : (
          experiments.map((exp) => {
            const pct =
              exp.durationDays > 0
                ? Math.round((exp.daysActive / exp.durationDays) * 100)
                : 0;
            return (
              <Card key={exp.id} className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link href={`/experiments/${exp.id}`}>
                      <h3 className="text-foreground mb-3 font-semibold hover:underline">
                        {exp.name}
                      </h3>
                    </Link>
                    <div
                      className="text-muted-foreground mb-3 flex flex-wrap gap-4 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="text-second h-4 w-4 shrink-0" />
                        Day {exp.daysActive} of {exp.durationDays}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="text-coral h-4 w-4 shrink-0" />
                        {exp.lastCheckIn}
                      </span>
                    </div>
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">
                          {exp.daysActive}/{exp.durationDays} days ({pct}%)
                        </span>
                      </div>
                      <div className="bg-muted h-3 overflow-hidden rounded-full">
                        <div
                          className="bg-primary-dark h-full min-w-[4px] transition-all"
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
