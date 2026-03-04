"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RangeOption {
  label: string;
  value: string | number;
}

interface RangeFilterProps {
  title: string;
  minOptions: RangeOption[];
  maxOptions: RangeOption[];
  minValue?: RangeOption | null;
  maxValue?: RangeOption | null;
  onMinChange: (value: RangeOption | null) => void;
  onMaxChange: (value: RangeOption | null) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RangeFilter({
  title,
  minOptions,
  maxOptions,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  className,
  disabled = false,
}: RangeFilterProps) {
  const [isValidRange, setIsValidRange] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter max options based on min selection (exclude current min value)
  const getFilteredMaxOptions = () => {
    if (!minValue) return maxOptions;
    const minNum = Number.parseFloat(minValue.value?.toString() || "0");
    return maxOptions.filter((opt) => {
      const optNum = Number.parseFloat(opt.value?.toString() || "0");
      // Only show options greater than min value (not equal)
      return optNum > minNum;
    });
  };

  // Filter min options based on max selection (exclude current max value)
  const getFilteredMinOptions = () => {
    if (!maxValue) return minOptions;
    const maxNum = Number.parseFloat(maxValue.value?.toString() || "0");
    return minOptions.filter((opt) => {
      const optNum = Number.parseFloat(opt.value?.toString() || "0");
      // Only show options less than max value (not equal)
      return optNum < maxNum;
    });
  };

  // Validate range and auto-correct if needed
  const validateRange = (newMin: RangeOption | null, newMax: RangeOption | null) => {
    if (!newMin || !newMax) {
      setIsValidRange(true);
      setValidationMessage("");
      return;
    }

    const minNum = Number.parseFloat(newMin.value?.toString() || "0");
    const maxNum = Number.parseFloat(newMax.value?.toString() || "0");

    if (minNum >= maxNum) {
      // Auto-correct by swapping values
      onMinChange(newMax);
      onMaxChange(newMin);
      setIsValidRange(false);
      setValidationMessage("Range corrected automatically");

      // Clear validation message after 3 seconds
      setTimeout(() => {
        setIsValidRange(true);
        setValidationMessage("");
      }, 3000);
    } else {
      setIsValidRange(true);
      setValidationMessage("");
    }
  };

  // Handle min value change
  const handleMinChange = (value: string) => {
    const selectedOption = minOptions.find((opt) => opt.value.toString() === value);
    onMinChange(selectedOption || null);

    // Clear max value if it's now invalid
    if (selectedOption && maxValue) {
      const minNum = Number.parseFloat(selectedOption.value?.toString() || "0");
      const maxNum = Number.parseFloat(maxValue.value?.toString() || "0");
      if (minNum >= maxNum) {
        onMaxChange(null);
      }
    }

    // Validate after a short delay to ensure state is updated
    setTimeout(() => {
      validateRange(selectedOption || null, maxValue || null);
    }, 100);
  };

  // Handle max value change
  const handleMaxChange = (value: string) => {
    const selectedOption = maxOptions.find((opt) => opt.value.toString() === value);
    onMaxChange(selectedOption || null);

    // Clear min value if it's now invalid
    if (selectedOption && minValue) {
      const minNum = Number.parseFloat(minValue.value?.toString() || "0");
      const maxNum = Number.parseFloat(selectedOption.value?.toString() || "0");
      if (minNum >= maxNum) {
        onMinChange(null);
      }
    }

    // Validate after a short delay to ensure state is updated
    setTimeout(() => {
      validateRange(minValue || null, selectedOption || null);
    }, 100);
  };

  // Clear both values
  const clearRange = () => {
    console.log("Clearing range for:", title);
    console.log("Before clear - minValue:", minValue, "maxValue:", maxValue);

    // Clear immediately without setTimeout
    onMinChange(null);
    onMaxChange(null);
    setIsValidRange(true);
    setValidationMessage("");
    console.log("After clear - called onMinChange(null) and onMaxChange(null)");
  };

  const hasValues = minValue || maxValue;
  const filteredMinOptions = getFilteredMinOptions();
  const filteredMaxOptions = getFilteredMaxOptions();

  // Generate range display text
  const getRangeDisplayText = () => {
    if (minValue && maxValue) {
      return `${minValue.label} - ${maxValue.label}`;
    } else if (minValue) {
      return `${minValue.label}+`;
    } else if (maxValue) {
      return `Up to ${maxValue.label}`;
    }
    return "";
  };

  // Don't render until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <div className={cn("space-y-3", className)}>
        <Label className="text-foreground text-sm font-medium">{title}</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Min:</Label>
            <div className="bg-muted h-9 animate-pulse rounded-md" />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Max:</Label>
            <div className="bg-muted h-9 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-foreground text-sm font-medium">{title}</Label>

      <div className="grid grid-cols-2 gap-2">
        {/* Min Select */}
        <div className="space-y-1">
          <Label htmlFor={`min-${title}`} className="text-muted-foreground text-xs">
            Min:
          </Label>
          <Select
            value={minValue?.value?.toString() || ""}
            onValueChange={handleMinChange}
            disabled={disabled}
          >
            <SelectTrigger id={`min-${title}`} className="h-9">
              <SelectValue placeholder={minPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filteredMinOptions.length === 0 ? (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  No options available
                </div>
              ) : (
                filteredMinOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Max Select */}
        <div className="space-y-1">
          <Label htmlFor={`max-${title}`} className="text-muted-foreground text-xs">
            Max:
          </Label>
          <Select
            value={maxValue?.value?.toString() || ""}
            onValueChange={handleMaxChange}
            disabled={disabled}
          >
            <SelectTrigger id={`max-${title}`} className="h-9">
              <SelectValue placeholder={maxPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {filteredMaxOptions.length === 0 ? (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  No options available
                </div>
              ) : (
                filteredMaxOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Range Display and Validation */}
      {hasValues && (
        <div
          className={cn(
            "rounded-md border p-3 text-sm transition-all duration-200",
            isValidRange
              ? "border-blue-200 bg-blue-50 text-blue-800"
              : "border-red-200 bg-red-50 text-red-800"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{getRangeDisplayText()}</span>
            <div
              className="z-10 flex h-6 w-6 cursor-pointer items-center justify-center
                rounded p-0 hover:bg-red-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("X button clicked!");
                clearRange();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  clearRange();
                }
              }}
            >
              <X className="h-4 w-4" />
            </div>
          </div>

          {!isValidRange && validationMessage && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span>{validationMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
