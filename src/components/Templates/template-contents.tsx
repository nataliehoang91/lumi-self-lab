"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  Calendar,
  BarChart3,
  Edit,
  Copy,
  Trash2,
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock team templates
const teamTemplates = [
  {
    id: "1",
    title: "Focus & Deep Work",
    description:
      "Help your team understand their focus patterns and optimize for deep work",
    category: "Productivity",
    fields: [
      { type: "emoji", label: "How focused did you feel today?" },
      { type: "number", label: "Hours of deep work" },
      {
        type: "select",
        label: "Main distraction",
        options: ["Meetings", "Slack", "Email", "Other"],
      },
      { type: "text", label: "What helped you focus?" },
    ],
    duration: 14,
    frequency: "Daily",
    activeUsers: 18,
    completionRate: 82,
    status: "active",
    createdAt: "2025-12-15",
  },
  {
    id: "2",
    title: "Meeting Effectiveness",
    description:
      "Evaluate meeting quality and find opportunities to improve team collaboration",
    category: "Collaboration",
    fields: [
      { type: "number", label: "Number of meetings today" },
      { type: "emoji", label: "Overall meeting quality" },
      { type: "yesno", label: "Did all meetings have clear agendas?" },
      { type: "text", label: "Meeting improvement idea" },
    ],
    duration: 21,
    frequency: "Daily",
    activeUsers: 12,
    completionRate: 75,
    status: "active",
    createdAt: "2025-12-20",
  },
  {
    id: "3",
    title: "Energy & Wellbeing",
    description: "Track energy levels throughout the day to find optimal work patterns",
    category: "Wellness",
    fields: [
      { type: "emoji", label: "Morning energy level" },
      { type: "emoji", label: "Afternoon energy level" },
      { type: "number", label: "Hours of sleep last night" },
      { type: "yesno", label: "Did you take breaks?" },
    ],
    duration: 14,
    frequency: "Daily",
    activeUsers: 9,
    completionRate: 71,
    status: "active",
    createdAt: "2026-01-02",
  },
  {
    id: "4",
    title: "Remote Work Check-in",
    description: "Monitor remote work experience and identify support needs",
    category: "Remote Work",
    fields: [
      { type: "emoji", label: "Work-from-home satisfaction" },
      { type: "yesno", label: "Did you feel connected to team?" },
      {
        type: "select",
        label: "Biggest challenge",
        options: ["Communication", "Focus", "Isolation", "Tech issues"],
      },
    ],
    duration: 30,
    frequency: "Daily",
    activeUsers: 0,
    completionRate: 0,
    status: "draft",
    createdAt: "2026-01-10",
  },
];

const categories = ["All", "Productivity", "Collaboration", "Wellness", "Remote Work"];

export default function ManagerTemplatesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTemplates = teamTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeTemplates = teamTemplates.filter((t) => t.status === "active").length;
  const totalParticipants = teamTemplates.reduce((sum, t) => sum + t.activeUsers, 0);

  return (
    <div
      className="dark:from-background dark:via-background min-h-screen bg-gradient-to-br
        from-orange-50 via-white to-violet-50 dark:to-violet-950/20"
    >
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div>
            <h1 className="text-foreground mb-1 text-3xl font-semibold">
              Team Templates
            </h1>
            <p className="text-muted-foreground">
              Create and manage experiment templates for your organisation
            </p>
          </div>

          <Link href="/org/create">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2
                rounded-2xl"
            >
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div
            className="bg-card border-border/50 rounded-2xl border p-5 shadow-lg
              shadow-black/5"
          >
            <div className="flex items-center gap-3">
              <div
                className="bg-primary/20 flex h-10 w-10 items-center justify-center
                  rounded-xl"
              >
                <BarChart3 className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {teamTemplates.length}
                </p>
                <p className="text-muted-foreground text-sm">Total Templates</p>
              </div>
            </div>
          </div>

          <div
            className="bg-card border-border/50 rounded-2xl border p-5 shadow-lg
              shadow-black/5"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl
                  bg-emerald-100 dark:bg-emerald-900/30"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {activeTemplates}
                </p>
                <p className="text-muted-foreground text-sm">Active Templates</p>
              </div>
            </div>
          </div>

          <div
            className="bg-card border-border/50 rounded-2xl border p-5 shadow-lg
              shadow-black/5"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl
                  bg-sky-100 dark:bg-sky-900/30"
              >
                <Users className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <p className="text-foreground text-2xl font-semibold">
                  {totalParticipants}
                </p>
                <p className="text-muted-foreground text-sm">Total Participants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-grow">
            <Search
              className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5
                -translate-y-1/2"
            />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border/50 h-12 rounded-2xl pl-12"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap
                transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : `bg-card border-border/50 text-muted-foreground
                      hover:text-foreground hover:border-primary/30 border`
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-card border-border/50 hover:border-primary/30 group
                rounded-2xl border p-6 shadow-lg shadow-black/5 transition-all"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      template.status === "active"
                        ? `bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30
                          dark:text-emerald-400`
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {template.status === "active" ? "Active" : "Draft"}
                  </span>
                  <span
                    className="bg-violet/10 text-violet rounded-full px-3 py-1 text-xs
                      font-medium"
                  >
                    {template.category}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hover:bg-muted rounded-xl p-2 transition-colors">
                      <MoreVertical className="text-muted-foreground h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive cursor-pointer gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content */}
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                {template.title}
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">{template.description}</p>

              {/* Fields preview */}
              <div className="mb-4 flex flex-wrap gap-2">
                {template.fields.map((field, index) => (
                  <span
                    key={index}
                    className="bg-muted/50 text-muted-foreground flex items-center gap-1
                      rounded-lg px-2 py-1 text-xs"
                  >
                    {field.type === "emoji" && "😊"}
                    {field.type === "number" && "#"}
                    {field.type === "text" && "T"}
                    {field.type === "yesno" && "✓"}
                    {field.type === "select" && "▼"}
                    {field.label.length > 20
                      ? field.label.substring(0, 20) + "..."
                      : field.label}
                  </span>
                ))}
              </div>

              {/* Meta info */}
              <div className="text-muted-foreground mb-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {template.duration} days
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {template.frequency}
                </span>
              </div>

              {/* Stats (only for active templates) */}
              {template.status === "active" && (
                <div
                  className="border-border/50 flex items-center justify-between border-t
                    pt-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span className="text-foreground font-medium">
                        {template.activeUsers}
                      </span>
                      <span className="text-muted-foreground">participants</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="text-muted-foreground h-4 w-4" />
                      <span className="text-foreground font-medium">
                        {template.completionRate}%
                      </span>
                      <span className="text-muted-foreground">completion</span>
                    </div>
                  </div>

                  <Link href={`/org/${template.id}/insights`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10 gap-1
                        rounded-xl"
                    >
                      <Sparkles className="h-4 w-4" />
                      Insights
                    </Button>
                  </Link>
                </div>
              )}

              {/* Publish button for drafts */}
              {template.status === "draft" && (
                <div className="border-border/50 border-t pt-4">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground
                      w-full rounded-xl"
                  >
                    Publish Template
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="py-16 text-center">
            <div
              className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center
                justify-center rounded-2xl"
            >
              <Search className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-medium">
              No templates found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Link href="/org/create">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2
                  rounded-2xl"
              >
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
