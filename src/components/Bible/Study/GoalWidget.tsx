"use client";

import { useState, useTransition } from "react";
import { Target, Calendar, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { setStudyGoal } from "@/app/actions/bible/study";
import type { BibleStudyListWithCount } from "@/types/bible-study";

function computeGoal(list: BibleStudyListWithCount) {
  if (!list.targetDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(list.targetDate);
  target.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const remaining = list.passageCount - list.studiedCount;
  const perDay = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;
  const onTrack = list.dailyGoalChapters ? perDay <= list.dailyGoalChapters : true;
  return { daysLeft, remaining, perDay, onTrack };
}

export function GoalWidget({
  list,
  lang,
}: {
  list: BibleStudyListWithCount;
  lang: string;
}) {
  const [editing, setEditing] = useState(false);
  const [dateValue, setDateValue] = useState(
    list.targetDate ? new Date(list.targetDate).toISOString().slice(0, 10) : ""
  );
  const [, startTransition] = useTransition();

  const goal = computeGoal(list);

  const handleSave = () => {
    setEditing(false);
    startTransition(async () => {
      await setStudyGoal(list.id, {
        targetDate: dateValue ? new Date(dateValue) : null,
      });
    });
  };

  const handleRemove = () => {
    setDateValue("");
    setEditing(false);
    startTransition(async () => {
      await setStudyGoal(list.id, { targetDate: null });
    });
  };

  const label = lang === "vi";

  if (editing) {
    return (
      <div
        className="border-t border-border/50 px-4 py-2.5 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <input
          type="date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          className="flex-1 rounded-lg border border-border bg-muted/30 px-2 py-1 text-xs text-foreground outline-none focus:border-primary/50"
        />
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground"
        >
          <Check className="h-3 w-3" />
        </button>
        {list.targetDate && (
          <button type="button" onClick={handleRemove} className="text-muted-foreground hover:text-destructive">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-[10px] text-muted-foreground hover:text-foreground"
        >
          {label ? "Hủy" : "Cancel"}
        </button>
      </div>
    );
  }

  if (!goal) {
    return (
      <div
        className="border-t border-border/50 px-4 py-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary transition-colors"
        >
          <Target className="h-3 w-3" />
          {label ? "Đặt mục tiêu hoàn thành" : "Set completion goal"}
        </button>
      </div>
    );
  }

  return (
    <div
      className="border-t border-border/50 px-4 py-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Target className="h-3 w-3 shrink-0 text-primary" />
          <span className="text-[11px] text-foreground">
            {goal.daysLeft <= 0
              ? (label ? "Đã đến hạn" : "Due today")
              : (label ? `${goal.daysLeft} ngày còn lại` : `${goal.daysLeft} days left`)}
          </span>
          {goal.remaining > 0 && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[9px] font-semibold",
                goal.onTrack
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
              )}
            >
              {goal.onTrack
                ? (label ? "Đúng tiến độ" : "On track")
                : (label ? `${goal.perDay} chương/ngày` : `${goal.perDay} ch/day`)}
            </span>
          )}
          {goal.remaining === 0 && (
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              {label ? "Hoàn thành!" : "Complete!"}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          {label ? "Sửa" : "Edit"}
        </button>
      </div>
    </div>
  );
}
