"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Plus,
  X,
  List,
  Smile,
  CheckCircle2,
  MessageSquare,
  Activity,
  Pencil,
} from "lucide-react";

export type FieldType = "text" | "number" | "select" | "emoji" | "yesno";

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select type
  minValue?: number; // For number scale
  maxValue?: number; // For number scale
  textType?: "short" | "long"; // For text fields
  emojiCount?: number; // For emoji scale (3, 5, or 7 options)
}

interface CustomFieldBuilderProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
}

export function CustomFieldBuilder({ fields, onChange }: CustomFieldBuilderProps) {
  const [isSelectingType, setIsSelectingType] = useState(false);
  const [isConfiguringField, setIsConfiguringField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    label: "",
    type: "text",
    required: false,
    options: [],
    minValue: 1,
    maxValue: 10,
    textType: "short",
    emojiCount: 5,
  });
  const [optionsText, setOptionsText] = useState("");

  const handleSelectType = (type: FieldType) => {
    setNewField({ ...newField, type });
    setIsSelectingType(false);
    setIsConfiguringField(true);
  };

  const handleEditField = (field: CustomField) => {
    setNewField({
      label: field.label,
      type: field.type,
      required: field.required,
      options: field.options,
      minValue: field.minValue,
      maxValue: field.maxValue,
      textType: field.textType,
      emojiCount: field.emojiCount,
    });
    setOptionsText(field.options?.join(", ") || "");
    setEditingFieldId(field.id);
    setIsConfiguringField(true);
  };

  const addField = () => {
    if (newField.type !== "text" && !newField.label) return;

    const field: CustomField = {
      id: editingFieldId || Date.now().toString(),
      label: newField.label || "Daily Reflection",
      type: newField.type as FieldType,
      required: newField.required || false,
      options:
        newField.type === "select"
          ? optionsText
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean)
          : undefined,
      minValue: newField.type === "number" ? newField.minValue : undefined,
      maxValue: newField.type === "number" ? newField.maxValue : undefined,
      textType: newField.type === "text" ? newField.textType : undefined,
      emojiCount: newField.type === "emoji" ? newField.emojiCount : undefined,
    };

    if (editingFieldId) {
      onChange(fields.map((f) => (f.id === editingFieldId ? field : f)));
    } else {
      onChange([...fields, field]);
    }

    setNewField({
      label: "",
      type: "text",
      required: false,
      options: [],
      minValue: 1,
      maxValue: 10,
      textType: "short",
      emojiCount: 5,
    });
    setOptionsText("");
    setIsConfiguringField(false);
    setEditingFieldId(null);
  };

  const cancelConfiguration = () => {
    setNewField({
      label: "",
      type: "text",
      required: false,
      options: [],
      minValue: 1,
      maxValue: 10,
      textType: "short",
      emojiCount: 5,
    });
    setOptionsText("");
    setIsConfiguringField(false);
    setEditingFieldId(null);
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
  };

  const updateRequired = (id: string, required: boolean) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, required } : f)));
  };

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      case "number":
        return <Activity className="h-4 w-4" />;
      case "select":
        return <List className="h-4 w-4" />;
      case "emoji":
        return <Smile className="h-4 w-4" />;
      case "yesno":
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getFieldTypeName = (type: FieldType) => {
    switch (type) {
      case "text":
        return "Text Journal";
      case "number":
        return "Number Scale";
      case "select":
        return "Select";
      case "emoji":
        return "Emoji Scale";
      case "yesno":
        return "Yes/No";
    }
  };

  /**
   * Helper function to get emoji array based on count
   */
  const getEmojiArray = (count: number): string[] => {
    if (count === 3) return ["😔", "😐", "😊"];
    if (count === 5) return ["😔", "😕", "😐", "😊", "😄"];
    if (count === 7) return ["😫", "😔", "😕", "😐", "😊", "😄", "🤩"];
    return ["😐"]; // fallback
  };

  return (
    <div className="space-y-3">
      {/* Field List */}
      {fields.length > 0 && (
        <div className="space-y-2">
          {fields.map((field, index) => (
            <Card
              key={field.id}
              className="border-border/50 bg-card rounded-2xl p-3 transition-all
                hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <div
                      className="bg-primary/10 flex h-6 w-6 flex-shrink-0 items-center
                        justify-center rounded-lg"
                    >
                      {getFieldIcon(field.type)}
                    </div>
                    <p className="truncate text-sm font-medium">{field.label}</p>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span>{getFieldTypeName(field.type)}</span>
                    {field.required && (
                      <>
                        <span>•</span>
                        <span className="text-primary">Required</span>
                      </>
                    )}
                    {field.options && field.options.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{field.options.length} options</span>
                      </>
                    )}
                    {field.minValue !== undefined && field.maxValue !== undefined && (
                      <>
                        <span>•</span>
                        <span>
                          {field.minValue} to {field.maxValue}
                        </span>
                      </>
                    )}
                    {field.textType && (
                      <>
                        <span>•</span>
                        <span>
                          {field.textType === "short" ? "Short text" : "Long text"}
                        </span>
                      </>
                    )}
                    {field.emojiCount && (
                      <>
                        <span>•</span>
                        <span>{field.emojiCount} levels</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditField(field)}
                    className="hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-xl
                      p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) => updateRequired(field.id, checked)}
                    className="scale-75"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(field.id)}
                    className="hover:bg-destructive/10 hover:text-destructive h-8 w-8
                      rounded-xl p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Step 2: Configuration Form */}
      {isConfiguringField && (
        <Card
          className="border-primary/50 from-primary/5 to-violet/5 rounded-2xl border-2
            bg-gradient-to-br p-5"
        >
          <h4 className="mb-4 font-semibold">
            {editingFieldId ? "Edit" : "Configure"}{" "}
            {getFieldTypeName(newField.type as FieldType)}
          </h4>

          <div className="space-y-4">
            {newField.type !== "text" && (
              <div>
                <Label htmlFor="field-label" className="mb-2 block text-sm">
                  Question / Label <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="field-label"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="e.g., How focused did I feel today?"
                  className="rounded-xl"
                  autoFocus
                />
              </div>
            )}

            {newField.type === "number" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="min-value" className="mb-2 block text-sm">
                    Min Value
                  </Label>
                  <Input
                    id="min-value"
                    type="number"
                    value={newField.minValue}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        minValue: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="max-value" className="mb-2 block text-sm">
                    Max Value
                  </Label>
                  <Input
                    id="max-value"
                    type="number"
                    value={newField.maxValue}
                    onChange={(e) =>
                      setNewField({
                        ...newField,
                        maxValue: Number.parseInt(e.target.value) || 10,
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}

            {newField.type === "emoji" && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm">Emoji Scale Levels</Label>
                  <Select
                    value={newField.emojiCount?.toString()}
                    onValueChange={(value) =>
                      setNewField({
                        ...newField,
                        emojiCount: Number.parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 levels (Simple)</SelectItem>
                      <SelectItem value="5">5 levels (Balanced)</SelectItem>
                      <SelectItem value="7">7 levels (Detailed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Live emoji preview */}
                <div className="bg-background border-border/50 rounded-xl border p-4">
                  <p className="text-muted-foreground mb-3 text-center text-xs">
                    During check-in, you&apos;ll select one emoji:
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {getEmojiArray(newField.emojiCount || 5).map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        className="hover:border-primary/50 hover:bg-primary/10 flex h-10
                          w-10 items-center justify-center rounded-xl border-2
                          border-transparent text-2xl transition-all hover:scale-110"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div
                    className="text-muted-foreground mt-2 flex justify-between px-1
                      text-xs"
                  >
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            )}

            {newField.type === "text" && (
              <div>
                <Label className="mb-2 block text-sm">Text Input Type</Label>
                <Select
                  value={newField.textType}
                  onValueChange={(value: "short" | "long") =>
                    setNewField({ ...newField, textType: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short text (single line)</SelectItem>
                    <SelectItem value="long">Long text (multiple lines)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {newField.type === "select" && (
              <div>
                <Label htmlFor="field-options" className="mb-2 block text-sm">
                  Dropdown Options
                </Label>
                <Input
                  id="field-options"
                  value={optionsText}
                  onChange={(e) => setOptionsText(e.target.value)}
                  placeholder="Option 1, Option 2, Option 3"
                  className="rounded-xl"
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Separate options with commas
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked) =>
                  setNewField({ ...newField, required: checked })
                }
              />
              <Label htmlFor="field-required" className="text-sm">
                Required field
              </Label>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={cancelConfiguration}
                className="flex-1 rounded-xl bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={addField}
                disabled={newField.type !== "text" && !newField.label}
                className="bg-primary hover:bg-primary/90 flex-1 rounded-xl transition-all
                  hover:scale-105"
              >
                {editingFieldId ? "Update Field" : "Add Field"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 1: Type Selector Popover */}
      {!isConfiguringField && (
        <Popover open={isSelectingType} onOpenChange={setIsSelectingType}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/5 w-full
                rounded-2xl border-2 border-dashed bg-transparent py-6 transition-all
                hover:scale-[1.02]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Check-In Field
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[450px] rounded-2xl p-5" align="start">
            <div className="space-y-4">
              <h4 className="font-semibold">Select Field Type</h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectType("emoji")}
                  className="border-border/50 bg-card hover:border-primary/50 rounded-2xl
                    border-2 p-4 transition-all hover:scale-[1.02]"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl
                        bg-gradient-to-br from-yellow-400 to-orange-400 text-white"
                    >
                      <Smile className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Emoji Scale</p>
                      <p className="text-muted-foreground text-xs">Track feelings</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectType("number")}
                  className="border-border/50 bg-card hover:border-primary/50 rounded-2xl
                    border-2 p-4 transition-all hover:scale-[1.02]"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl
                        bg-gradient-to-br from-blue-400 to-cyan-400 text-white"
                    >
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Number Scale</p>
                      <p className="text-muted-foreground text-xs">Rate 1-10</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectType("text")}
                  className="border-border/50 bg-card hover:border-primary/50 rounded-2xl
                    border-2 p-4 transition-all hover:scale-[1.02]"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl
                        bg-gradient-to-br from-purple-400 to-pink-400 text-white"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Text Journal</p>
                      <p className="text-muted-foreground text-xs">Free writing</p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectType("yesno")}
                  className="border-border/50 bg-card hover:border-primary/50 rounded-2xl
                    border-2 p-4 transition-all hover:scale-[1.02]"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl
                        bg-gradient-to-br from-green-400 to-emerald-400 text-white"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Yes/No</p>
                      <p className="text-muted-foreground text-xs">Simple check</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
