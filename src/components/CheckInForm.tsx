"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  RadioGroupCustom as RadioGroup,
  RadioGroupItemCustom as RadioGroupItem,
} from "@/components/ui/radio-group-custom";
import type { CustomField, CreateFieldResponseRequest, UICheckIn } from "@/types";
import { getTodayUTC } from "@/lib/date-utils";
import { Calendar } from "lucide-react";

interface CheckInFormProps {
  experimentId: string;
  fields: CustomField[];
  onSuccess?: () => void;
  hideCard?: boolean;
  hideTitle?: boolean;
  /** Phase C.2: When set, form uses this date and prefills from initialCheckIn if provided. */
  selectedDate?: string;
  /** Phase C.2: Existing check-in for selectedDate; prefills notes and responses. */
  initialCheckIn?: UICheckIn | null;
  /** When true, hide the date input (date controlled by parent e.g. CheckInDatePicker). */
  hideDateInput?: boolean;
}

/**
 * Helper function to get emoji array based on count
 */
const getEmojis = (count: number): string[] => {
  if (count === 3) return ["😔", "😐", "😊"];
  if (count === 5) return ["😔", "😕", "😐", "😊", "😄"];
  if (count === 7) return ["😫", "😔", "😕", "😐", "😊", "😄", "🤩"];
  return ["😐"]; // fallback
};

/**
 * Check-In Form Component
 * Handles all field types: text, number, emoji, select, yesno
 */
