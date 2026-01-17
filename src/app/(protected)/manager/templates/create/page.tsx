"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Eye,
  Save,
  Sparkles,
  Smile,
  Hash,
  Type,
  CheckSquare,
  List,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

type FieldType = "emoji" | "number" | "text" | "yesno" | "select";

interface TemplateField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
  config?: Record<string, unknown>;
}

const fieldTypeOptions = [
  {
    type: "emoji" as FieldType,
    label: "Emoji Scale",
    description: "Track feelings",
    icon: Smile,
    color: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  {
    type: "number" as FieldType,
    label: "Number Scale",
    description: "Rate 1-10",
    icon: Hash,
    color: "bg-gradient-to-br from-sky-400 to-blue-500",
  },
  {
    type: "text" as FieldType,
    label: "Text Journal",
    description: "Free writing",
    icon: Type,
    color: "bg-gradient-to-br from-pink-400 to-purple-500",
  },
  {
    type: "yesno" as FieldType,
    label: "Yes/No",
    description: "Simple check",
    icon: CheckSquare,
    color: "bg-gradient-to-br from-emerald-400 to-green-500",
  },
  {
    type: "select" as FieldType,
    label: "Multiple Choice",
    description: "Pick from options",
    icon: List,
    color: "bg-gradient-to-br from-violet-400 to-purple-500",
  },
];

const categories = [
  "Productivity",
  "Collaboration",
  "Wellness",
  "Remote Work",
  "Learning",
  "Custom",
];

export default function CreateTemplatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("14");
  const [frequency, setFrequency] = useState("daily");
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldType, setNewFieldType] = useState<FieldType | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleAddField = () => {
    if (!newFieldType) return;
    if (newFieldType !== "text" && !newFieldLabel.trim()) return;

    const newField: TemplateField = {
      id: Date.now().toString(),
      type: newFieldType,
      label: newFieldType === "text" ? "Daily reflection" : newFieldLabel,
      required: newFieldRequired,
      ...(newFieldType === "select" && {
        options: newFieldOptions
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean),
      }),
    };

    setFields([...fields, newField]);
    setNewFieldType(null);
    setNewFieldLabel("");
    setNewFieldRequired(true);
    setNewFieldOptions("");
    setIsAddingField(false);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const getFieldIcon = (type: FieldType) => {
    const option = fieldTypeOptions.find((o) => o.type === type);
    return option ? option.icon : Smile;
  };

  const getFieldColor = (type: FieldType) => {
    const option = fieldTypeOptions.find((o) => o.type === type);
    return option ? option.color : "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/manager/templates">
              <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Create Team Template
              </h1>
              <p className="text-sm text-muted-foreground">
                Design an experiment for your organization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl gap-2 bg-transparent"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4" />
              Save Template
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Template Basics
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Template Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Focus & Deep Work Tracking"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will participants learn from this experiment?"
                  className="rounded-xl min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hypothesis
                </label>
                <Textarea
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  placeholder="e.g., Team members who track their focus patterns will identify their optimal work hours"
                  className="rounded-xl min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duration (days)
                  </label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Check-in Frequency
                  </label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Check-in Fields */}
          <div className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50">
            <h2 className="text-lg font-medium text-foreground mb-2">
              Check-in Fields
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Define what participants will track each check-in
            </p>

            {/* Existing fields */}
            <div className="space-y-3 mb-6">
              {fields.map((field) => {
                const IconComponent = getFieldIcon(field.type);
                return (
                  <div
                    key={field.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${getFieldColor(
                        field.type
                      )} flex items-center justify-center`}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    <div className="grow">
                      <p className="font-medium text-foreground">
                        {field.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {
                          fieldTypeOptions.find((o) => o.type === field.type)
                            ?.label
                        }
                        {field.required && " • Required"}
                        {field.options && ` • ${field.options.length} options`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {fields.length === 0 && !isAddingField && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    No fields added yet. Add your first check-in field below.
                  </p>
                </div>
              )}
            </div>

            {/* Add field form */}
            {isAddingField && newFieldType && (
              <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 mb-4">
                <h3 className="font-medium text-foreground mb-4">
                  Configure{" "}
                  {fieldTypeOptions.find((o) => o.type === newFieldType)?.label}
                </h3>

                {newFieldType !== "text" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Question / Label *
                    </label>
                    <Input
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="e.g., How focused did you feel today?"
                      className="rounded-xl"
                    />
                  </div>
                )}

                {newFieldType === "select" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Options (comma separated)
                    </label>
                    <Input
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      placeholder="e.g., Meetings, Slack, Email, Other"
                      className="rounded-xl"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={newFieldRequired}
                      onCheckedChange={setNewFieldRequired}
                    />
                    Required field
                  </label>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => {
                        setIsAddingField(false);
                        setNewFieldType(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleAddField}
                    >
                      Add Field
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Field type selector */}
            {isAddingField && !newFieldType && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {fieldTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => setNewFieldType(option.type)}
                      className="p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
                    >
                      <div
                        className={`w-10 h-10 mx-auto rounded-xl ${option.color} flex items-center justify-center mb-2`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-medium text-sm text-foreground">
                        {option.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Add field button */}
            {!isAddingField && (
              <button
                onClick={() => setIsAddingField(true)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Check-in Field
              </button>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Check-in Preview
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  What participants will see
                </p>
              </div>

              <div className="p-6 space-y-6">
                {fields.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Add fields to see preview
                  </p>
                ) : (
                  fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {field.label}
                        {field.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </label>

                      {field.type === "emoji" && (
                        <div className="flex justify-between">
                          {["😔", "😕", "😐", "🙂", "😄"].map((emoji, i) => (
                            <button
                              key={i}
                              className="w-12 h-12 rounded-xl border border-border/50 text-2xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      {field.type === "number" && (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <button
                              key={n}
                              className="flex-1 py-2 rounded-lg border border-border/50 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      )}

                      {field.type === "text" && (
                        <Textarea
                          placeholder="Write your thoughts..."
                          className="rounded-xl"
                          disabled
                        />
                      )}

                      {field.type === "yesno" && (
                        <div className="flex gap-3">
                          <button className="flex-1 py-3 rounded-xl border border-border/50 hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                            Yes
                          </button>
                          <button className="flex-1 py-3 rounded-xl border border-border/50 hover:border-rose-500 hover:bg-rose-50 transition-all">
                            No
                          </button>
                        </div>
                      )}

                      {field.type === "select" && field.options && (
                        <div className="space-y-2">
                          {field.options.map((opt, i) => (
                            <button
                              key={i}
                              className="w-full p-3 rounded-xl border border-border/50 text-left hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
