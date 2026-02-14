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
    description: "Help your team understand their focus patterns and optimize for deep work",
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
    description: "Evaluate meeting quality and find opportunities to improve team collaboration",
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
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeTemplates = teamTemplates.filter((t) => t.status === "active").length;
  const totalParticipants = teamTemplates.reduce((sum, t) => sum + t.activeUsers, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-violet-50 dark:from-background dark:via-background dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-1">Team Templates</h1>
            <p className="text-muted-foreground">
              Create and manage experiment templates for your organisation
            </p>
          </div>

          <Link href="/org/create">
            <Button className="rounded-2xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{teamTemplates.length}</p>
                <p className="text-sm text-muted-foreground">Total Templates</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{activeTemplates}</p>
                <p className="text-sm text-muted-foreground">Active Templates</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 shadow-lg shadow-black/5 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{totalParticipants}</p>
                <p className="text-sm text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-card border-border/50"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-card rounded-2xl p-6 shadow-lg shadow-black/5 border border-border/50 hover:border-primary/30 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      template.status === "active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {template.status === "active" ? "Active" : "Draft"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet/10 text-violet">
                    {template.category}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Eye className="w-4 h-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Edit className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">{template.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{template.description}</p>

              {/* Fields preview */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.fields.map((field, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-lg text-xs bg-muted/50 text-muted-foreground flex items-center gap-1"
                  >
                    {field.type === "emoji" && "😊"}
                    {field.type === "number" && "#"}
                    {field.type === "text" && "T"}
                    {field.type === "yesno" && "✓"}
                    {field.type === "select" && "▼"}
                    {field.label.length > 20 ? field.label.substring(0, 20) + "..." : field.label}
                  </span>
                ))}
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {template.duration} days
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {template.frequency}
                </span>
              </div>

              {/* Stats (only for active templates) */}
              {template.status === "active" && (
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{template.activeUsers}</span>
                      <span className="text-muted-foreground">participants</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {template.completionRate}%
                      </span>
                      <span className="text-muted-foreground">completion</span>
                    </div>
                  </div>

                  <Link href={`/org/${template.id}/insights`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl gap-1 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Sparkles className="w-4 h-4" />
                      Insights
                    </Button>
                  </Link>
                </div>
              )}

              {/* Publish button for drafts */}
              {template.status === "draft" && (
                <div className="pt-4 border-t border-border/50">
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                    Publish Template
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Link href="/org/create">
              <Button className="rounded-2xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4" />
                Create Template
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