export function CheckInForm({
  experimentId,
  fields,
  onSuccess,
  hideCard = false,
  hideTitle = false,
  selectedDate: selectedDateProp,
  initialCheckIn,
  hideDateInput = false,
}: CheckInFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = getTodayUTC();
  const [checkInDate, setCheckInDate] = useState(selectedDateProp ?? today);
  const [notes, setNotes] = useState("");
  const [responses, setResponses] = useState<Record<string, string | number | boolean>>({});

  // Phase C.2: Sync date and prefill when selectedDate / initialCheckIn change
  useEffect(() => {
    setCheckInDate(selectedDateProp ?? getTodayUTC());
    if (initialCheckIn) {
      setNotes(initialCheckIn.notes ?? "");
      const next: Record<string, string | number | boolean> = {};
      for (const r of initialCheckIn.responses) {
        if (r.responseText !== undefined) next[r.fieldId] = r.responseText;
        else if (r.responseNumber !== undefined) next[r.fieldId] = r.responseNumber;
        else if (r.responseBool !== undefined) next[r.fieldId] = r.responseBool;
        else if (r.selectedOption !== undefined) next[r.fieldId] = r.selectedOption;
      }
      setResponses(next);
    } else {
      setNotes("");
      setResponses({});
    }
  }, [selectedDateProp, initialCheckIn]);

  /**
   * Handle response change for different field types
   */
  const handleResponseChange = (fieldId: string, value: string | number | boolean) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  /**
   * Get response value for a field
   */
  const getResponseValue = (fieldId: string) => {
    return responses[fieldId] ?? undefined;
  };

  /**
   * Phase C.3: Per-field validation error (required, text non-empty, number min/max). Null if valid.
   */
  const getFieldError = (field: CustomField): string | null => {
    const value = responses[field.id];
    if (field.required) {
      if (value === undefined || value === null) return "Required";
      if (field.type === "text") {
        const s = String(value).trim();
        if (s === "") return "Required";
      }
      if (field.type === "number" && typeof value === "number") {
        const min = field.minValue ?? 0;
        const max = field.maxValue ?? 10;
        if (value < min || value > max) return `Must be between ${min} and ${max}`;
      }
      if (field.type === "emoji" && typeof value === "number") {
        const max = field.emojiCount ?? 5;
        if (value < 1 || value > max) return `Choose 1–${max}`;
      }
    }
    if (field.type === "text" && value !== undefined && value !== null && value !== "") {
      if (String(value).trim() === "") return "Required";
    }
    if (field.type === "number" && value !== undefined && value !== null && value !== "") {
      const n = Number(value);
      const min = field.minValue ?? 0;
      const max = field.maxValue ?? 10;
      if (Number.isNaN(n) || n < min || n > max) return `Must be between ${min} and ${max}`;
    }
    return null;
  };

  const fieldErrors = Object.fromEntries(fields.map((f) => [f.id, getFieldError(f)])) as Record<
    string,
    string | null
  >;
  const isFormValid = fields.every((f) => !fieldErrors[f.id]);

  const totalRequiredFields = fields.filter((f) => f.required).length;
  const filledRequiredFields = fields.filter((f) => f.required && !getFieldError(f)).length;

  const hasStructuredData = fields.some((f) => {
    if (f.type === "text") return false;
    const v = responses[f.id];
    return v !== undefined && v !== null && v !== "";
  });
  const showNotesNudge = hasStructuredData && !notes.trim();

  /**
   * Validate required fields (for submit guard)
   */
  const validateForm = (): boolean => {
    for (const field of fields) {
      const err = getFieldError(field);
      if (err) {
        setError(`${field.label}: ${err}`);
        return false;
      }
    }
    return true;
  };

  /**
   * Transform responses to API format
   */
  const transformResponsesToAPI = (): CreateFieldResponseRequest[] => {
    return fields.map((field) => {
      const value = responses[field.id];

      const response: CreateFieldResponseRequest = {
        fieldId: field.id,
      };

      switch (field.type) {
        case "text":
          response.responseText = value as string;
          break;
        case "number":
          response.responseNumber = Number(value);
          break;
        case "emoji":
          // Emoji value is stored as number (1-based ranking)
          response.responseNumber = Number(value);
          break;
        case "yesno":
          response.responseBool = value as boolean;
          break;
        case "select":
          response.selectedOption = value as string;
          break;
      }

      return response;
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiResponses = transformResponsesToAPI();

      const response = await fetch(`/api/experiments/${experimentId}/checkins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkInDate,
          notes: notes || null,
          responses: apiResponses,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create check-in");
      }

      // Success - reset form and refresh
      setResponses({});
      setNotes("");
      setCheckInDate(selectedDateProp ?? today);

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Error creating check-in:", err);
      setError(err instanceof Error ? err.message : "Failed to create check-in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phase C.3: Check-in completeness */}
      {totalRequiredFields > 0 && (
        <p className="text-sm text-muted-foreground">
          Check-in completeness: {filledRequiredFields} / {totalRequiredFields}
        </p>
      )}

      {/* Date Selection (hidden when date is controlled by parent e.g. dialog with CheckInDatePicker) */}
      {!hideDateInput && (
        <div>
          <Label htmlFor="checkInDate" className="text-sm font-medium mb-2 block">
            Date
          </Label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              id="checkInDate"
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="rounded-2xl border-border/50 max-w-xs"
              required
            />
          </div>
        </div>
      )}

      {/* Field Responses */}
      <div className="space-y-5">
        {fields.map((field) => {
          const fieldError = fieldErrors[field.id];
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`field-${field.id}`} className="text-sm font-medium">
                {field.label}
                {field.required && <span className="text-primary ml-1">*</span>}
              </Label>

              {/* Text Field */}
              {field.type === "text" &&
                (field.textType === "long" ? (
                  <Textarea
                    id={`field-${field.id}`}
                    value={(getResponseValue(field.id) as string) || ""}
                    onChange={(e) => handleResponseChange(field.id, e.target.value)}
                    placeholder="Type your response..."
                    className="rounded-2xl border-border/50 min-h-24 resize-none"
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={`field-${field.id}`}
                    type="text"
                    value={(getResponseValue(field.id) as string) || ""}
                    onChange={(e) => handleResponseChange(field.id, e.target.value)}
                    placeholder="Type your response..."
                    className="rounded-2xl border-border/50"
                    required={field.required}
                  />
                ))}

              {/* Number Field */}
              {field.type === "number" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[
                        getResponseValue(field.id)
                          ? Number(getResponseValue(field.id))
                          : field.minValue || 0,
                      ]}
                      onValueChange={(values) => handleResponseChange(field.id, values[0])}
                      min={field.minValue || 0}
                      max={field.maxValue || 10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-foreground min-w-12 text-center">
                      {getResponseValue(field.id)
                        ? getResponseValue(field.id)
                        : field.minValue || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>{field.minValue || 0}</span>
                    <span>{field.maxValue || 10}</span>
                  </div>
                </div>
              )}

              {/* Emoji Field */}
              {field.type === "emoji" && field.emojiCount && (
                <div className="space-y-2">
                  <div className="flex gap-2 justify-center">
                    {getEmojis(field.emojiCount).map((emoji, index) => {
                      const rank = index + 1; // 1-based ranking
                      const isSelected = getResponseValue(field.id) === rank;

                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleResponseChange(field.id, rank)}
                          className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                            isSelected
                              ? "bg-primary/20 border-2 border-primary scale-110"
                              : "bg-muted/50 border-2 border-transparent hover:bg-muted"
                          }`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              {/* Select Field */}
              {field.type === "select" && field.options && (
                <Select
                  value={(getResponseValue(field.id) as string) || ""}
                  onValueChange={(value) => handleResponseChange(field.id, value)}
                  required={field.required}
                >
                  <SelectTrigger id={`field-${field.id}`} className="rounded-2xl border-border/50">
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Yes/No Field */}
              {field.type === "yesno" && (
                <RadioGroup
                  value={
                    getResponseValue(field.id) === undefined
                      ? undefined
                      : (getResponseValue(field.id) as boolean)
                        ? "yes"
                        : "no"
                  }
                  onValueChange={(value) => handleResponseChange(field.id, value === "yes")}
                  required={field.required}
                >
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${field.id}-yes`} />
                      <Label htmlFor={`${field.id}-yes`} className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${field.id}-no`} />
                      <Label htmlFor={`${field.id}-no`} className="font-normal cursor-pointer">
                        No
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              )}

              {fieldError && <p className="text-xs text-destructive">{fieldError}</p>}
            </div>
          );
        })}
      </div>

      {/* Additional Notes */}
      <div>
        <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
          Additional Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional thoughts or observations..."
          className="rounded-2xl border-border/50 min-h-24 resize-none"
        />
        {/* Phase C.3: Optional notes nudge */}
        {showNotesNudge && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Adding a short note can help you reflect later.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex-1 rounded-2xl"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Check-in"
          )}
        </Button>
      </div>
    </form>
  );

  if (hideCard) {
    return (
      <div>
        {!hideTitle && <h3 className="text-lg font-semibold text-foreground mb-4">Add Check-in</h3>}
        {formContent}
      </div>
    );
  }

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border/50">
      {!hideTitle && <h3 className="text-lg font-semibold text-foreground mb-4">Add Check-in</h3>}
      {formContent}
    </Card>
  );
}
