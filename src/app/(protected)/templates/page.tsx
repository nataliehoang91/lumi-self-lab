"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Star,
  Users,
  Calendar,
  Sparkles,
  Target,
  Heart,
  Brain,
  TrendingUp,
  Book,
} from "lucide-react";

const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates", count: 24 },
  { id: "focus", label: "Focus & Productivity", count: 8 },
  { id: "wellness", label: "Wellness & Health", count: 6 },
  { id: "creativity", label: "Creativity", count: 4 },
  { id: "learning", label: "Learning & Growth", count: 3 },
  { id: "social", label: "Social & Relationships", count: 3 },
];

const FEATURED_TEMPLATES = [
  {
    id: "1",
    icon: <Target className="w-6 h-6" />,
    color: "from-green-400 to-emerald-500",
    title: "Morning Energy Tracking",
    description:
      "Monitor your energy levels throughout the morning to optimize your daily routine",
    rating: 4.8,
    users: 2400,
    duration: "2 weeks",
    difficulty: "Easy",
    tags: ["Energy", "Morning Routine"],
    featured: true,
  },
  {
    id: "2",
    icon: <Brain className="w-6 h-6" />,
    color: "from-blue-400 to-indigo-500",
    title: "Deep Work Sessions",
    description:
      "Track your focus and productivity during dedicated work blocks",
    rating: 4.9,
    users: 1800,
    duration: "3 weeks",
    difficulty: "Medium",
    tags: ["Focus", "Productivity"],
    featured: true,
  },
  {
    id: "3",
    icon: <Heart className="w-6 h-6" />,
    color: "from-orange-400 to-rose-500",
    title: "Gratitude Practice",
    description:
      "Daily gratitude journaling to improve mental wellbeing and positivity",
    rating: 4.7,
    users: 3200,
    duration: "4 weeks",
    difficulty: "Easy",
    tags: ["Wellness", "Mindfulness"],
    featured: true,
  },
];

const ALL_TEMPLATES = [
  ...FEATURED_TEMPLATES,
  {
    id: "4",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-purple-400 to-pink-500",
    title: "Decision-Making Patterns",
    description: "Understand how you make choices under different conditions",
    rating: 4.6,
    users: 1500,
    duration: "2 weeks",
    difficulty: "Medium",
    tags: ["Self-Discovery", "Growth"],
    featured: false,
  },
  {
    id: "5",
    icon: <Book className="w-6 h-6" />,
    color: "from-yellow-400 to-amber-500",
    title: "Reading Habit Builder",
    description: "Build a consistent reading practice and track your progress",
    rating: 4.5,
    users: 2100,
    duration: "3 weeks",
    difficulty: "Easy",
    tags: ["Learning", "Habits"],
    featured: false,
  },
  {
    id: "6",
    icon: <Users className="w-6 h-6" />,
    color: "from-cyan-400 to-teal-500",
    title: "Social Confidence Check",
    description:
      "Explore your confidence levels in different social situations",
    rating: 4.8,
    users: 1200,
    duration: "3 weeks",
    difficulty: "Medium",
    tags: ["Social", "Relationships"],
    featured: false,
  },
];

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTemplates = ALL_TEMPLATES.filter((template) => {
    const matchesSearch = template.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredTemplates = filteredTemplates.filter((t) => t.featured);
  const otherTemplates = filteredTemplates.filter((t) => !t.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-purple-50 dark:from-background dark:via-background dark:to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Experiment Templates
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover proven experiments to accelerate your personal growth
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-3xl border-border/50 bg-background/50"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-3xl border-border/50 bg-background/50 hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="rounded-3xl" asChild>
            <Link href="/dashboard">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Custom
            </Link>
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-3xl whitespace-nowrap transition-all hover:scale-105 ${
                selectedCategory !== category.id
                  ? "bg-transparent hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
                  : ""
              }`}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 rounded-full">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Featured Templates */}
        {featuredTemplates.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-foreground">
                Featured Templates
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all hover:border-secondary/50 rounded-3xl group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {template.icon}
                  </div>

                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {template.title}
                    </h3>
                    {template.featured && (
                      <Badge className="rounded-2xl bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{template.users.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{template.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className={`rounded-2xl ${
                        template.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      }`}
                    >
                      {template.difficulty}
                    </Badge>
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-2xl"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full rounded-3xl hover:bg-secondary hover:text-white transition-all">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        {otherTemplates.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              All Templates
              <span className="text-muted-foreground text-lg ml-2">
                ({otherTemplates.length} templates found)
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all hover:border-secondary/50 rounded-3xl group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                  >
                    {template.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{template.users.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{template.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className={`rounded-2xl ${
                        template.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                      }`}
                    >
                      {template.difficulty}
                    </Badge>
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-2xl"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-3xl bg-transparent hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
