"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
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

type ApiTemplate = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  durationDays: number | null;
  frequency: string | null;
  categories?: string[];
  tags?: string[];
  featured?: boolean;
  difficulty?: string | null;
  rating?: number | null;
  usageCount?: number | null;
  fields: { id: string; label: string; type: string; order: number }[];
};

const CARD_STYLES = [
  { icon: <Target className="w-6 h-6" />, color: "from-green-400 to-emerald-500" },
  { icon: <Brain className="w-6 h-6" />, color: "from-blue-400 to-indigo-500" },
  { icon: <Heart className="w-6 h-6" />, color: "from-orange-400 to-rose-500" },
  { icon: <TrendingUp className="w-6 h-6" />, color: "from-purple-400 to-pink-500" },
  { icon: <Book className="w-6 h-6" />, color: "from-yellow-400 to-amber-500" },
  { icon: <Users className="w-6 h-6" />, color: "from-cyan-400 to-teal-500" },
];

function formatDuration(days: number | null): string {
  if (days == null) return "—";
  if (days === 7) return "1 week";
  if (days % 7 === 0) return `${days / 7} weeks`;
  return `${days} days`;
}

function TemplateCard({
  template,
  index,
  creatingId,
  onUseTemplate,
  variant = "outline",
}: {
  template: ApiTemplate;
  index: number;
  creatingId: string | null;
  onUseTemplate: (id: string) => void;
  variant?: "default" | "outline";
}) {
  const style = CARD_STYLES[index % CARD_STYLES.length];
  const duration = formatDuration(template.durationDays);
  const tags = template.tags ?? [];
  const categories = template.categories ?? [];
  const difficulty = template.difficulty ?? "Easy";

  return (
    <Card className="p-6 bg-card/80 backdrop-blur border-border/50 hover:shadow-lg transition-all hover:border-second/50 rounded-3xl group">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
      >
        {style.icon}
      </div>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-xl font-semibold text-foreground">{template.title}</h3>
        {template.featured && (
          <Badge className="rounded-2xl bg-yellow-500 text-white shrink-0">Featured</Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {template.description ?? ""}
      </p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {categories.map((c) => (
            <Badge key={c} variant="second" className="rounded-xl text-xs">
              {c}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{template.rating != null ? template.rating : "—"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{template.usageCount != null ? template.usageCount.toLocaleString() : "—"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge
          variant="outline"
          className={`rounded-2xl ${
            difficulty === "Easy"
              ? "bg-green-500/10 text-green-600 border-green-500/20"
              : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
          }`}
        >
          {difficulty}
        </Badge>
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="rounded-2xl">
            {tag}
          </Badge>
        ))}
      </div>

      <Button
        variant={variant}
        className="w-full rounded-3xl bg-transparent hover:bg-second/10 hover:text-second hover:border-second"
        disabled={creatingId === template.id}
        onClick={() => onUseTemplate(template.id)}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {creatingId === template.id ? "Creating…" : "Use Template"}
      </Button>
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card className="p-6 bg-card/80 border-border/50 rounded-3xl animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-muted mb-4" />
      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
      <div className="h-4 bg-muted rounded w-full mb-4" />
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-muted rounded w-12" />
        <div className="h-4 bg-muted rounded w-12" />
        <div className="h-4 bg-muted rounded w-16" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-muted rounded-full w-14" />
        <div className="h-6 bg-muted rounded-full w-20" />
      </div>
      <div className="h-10 bg-muted rounded-3xl w-full" />
    </Card>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [templates, setTemplates] = useState<ApiTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    fetch("/api/experiment-templates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load templates");
        return res.json();
      })
      .then((data: ApiTemplate[]) => {
        if (!cancelled) setTemplates(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled)
          setFetchError(err instanceof Error ? err.message : "Failed to load templates");
        setTemplates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const searchFiltered = templates.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryCounts = (() => {
    const all = { id: "all", label: "All Templates", count: searchFiltered.length };
    const byCategory = new Map<string, number>();
    for (const t of searchFiltered) {
      for (const c of t.categories ?? []) {
        byCategory.set(c, (byCategory.get(c) ?? 0) + 1);
      }
    }
    const rest = Array.from(byCategory.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, count]) => ({ id, label: id, count }));
    return [all, ...rest];
  })();

  const filteredTemplates =
    selectedCategory === "all"
      ? searchFiltered
      : searchFiltered.filter((t) => (t.categories ?? []).includes(selectedCategory));

  const featuredTemplates = filteredTemplates.filter((t) => t.featured === true);
  const otherTemplates = filteredTemplates.filter((t) => t.featured !== true);

  async function handleUseTemplate(templateId: string) {
    if (creatingId) return;
    setCreatingId(templateId);
    try {
      const res = await fetch(`/api/experiment-templates/${templateId}/create`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create experiment");
      }
      const experiment = await res.json();
      router.push(`/experiments/${experiment.id}`);
    } catch (err) {
      setCreatingId(null);
    }
  }

  return (
    <IndividualContainer>
      <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Experiment Templates</h1>
          <p className="text-muted-foreground text-lg">
            Discover proven experiments to accelerate your personal growth
          </p>
        </div>

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
            className="rounded-3xl border-border/50 bg-background/50 hover:bg-second/10 hover:text-second hover:border-second"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="rounded-3xl" asChild>
            <Link href="/experiments/create">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Custom
            </Link>
          </Button>
        </div>

        <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
          {categoryCounts.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-3xl whitespace-nowrap transition-all hover:scale-105 ${
                selectedCategory !== category.id
                  ? "bg-transparent hover:bg-second/10 hover:text-second hover:border-second"
                  : ""
              }`}
            >
              {category.label}
              <Badge variant="second" className="ml-2 rounded-full">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {fetchError && (
          <div className="mb-6 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {fetchError}
          </div>
        )}

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !fetchError && filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
            <p className="text-muted-foreground">
              {templates.length === 0
                ? "Templates will appear here once available."
                : "Try adjusting your search or category."}
            </p>
          </div>
        )}

        {!loading && filteredTemplates.length > 0 && (
          <>
            {featuredTemplates.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <h2 className="text-2xl font-bold text-foreground">Featured Templates</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredTemplates.map((template, index) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      index={index}
                      creatingId={creatingId}
                      onUseTemplate={handleUseTemplate}
                      variant="default"
                    />
                  ))}
                </div>
              </div>
            )}

            {otherTemplates.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  All Templates
                  <span className="text-muted-foreground text-lg ml-2">
                    ({otherTemplates.length} more)
                  </span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {otherTemplates.map((template, index) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      index={featuredTemplates.length + index}
                      creatingId={creatingId}
                      onUseTemplate={handleUseTemplate}
                      variant="outline"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
    </IndividualContainer>
  );
}
