"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface CheckInDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

/**
 * Phase C.2: Date input for any date. Emits YYYY-MM-DD.
 */
export function CheckInDatePicker({ selectedDate, onChange }: CheckInDatePickerProps) {
  return (
    <div>
      <Label htmlFor="check-in-date-picker" className="text-sm font-medium mb-2 block">
        Date
      </Label>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          id="check-in-date-picker"
          type="date"
          value={selectedDate}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-2xl border-border/50 max-w-xs"
        />
      </div>
    </div>
  );
}
